export type UploadProvider = "linode" | "s3" | "minio";

export interface UploadedFileRecord {
  folder: string | null;
  isThumbnail?: boolean;
  key: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url: string;
}

export const IMAGE_UPLOAD_ROUTE = "images";
export const AVATAR_UPLOAD_ROUTE = "avatars";
export const AUDIO_UPLOAD_ROUTE = "audio";
export const VIDEO_UPLOAD_ROUTE = "videos";
export const FILE_UPLOAD_ROUTE = "files";

export type UploadRouteName =
  | typeof AUDIO_UPLOAD_ROUTE
  | typeof AVATAR_UPLOAD_ROUTE
  | typeof FILE_UPLOAD_ROUTE
  | typeof IMAGE_UPLOAD_ROUTE
  | typeof VIDEO_UPLOAD_ROUTE;

export const DEFAULT_UPLOAD_API_PATH = "/api/upload";
export const DEFAULT_UPLOAD_DELETE_API_PATH = `${DEFAULT_UPLOAD_API_PATH}/delete`;
export const DEFAULT_UPLOAD_OBJECT_API_PATH = `${DEFAULT_UPLOAD_API_PATH}/object`;
export const DEFAULT_UPLOAD_PROXY_API_PATH = `${DEFAULT_UPLOAD_API_PATH}/proxy`;
export const DEFAULT_UPLOAD_RENAME_API_PATH = `${DEFAULT_UPLOAD_API_PATH}/rename`;

export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
] as const;

export const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "audio/webm",
  "audio/mp4",
] as const;

export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
] as const;

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/json",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed",
] as const;

export const FILE_UPLOAD_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...AUDIO_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
  ...DOCUMENT_MIME_TYPES,
] as const;

const fallbackFileName = "file";
const leadingSlashesPattern = /^\/+/;
const trailingSlashesPattern = /\/+$/;
const linodeObjectsHostSuffix = ".linodeobjects.com";

const sanitizeSegment = (value: string) =>
  value
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) =>
      segment
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
    )
    .filter(Boolean)
    .join("/");

const splitFileName = (fileName: string) => {
  const trimmed = fileName.trim();
  const lastDotIndex = trimmed.lastIndexOf(".");

  if (lastDotIndex <= 0 || lastDotIndex === trimmed.length - 1) {
    return {
      baseName: trimmed || fallbackFileName,
      extension: "",
    };
  }

  return {
    baseName: trimmed.slice(0, lastDotIndex) || fallbackFileName,
    extension: trimmed.slice(lastDotIndex + 1),
  };
};

export const sanitizeUploadFolder = (folder?: null | string) => {
  if (!folder) {
    return "";
  }

  return sanitizeSegment(folder);
};

export const sanitizeUploadFileName = (fileName: string) => {
  const { baseName, extension } = splitFileName(fileName);
  const safeBaseName =
    sanitizeSegment(baseName).replace(/\//g, "-") || fallbackFileName;
  const safeExtension = sanitizeSegment(extension).replace(/\//g, "");

  return safeExtension ? `${safeBaseName}.${safeExtension}` : safeBaseName;
};

export const buildS3CompatibleUploadBaseUrl = ({
  bucketName,
  endpoint,
}: {
  bucketName: string;
  endpoint: string;
}) =>
  `${endpoint.replace(trailingSlashesPattern, "")}/${encodeURIComponent(bucketName)}`;

export const buildLinodeUploadBaseUrl = ({
  bucketName,
  region,
}: {
  bucketName: string;
  region: string;
}) => `https://${bucketName}.${region}.linodeobjects.com`;

export const buildPublicUploadObjectBaseUrl = (origin: string) =>
  `${origin.replace(trailingSlashesPattern, "")}${DEFAULT_UPLOAD_OBJECT_API_PATH}`;

export const buildUploadObjectKey = ({
  fileName,
  folder,
}: {
  fileName: string;
  folder?: null | string;
}) => {
  const safeFolder = sanitizeUploadFolder(folder);
  const safeFileName = sanitizeUploadFileName(fileName);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uniqueId = crypto.randomUUID().slice(0, 8);
  const keyParts = [
    safeFolder,
    `${timestamp}-${uniqueId}-${safeFileName}`,
  ].filter(Boolean);

  return keyParts.join("/");
};

export const buildUploadFileUrl = ({
  baseUrl,
  key,
}: {
  baseUrl: string;
  key: string;
}) => `${baseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;

export const getFolderFromObjectKey = (key: string) => {
  const parts = key.split("/").filter(Boolean);

  if (parts.length <= 1) {
    return "";
  }

  return parts.slice(0, -1).join("/");
};

export const getFileNameFromObjectKey = (key: string) => {
  const parts = key.split("/").filter(Boolean);
  return parts.at(-1) ?? fallbackFileName;
};

export const getFileTypeFromName = (name: string) => {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";

  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "avif":
      return "image/avif";
    case "ico":
      return "image/x-icon";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    case "flac":
      return "audio/flac";
    case "pdf":
      return "application/pdf";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "json":
      return "application/json";
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    default:
      return "";
  }
};

export const extractUploadObjectKey = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const decodedPath = decodeURIComponent(parsedUrl.pathname);
    const publicObjectPrefix = `${DEFAULT_UPLOAD_OBJECT_API_PATH}/`;

    if (decodedPath.startsWith(publicObjectPrefix)) {
      return decodedPath.slice(publicObjectPrefix.length);
    }

    const path = decodedPath.replace(leadingSlashesPattern, "");

    if (parsedUrl.hostname.endsWith(linodeObjectsHostSuffix)) {
      return path;
    }

    return path.split("/").slice(1).join("/");
  } catch {
    return "";
  }
};

export const createUploadedFileRecord = ({
  baseUrl,
  key,
  name,
  size,
  type,
}: {
  baseUrl: string;
  key: string;
  name: string;
  size: number;
  type: string;
}): UploadedFileRecord => ({
  folder: sanitizeUploadFolder(getFolderFromObjectKey(key)) || null,
  key,
  name,
  size,
  type,
  uploadedAt: new Date().toISOString(),
  url: buildUploadFileUrl({ baseUrl, key }),
});

export const createUploadedFileRecordFromUrl = (
  url: string
): null | UploadedFileRecord => {
  const key = extractUploadObjectKey(url);

  if (!key) {
    return null;
  }

  const name = decodeURIComponent(getFileNameFromObjectKey(key));

  return {
    folder: sanitizeUploadFolder(getFolderFromObjectKey(key)) || null,
    key,
    name,
    size: 0,
    type: getFileTypeFromName(name),
    uploadedAt: new Date().toISOString(),
    url,
  };
};

export const isExternalUploadKey = (key: string) => {
  try {
    const parsedUrl = new URL(key);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};
