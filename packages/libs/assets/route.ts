import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

export interface PublicAssetRouteConfig {
  assetsRoot: string;
  cacheControl?: string;
}

export interface PublicAssetRouteContext {
  params:
    | {
        path?: string[];
      }
    | Promise<{
        path?: string[];
      }>;
}

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const notFound = () => new Response("Not found", { status: 404 });

const isSafeAssetSegment = (segment: string) =>
  Boolean(segment) &&
  segment !== "." &&
  segment !== ".." &&
  !segment.includes("/") &&
  !segment.includes("\\");

export function createPublicAssetRoute({
  assetsRoot,
  cacheControl = "public, max-age=31536000, immutable",
}: PublicAssetRouteConfig) {
  const root = resolve(assetsRoot);
  const rootPrefix = root.endsWith(sep) ? root : `${root}${sep}`;

  return async function GET(
    _request: Request,
    context: PublicAssetRouteContext
  ) {
    const params = await context.params;
    const path = params.path ?? [];

    if (path.length === 0 || !path.every(isSafeAssetSegment)) {
      return notFound();
    }

    const assetPath = resolve(root, ...path);

    if (!(assetPath === root || assetPath.startsWith(rootPrefix))) {
      return notFound();
    }

    try {
      const body = await readFile(assetPath);
      const contentType =
        contentTypes[extname(assetPath).toLowerCase()] ??
        "application/octet-stream";

      return new Response(body, {
        headers: {
          "Cache-Control": cacheControl,
          "Content-Type": contentType,
        },
      });
    } catch {
      return notFound();
    }
  };
}
