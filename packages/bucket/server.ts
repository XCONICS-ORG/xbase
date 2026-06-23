import { type Router, route } from "@better-upload/server";
import { aws, linode, minio } from "@better-upload/server/clients";
import { z } from "zod";
import { createUploadStorageConfig } from "./config";
import {
  AUDIO_MIME_TYPES,
  AUDIO_UPLOAD_ROUTE,
  AVATAR_UPLOAD_ROUTE,
  buildUploadObjectKey,
  DOCUMENT_MIME_TYPES,
  FILE_UPLOAD_MIME_TYPES,
  FILE_UPLOAD_ROUTE,
  IMAGE_MIME_TYPES,
  IMAGE_UPLOAD_ROUTE,
  sanitizeUploadFileName,
  VIDEO_MIME_TYPES,
  VIDEO_UPLOAD_ROUTE,
} from "./shared";

const clientMetadataSchema = z
  .object({
    folder: z.string().trim().optional(),
  })
  .optional();

export const uploadConfig = createUploadStorageConfig();

const createUploadClient = (): Router["client"] => {
  if (uploadConfig.provider === "linode") {
    return linode({
      accessKey: uploadConfig.accessKeyId,
      region: uploadConfig.region,
      secretKey: uploadConfig.secretAccessKey,
    });
  }

  if (uploadConfig.provider === "s3") {
    return aws({
      accessKeyId: uploadConfig.accessKeyId,
      region: uploadConfig.region,
      secretAccessKey: uploadConfig.secretAccessKey,
    });
  }

  return minio({
    accessKeyId: uploadConfig.accessKeyId,
    endpoint: uploadConfig.endpoint,
    region: uploadConfig.region,
    secretAccessKey: uploadConfig.secretAccessKey,
  });
};

export const uploadClient: Router["client"] = createUploadClient();

export const uploadBucketName = uploadConfig.bucketName;
export const uploadPublicBaseUrl = uploadConfig.publicBaseUrl;

const createUploadRoute = ({
  fileTypes,
  maxFileSize,
  maxFiles = 10,
}: {
  fileTypes: string[];
  maxFileSize: number;
  maxFiles?: number;
}) =>
  route({
    clientMetadataSchema,
    fileTypes,
    maxFiles,
    maxFileSize,
    multipleFiles: true,
    onAfterSignedUrl: async () => ({
      metadata: {
        baseUrl: uploadPublicBaseUrl,
      },
    }),
    onBeforeUpload: async ({ clientMetadata }) => ({
      generateObjectInfo: async ({ file }) => ({
        acl: uploadConfig.provider === "linode" ? "public-read" : undefined,
        cacheControl: "public, max-age=31536000, immutable",
        key: buildUploadObjectKey({
          fileName: file.name,
          folder: clientMetadata?.folder,
        }),
        metadata: {
          originalname: sanitizeUploadFileName(file.name),
        },
      }),
    }),
    signedUrlExpiresIn: 300,
  });

export const uploadRouter: Router = {
  bucketName: uploadBucketName,
  client: uploadClient,
  routes: {
    [AVATAR_UPLOAD_ROUTE]: createUploadRoute({
      fileTypes: [...IMAGE_MIME_TYPES],
      maxFileSize: 5 * 1024 * 1024,
      maxFiles: 1,
    }),
    [IMAGE_UPLOAD_ROUTE]: createUploadRoute({
      fileTypes: [...IMAGE_MIME_TYPES],
      maxFileSize: 5 * 1024 * 1024,
      maxFiles: 12,
    }),
    [AUDIO_UPLOAD_ROUTE]: createUploadRoute({
      fileTypes: [...AUDIO_MIME_TYPES],
      maxFileSize: 250 * 1024 * 1024,
      maxFiles: 12,
    }),
    [VIDEO_UPLOAD_ROUTE]: createUploadRoute({
      fileTypes: [...VIDEO_MIME_TYPES],
      maxFileSize: 250 * 1024 * 1024,
      maxFiles: 6,
    }),
    [FILE_UPLOAD_ROUTE]: createUploadRoute({
      fileTypes: [...FILE_UPLOAD_MIME_TYPES, ...DOCUMENT_MIME_TYPES],
      maxFileSize: 250 * 1024 * 1024,
      maxFiles: 12,
    }),
  },
};
