import { toRouteHandler } from "@better-upload/server/adapters/next";
import {
  deleteObject,
  getObjectStream,
  moveObject,
} from "@better-upload/server/helpers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  uploadBucketName,
  uploadClient,
  uploadConfig,
  uploadPublicBaseUrl,
  uploadRouter,
} from "./server";
import {
  buildPublicUploadObjectBaseUrl,
  buildUploadFileUrl,
  buildUploadObjectKey,
  DEFAULT_UPLOAD_PROXY_API_PATH,
  getFileNameFromObjectKey,
  getFolderFromObjectKey,
  isExternalUploadKey,
  sanitizeUploadFileName,
  sanitizeUploadFolder,
} from "./shared";

interface ObjectRouteContext {
  params: Promise<{ key: string[] }>;
}

const deleteUploadSchema = z.object({
  key: z.string().trim().min(1, "File key is required."),
});

const renameUploadSchema = z.object({
  folder: z.string().trim().optional(),
  key: z.string().trim().min(1, "File key is required."),
  nextName: z.string().trim().min(1, "File name is required."),
});

const forwardedHeaderNames = new Set([
  "cache-control",
  "content-length",
  "content-type",
]);

const getFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
    return "";
  }

  return fileName.slice(lastDotIndex);
};

const removeFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex <= 0) {
    return fileName;
  }

  return fileName.slice(0, lastDotIndex);
};

const preserveSourceExtension = ({
  nextName,
  sourceKey,
}: {
  nextName: string;
  sourceKey: string;
}) => {
  const sourceExtension = getFileExtension(getFileNameFromObjectKey(sourceKey));

  return sourceExtension
    ? `${removeFileExtension(nextName)}${sourceExtension}`
    : nextName;
};

export const getUploadPublicOrigin = (request: NextRequest) => {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol || request.nextUrl.protocol.replace(":", "");

  return host ? `${protocol}://${host}` : request.nextUrl.origin;
};

const { POST: createSignedUploadUrls } = toRouteHandler(uploadRouter);

const rewriteSignedUrls = (payload: unknown, request: NextRequest): unknown => {
  if (Array.isArray(payload)) {
    return payload.map((item) => rewriteSignedUrls(item, request));
  }

  if (!payload || typeof payload !== "object") {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (
        (key === "signedUrl" || key.endsWith("SignedUrl")) &&
        typeof value === "string" &&
        value
      ) {
        const proxyUrl = new URL(
          DEFAULT_UPLOAD_PROXY_API_PATH,
          getUploadPublicOrigin(request)
        );
        proxyUrl.searchParams.set("target", value);

        return [key, proxyUrl.toString()];
      }

      return [key, rewriteSignedUrls(value, request)];
    })
  );
};

export async function POST(request: NextRequest) {
  const response = await createSignedUploadUrls(request);

  if (!(response.ok && uploadConfig.proxySignedUrls)) {
    return response;
  }

  const payload = rewriteSignedUrls(await response.json(), request);
  const result =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : {};
  const metadata =
    result.metadata &&
    typeof result.metadata === "object" &&
    !Array.isArray(result.metadata)
      ? (result.metadata as Record<string, unknown>)
      : {};

  return NextResponse.json({
    ...result,
    metadata: {
      ...metadata,
      baseUrl: buildPublicUploadObjectBaseUrl(getUploadPublicOrigin(request)),
    },
  });
}

export async function deleteUpload(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsedBody = deleteUploadSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: parsedBody.error.issues[0]?.message },
      { status: 400 }
    );
  }

  if (isExternalUploadKey(parsedBody.data.key)) {
    return NextResponse.json({ success: true });
  }

  try {
    await deleteObject(uploadClient, {
      bucket: uploadBucketName,
      key: parsedBody.data.key,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete the uploaded file." },
      { status: 500 }
    );
  }
}

export async function renameUpload(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsedBody = renameUploadSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: parsedBody.error.issues[0]?.message },
      { status: 400 }
    );
  }

  if (isExternalUploadKey(parsedBody.data.key)) {
    return NextResponse.json(
      { message: "External files cannot be renamed." },
      { status: 400 }
    );
  }

  const nextFolder =
    sanitizeUploadFolder(parsedBody.data.folder) ||
    getFolderFromObjectKey(parsedBody.data.key);
  const nextFileName = sanitizeUploadFileName(
    preserveSourceExtension({
      nextName: parsedBody.data.nextName,
      sourceKey: parsedBody.data.key,
    })
  );
  const nextKey = buildUploadObjectKey({
    fileName: nextFileName,
    folder: nextFolder,
  });

  try {
    await moveObject(uploadClient, {
      destination: {
        bucket: uploadBucketName,
        key: nextKey,
      },
      source: {
        bucket: uploadBucketName,
        key: parsedBody.data.key,
      },
    });

    const baseUrl = uploadConfig.proxySignedUrls
      ? buildPublicUploadObjectBaseUrl(getUploadPublicOrigin(request))
      : uploadPublicBaseUrl;

    return NextResponse.json({
      file: {
        folder: nextFolder || null,
        key: nextKey,
        name: nextFileName,
        url: buildUploadFileUrl({ baseUrl, key: nextKey }),
      },
      success: true,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to rename the uploaded file." },
      { status: 500 }
    );
  }
}

const getObjectKey = async (context: ObjectRouteContext) => {
  const { key } = await context.params;

  return key.map(decodeURIComponent).join("/");
};

export const streamUploadObject = async (
  request: NextRequest,
  context: ObjectRouteContext
) => {
  const key = await getObjectKey(context);

  if (!key.trim()) {
    return NextResponse.json(
      { message: "File key is required." },
      { status: 400 }
    );
  }

  try {
    const object = await getObjectStream(uploadClient, {
      bucket: uploadBucketName,
      key,
    });
    const headers = new Headers({
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": object.contentType ?? "application/octet-stream",
    });

    if (object.contentLength !== undefined) {
      headers.set("Content-Length", String(object.contentLength));
    }

    if (object.eTag) {
      headers.set("ETag", object.eTag);
    }

    return new Response(request.method === "HEAD" ? null : object.stream, {
      headers,
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("NoSuchKey")) {
      return NextResponse.json(
        { message: "Uploaded file not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Unable to connect to object storage." },
      { status: 502 }
    );
  }
};

const getSignedStorageUrl = (request: NextRequest) => {
  const target = request.nextUrl.searchParams.get("target");

  if (!target) {
    return null;
  }

  try {
    const storageUrl = new URL(target);
    const endpointUrl = new URL(uploadConfig.endpoint);
    const validOrigin =
      storageUrl.origin === endpointUrl.origin ||
      storageUrl.hostname.endsWith(".linodeobjects.com");

    return validOrigin ? storageUrl : null;
  } catch {
    return null;
  }
};

export const proxySignedUploadRequest = async (request: NextRequest) => {
  const storageUrl = getSignedStorageUrl(request);

  if (!storageUrl) {
    return NextResponse.json(
      { message: "Invalid upload target." },
      { status: 400 }
    );
  }

  const headers = new Headers();

  for (const [name, value] of request.headers.entries()) {
    const lowerName = name.toLowerCase();

    if (forwardedHeaderNames.has(lowerName) || lowerName.startsWith("x-amz-")) {
      headers.set(name, value);
    }
  }

  try {
    const upstreamResponse = await fetch(storageUrl, {
      body:
        request.method === "DELETE" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      headers,
      method: request.method,
    });
    const responseHeaders = new Headers();

    for (const name of ["content-type", "etag", "x-amz-request-id"]) {
      const value = upstreamResponse.headers.get(name);

      if (value) {
        responseHeaders.set(name, value);
      }
    }

    return new Response(upstreamResponse.body, {
      headers: responseHeaders,
      status: upstreamResponse.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to object storage." },
      { status: 502 }
    );
  }
};
