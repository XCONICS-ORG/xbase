import { uploadFiles } from "@better-upload/client";
import {
  createUploadedFileRecord,
  DEFAULT_UPLOAD_API_PATH,
  type UploadedFileRecord,
  type UploadRouteName,
} from "./shared";

export type { UploadedFileRecord, UploadRouteName } from "./shared";
// biome-ignore lint/performance/noBarrelFile: Client entrypoint intentionally re-exports upload constants for browser components.
export {
  AUDIO_MIME_TYPES,
  AUDIO_UPLOAD_ROUTE,
  AVATAR_UPLOAD_ROUTE,
  DEFAULT_UPLOAD_API_PATH,
  DOCUMENT_MIME_TYPES,
  FILE_UPLOAD_MIME_TYPES,
  FILE_UPLOAD_ROUTE,
  IMAGE_MIME_TYPES,
  IMAGE_UPLOAD_ROUTE,
  VIDEO_MIME_TYPES,
  VIDEO_UPLOAD_ROUTE,
} from "./shared";

export type UploadProgressHandler = (file: File, progress: number) => void;

export interface UploadFilesOptions {
  api?: string;
  files: File[];
  folder?: string;
  onProgress?: UploadProgressHandler;
  route: UploadRouteName | string;
}

export const uploadFilesToStorage = async ({
  api = DEFAULT_UPLOAD_API_PATH,
  files,
  folder,
  onProgress,
  route,
}: UploadFilesOptions): Promise<UploadedFileRecord[]> => {
  const result = await uploadFiles({
    api,
    files,
    metadata: folder ? { folder } : undefined,
    onFileStateChange: ({ file }) => {
      onProgress?.(file.raw, Math.round(file.progress * 100));
    },
    route,
  });

  const baseUrl =
    typeof result.metadata.baseUrl === "string" ? result.metadata.baseUrl : "";

  if (!baseUrl) {
    throw new Error("Upload completed without a public file URL base.");
  }

  return result.files.map((file) =>
    createUploadedFileRecord({
      baseUrl,
      key: file.objectInfo.key,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  );
};
