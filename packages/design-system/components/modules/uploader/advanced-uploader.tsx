"use client";

import {
  AUDIO_MIME_TYPES,
  AUDIO_UPLOAD_ROUTE,
  AVATAR_UPLOAD_ROUTE,
  DEFAULT_UPLOAD_API_PATH,
  FILE_UPLOAD_MIME_TYPES,
  FILE_UPLOAD_ROUTE,
  IMAGE_MIME_TYPES,
  IMAGE_UPLOAD_ROUTE,
  type UploadedFileRecord,
  type UploadRouteName,
  uploadFilesToStorage,
  VIDEO_MIME_TYPES,
  VIDEO_UPLOAD_ROUTE,
} from "@xbase/bucket/client";
import { Button } from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import {
  FileArchive,
  FileAudio,
  FileIcon,
  FileImage,
  FileText,
  FileVideo,
  PencilLine,
  Star,
  Trash2,
  UploadCloud,
  User,
  X,
} from "@xbase/icons/lucide";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export type AdvancedUploaderMode =
  | "audio"
  | "avatar"
  | "files"
  | "images"
  | "video";

export interface AdvancedUploaderPreset {
  accept: string;
  maxFiles: number;
  maxSizeBytes: number;
  mode: AdvancedUploaderMode;
  multiple: boolean;
  route: UploadRouteName;
}

export interface AdvancedUploaderUploadOptions {
  files: File[];
  folder?: string;
  onProgress?: (file: File, progress: number) => void;
  route: string;
}

export interface AdvancedUploaderProps {
  accept?: string;
  allowDelete?: boolean;
  allowRename?: boolean;
  apiBasePath?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  folder?: string;
  label?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  mode?: AdvancedUploaderMode;
  multiple?: boolean;
  onDeleteFile?: (file: UploadedFileRecord) => Promise<void> | void;
  onRenameFile?: (
    file: UploadedFileRecord,
    nextName: string
  ) =>
    | Pick<UploadedFileRecord, "folder" | "key" | "name" | "url">
    | Promise<Pick<UploadedFileRecord, "folder" | "key" | "name" | "url">>;
  onValueChange?: (files: UploadedFileRecord[]) => void;
  route?: string;
  uploadFiles?: (
    options: AdvancedUploaderUploadOptions
  ) => Promise<UploadedFileRecord[]>;
  value?: UploadedFileRecord[];
}

interface PendingUpload {
  error?: string;
  file: File;
  id: string;
  progress: number;
  status: "error" | "uploading";
}

export const ADVANCED_UPLOADER_PRESETS: Record<
  AdvancedUploaderMode,
  AdvancedUploaderPreset
> = {
  avatar: {
    accept: IMAGE_MIME_TYPES.join(","),
    maxFiles: 1,
    maxSizeBytes: 5 * 1024 * 1024,
    mode: "avatar",
    multiple: false,
    route: AVATAR_UPLOAD_ROUTE,
  },
  images: {
    accept: IMAGE_MIME_TYPES.join(","),
    maxFiles: 12,
    maxSizeBytes: 5 * 1024 * 1024,
    mode: "images",
    multiple: true,
    route: IMAGE_UPLOAD_ROUTE,
  },
  audio: {
    accept: AUDIO_MIME_TYPES.join(","),
    maxFiles: 12,
    maxSizeBytes: 250 * 1024 * 1024,
    mode: "audio",
    multiple: true,
    route: AUDIO_UPLOAD_ROUTE,
  },
  video: {
    accept: VIDEO_MIME_TYPES.join(","),
    maxFiles: 6,
    maxSizeBytes: 250 * 1024 * 1024,
    mode: "video",
    multiple: true,
    route: VIDEO_UPLOAD_ROUTE,
  },
  files: {
    accept: FILE_UPLOAD_MIME_TYPES.join(","),
    maxFiles: 12,
    maxSizeBytes: 250 * 1024 * 1024,
    mode: "files",
    multiple: true,
    route: FILE_UPLOAD_ROUTE,
  },
};

const formatBytes = (value: number) => {
  if (!value) {
    return "0 B";
  }

  const sizes = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    sizes.length - 1
  );

  return `${(value / 1024 ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1)} ${sizes[unitIndex]}`;
};

const getRenameInputValue = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex <= 0) {
    return fileName;
  }

  return fileName.slice(0, lastDotIndex);
};

const getFileIcon = (file: UploadedFileRecord) => {
  if (file.type.startsWith("image/")) {
    return <FileImage className="size-4" />;
  }

  if (file.type.startsWith("audio/")) {
    return <FileAudio className="size-4" />;
  }

  if (file.type.startsWith("video/")) {
    return <FileVideo className="size-4" />;
  }

  if (
    file.type === "application/pdf" ||
    file.type.startsWith("text/") ||
    file.type === "application/json"
  ) {
    return <FileText className="size-4" />;
  }

  if (file.type.includes("zip") || file.type.includes("archive")) {
    return <FileArchive className="size-4" />;
  }

  return <FileIcon className="size-4" />;
};

const canPreviewImage = (file?: null | UploadedFileRecord) =>
  Boolean(file?.type.startsWith("image/"));

const canPreviewAudio = (file?: null | UploadedFileRecord) =>
  Boolean(file?.type.startsWith("audio/"));

const canPreviewVideo = (file?: null | UploadedFileRecord) =>
  Boolean(file?.type.startsWith("video/"));

const canSetPrimary = ({
  file,
  mode,
  multiple,
}: {
  file: UploadedFileRecord;
  mode: AdvancedUploaderMode;
  multiple: boolean;
}) => mode === "images" && multiple && file.type.startsWith("image/");

const defaultUploadFiles = ({
  files,
  folder,
  onProgress,
  route,
}: AdvancedUploaderUploadOptions) =>
  uploadFilesToStorage({
    files,
    folder,
    onProgress,
    route,
  });

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component coordinates upload, rename, delete, preview, and primary-image controls in one public UI surface.
export function AdvancedUploader({
  accept,
  allowDelete = true,
  allowRename = true,
  apiBasePath = DEFAULT_UPLOAD_API_PATH,
  className,
  description,
  disabled = false,
  folder,
  label,
  maxFiles,
  maxSizeBytes,
  mode = "files",
  multiple,
  onDeleteFile,
  onRenameFile,
  onValueChange,
  route,
  uploadFiles = defaultUploadFiles,
  value = [],
}: AdvancedUploaderProps) {
  const preset = ADVANCED_UPLOADER_PRESETS[mode];
  const resolvedMultiple = multiple ?? preset.multiple;
  const resolvedMaxFiles = maxFiles ?? preset.maxFiles;
  const resolvedMaxSizeBytes = maxSizeBytes ?? preset.maxSizeBytes;
  const resolvedAccept = accept ?? preset.accept;
  const resolvedRoute = route ?? preset.route;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [deleteKey, setDeleteKey] = useState<null | string>(null);
  const [renameKey, setRenameKey] = useState<null | string>(null);
  const [renameValue, setRenameValue] = useState("");

  const helperText = useMemo(() => {
    if (description) {
      return description;
    }

    const countText = resolvedMultiple
      ? `Up to ${resolvedMaxFiles} files`
      : "One file";

    return `${countText}, ${formatBytes(resolvedMaxSizeBytes)} each.`;
  }, [description, resolvedMaxFiles, resolvedMaxSizeBytes, resolvedMultiple]);

  const commitFiles = (files: UploadedFileRecord[]) => {
    onValueChange?.(files);
  };

  const withPrimaryImage = (files: UploadedFileRecord[]) => {
    if (mode !== "images" || files.length === 0) {
      return files;
    }

    if (files.some((file) => file.isThumbnail)) {
      return files;
    }

    return files.map((file, index) => ({
      ...file,
      isThumbnail: index === 0 && file.type.startsWith("image/"),
    }));
  };

  const setFileProgress = (file: File, progress: number) => {
    setPendingUploads((current) =>
      current.map((item) =>
        item.file === file
          ? {
              ...item,
              progress,
            }
          : item
      )
    );
  };

  const validateFiles = (files: File[]) => {
    const remainingSlots = resolvedMultiple
      ? Math.max(0, resolvedMaxFiles - value.length)
      : 1;
    const acceptedFiles = files.slice(0, remainingSlots);

    if (acceptedFiles.length < files.length) {
      toast.error(`Maximum ${resolvedMaxFiles} files allowed.`);
    }

    return acceptedFiles.filter((file) => {
      if (resolvedMaxSizeBytes && file.size > resolvedMaxSizeBytes) {
        toast.error(
          `${file.name} must be under ${formatBytes(resolvedMaxSizeBytes)}.`
        );
        return false;
      }

      if (resolvedAccept) {
        const acceptTypes = resolvedAccept
          .split(",")
          .map((item) => item.trim());
        const extension = `.${file.name.split(".").pop() ?? ""}`.toLowerCase();
        const isAccepted = acceptTypes.some(
          (type) =>
            type === file.type ||
            type.toLowerCase() === extension ||
            (type.endsWith("/*") &&
              file.type.startsWith(type.replace("/*", "/")))
        );

        if (!isAccepted) {
          toast.error(`${file.name} is not an allowed file type.`);
          return false;
        }
      }

      return true;
    });
  };

  const uploadSelectedFiles = async (selectedFiles: File[]) => {
    if (disabled) {
      return;
    }

    const files = validateFiles(selectedFiles);

    if (files.length === 0) {
      return;
    }

    const nextPendingUploads = files.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      progress: 0,
      status: "uploading" as const,
    }));

    setPendingUploads((current) => [...current, ...nextPendingUploads]);

    try {
      const uploadedFiles = await uploadFiles({
        files,
        folder,
        onProgress: setFileProgress,
        route: resolvedRoute,
      });
      const nextFiles = withPrimaryImage(
        resolvedMultiple
          ? [...value, ...uploadedFiles].slice(0, resolvedMaxFiles)
          : uploadedFiles.slice(-1)
      );

      commitFiles(nextFiles);
      setPendingUploads((current) =>
        current.filter(
          (item) =>
            !nextPendingUploads.some((pending) => pending.id === item.id)
        )
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload the selected files.";

      toast.error(message);
      setPendingUploads((current) =>
        current.map((item) =>
          nextPendingUploads.some((pending) => pending.id === item.id)
            ? {
                ...item,
                error: message,
                status: "error",
              }
            : item
        )
      );
    }
  };

  const removeFile = async (file: UploadedFileRecord) => {
    if (!allowDelete || disabled) {
      return;
    }

    setDeleteKey(file.key);

    try {
      if (onDeleteFile) {
        await onDeleteFile(file);
      } else {
        const response = await fetch(`${apiBasePath}/delete`, {
          body: JSON.stringify({ key: file.key }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as null | {
            message?: string;
          };
          throw new Error(
            payload?.message || "Unable to delete the uploaded file."
          );
        }
      }

      commitFiles(
        withPrimaryImage(value.filter((item) => item.key !== file.key))
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete the file."
      );
    } finally {
      setDeleteKey(null);
    }
  };

  const saveRename = async (file: UploadedFileRecord) => {
    if (!renameValue.trim()) {
      toast.error("File name is required.");
      return;
    }

    try {
      let renamedFile: Pick<
        UploadedFileRecord,
        "folder" | "key" | "name" | "url"
      >;

      if (onRenameFile) {
        renamedFile = await onRenameFile(file, renameValue);
      } else {
        const response = await fetch(`${apiBasePath}/rename`, {
          body: JSON.stringify({
            folder: file.folder ?? folder,
            key: file.key,
            nextName: renameValue,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const payload = (await response.json().catch(() => null)) as null | {
          file?: {
            folder: null | string;
            key: string;
            name: string;
            url: string;
          };
          message?: string;
        };

        if (!(response.ok && payload?.file)) {
          throw new Error(
            payload?.message || "Unable to rename the uploaded file."
          );
        }

        renamedFile = payload.file;
      }

      commitFiles(
        value.map((item) =>
          item.key === file.key
            ? {
                ...item,
                folder: renamedFile.folder ?? item.folder,
                key: renamedFile.key,
                name: renamedFile.name,
                url: renamedFile.url,
              }
            : item
        )
      );
      setRenameKey(null);
      setRenameValue("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to rename the file."
      );
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    uploadSelectedFiles(files).catch(() => undefined);
    event.target.value = "";
  };

  const singleFile = resolvedMultiple ? null : (value[0] ?? null);
  const pendingAvatarUpload = mode === "avatar" ? pendingUploads[0] : null;

  const setPrimaryFile = (file: UploadedFileRecord) => {
    commitFiles(
      value.map((item) => ({
        ...item,
        isThumbnail: item.key === file.key,
      }))
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1">
        {label ? <p className="font-medium text-sm">{label}</p> : null}
        <p className="text-muted-foreground text-xs">{helperText}</p>
      </div>

      <button
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-border border-dashed bg-muted/20 p-5 text-center outline-none transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
          isDragging && "border-primary bg-muted/50",
          mode === "avatar" &&
            "aspect-square w-36 items-center p-3 text-center sm:w-40"
        )}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          uploadSelectedFiles(Array.from(event.dataTransfer.files)).catch(
            () => undefined
          );
        }}
        type="button"
      >
        {mode === "avatar" ? (
          <div className="relative flex size-full flex-col items-center justify-center gap-2">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background sm:size-24">
              {canPreviewImage(singleFile) ? (
                // biome-ignore lint/performance/noImgElement: uploaded object URLs should render directly.
                <img
                  alt={singleFile?.name ?? "Uploaded avatar"}
                  className={cn(
                    "size-full object-cover transition-opacity duration-300",
                    pendingAvatarUpload && "opacity-35"
                  )}
                  height={96}
                  src={singleFile?.url}
                  width={96}
                />
              ) : (
                <User
                  className={cn(
                    "size-8 text-muted-foreground transition-opacity duration-300",
                    pendingAvatarUpload && "opacity-35"
                  )}
                />
              )}

              {pendingAvatarUpload ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 px-3 backdrop-blur-[1px]">
                  {pendingAvatarUpload.status === "error" ? (
                    <>
                      <X className="size-5 text-destructive" />
                      <p className="line-clamp-2 text-center text-[0.65rem] text-destructive leading-tight">
                        {pendingAvatarUpload.error}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pendingAvatarUpload.progress}%` }}
                        />
                      </div>
                      <p className="text-[0.65rem] text-muted-foreground leading-none">
                        {pendingAvatarUpload.progress}%
                      </p>
                    </>
                  )}
                </div>
              ) : null}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-medium text-xs">
                {singleFile ? "Replace avatar" : "Upload avatar"}
              </p>
              <p className="text-[0.7rem] text-muted-foreground leading-tight">
                {formatBytes(resolvedMaxSizeBytes)} max
              </p>
            </div>
            {singleFile && allowDelete ? (
              // biome-ignore lint/a11y/useSemanticElements: This stays a non-button control because it lives inside the upload button surface.
              <span
                aria-label="Delete avatar"
                className={cn(
                  "absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-md bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20",
                  (disabled || deleteKey === singleFile.key) &&
                    "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  removeFile(singleFile).catch(() => undefined);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    removeFile(singleFile).catch(() => undefined);
                  }
                }}
                role="button"
                tabIndex={disabled ? -1 : 0}
              >
                <Trash2 className="size-3" />
              </span>
            ) : null}
          </div>
        ) : (
          <>
            <div className="flex size-9 items-center justify-center rounded-md border border-border bg-background">
              <UploadCloud className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Drop files here or browse</p>
              <p className="text-muted-foreground text-xs">{helperText}</p>
            </div>
          </>
        )}
      </button>

      <input
        accept={resolvedAccept}
        className="sr-only"
        disabled={disabled}
        multiple={resolvedMultiple}
        onChange={onInputChange}
        ref={inputRef}
        type="file"
      />

      {pendingUploads.length > 0 && mode !== "avatar" ? (
        <div className="space-y-2">
          {pendingUploads.map((item) => (
            <div
              className="rounded-md border border-border bg-background p-3"
              key={item.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-xs">
                    {item.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.status === "error"
                      ? item.error
                      : `${item.progress}% uploaded`}
                  </p>
                </div>
                {item.status === "error" ? (
                  <Button
                    aria-label="Dismiss failed upload"
                    onClick={() =>
                      setPendingUploads((current) =>
                        current.filter((upload) => upload.id !== item.id)
                      )
                    }
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <X />
                  </Button>
                ) : null}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full bg-primary transition-all",
                    item.status === "error" && "bg-destructive"
                  )}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {value.length > 0 && mode !== "avatar" ? (
        <div className="grid gap-2">
          {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Each row coordinates preview, rename, primary, and delete state for one file. */}
          {value.map((file) => (
            <div
              className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-background p-3"
              key={file.key}
            >
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/30">
                {canPreviewImage(file) ? (
                  // biome-ignore lint/performance/noImgElement: uploaded object URLs should render directly.
                  <img
                    alt={file.name}
                    className="size-full object-cover"
                    height={48}
                    src={file.url}
                    width={48}
                  />
                ) : (
                  getFileIcon(file)
                )}
              </div>
              <div className="min-w-0 flex-1">
                {renameKey === file.key ? (
                  <input
                    autoFocus
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                    onChange={(event) => setRenameValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        saveRename(file).catch(() => undefined);
                      }

                      if (event.key === "Escape") {
                        setRenameKey(null);
                        setRenameValue("");
                      }
                    }}
                    value={renameValue}
                  />
                ) : (
                  <>
                    <a
                      className="block truncate font-medium text-sm hover:underline"
                      href={file.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {file.name}
                    </a>
                    <p className="text-muted-foreground text-xs">
                      {file.type || "application/octet-stream"}
                      {file.size ? ` - ${formatBytes(file.size)}` : ""}
                    </p>
                  </>
                )}
                {canPreviewAudio(file) ? (
                  <audio className="mt-2 h-8 w-full" controls src={file.url}>
                    <track
                      kind="captions"
                      label="Captions"
                      src="data:text/vtt;charset=utf-8,WEBVTT%0A%0A"
                    />
                  </audio>
                ) : null}
                {canPreviewVideo(file) ? (
                  <video
                    className="mt-2 max-h-52 w-full rounded bg-black"
                    controls
                    src={file.url}
                  >
                    <track
                      kind="captions"
                      label="Captions"
                      src="data:text/vtt;charset=utf-8,WEBVTT%0A%0A"
                    />
                  </video>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {renameKey === file.key ? (
                  <>
                    <Button
                      onClick={() => saveRename(file).catch(() => undefined)}
                      size="default"
                      type="button"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setRenameKey(null);
                        setRenameValue("");
                      }}
                      size="icon-lg"
                      type="button"
                      variant="ghost"
                    >
                      <X />
                    </Button>
                  </>
                ) : (
                  <>
                    {canSetPrimary({
                      file,
                      mode,
                      multiple: resolvedMultiple,
                    }) ? (
                      <Button
                        aria-label={
                          file.isThumbnail
                            ? "Primary image"
                            : "Set primary image"
                        }
                        disabled={disabled}
                        onClick={() => setPrimaryFile(file)}
                        size="icon-sm"
                        type="button"
                        variant={file.isThumbnail ? "secondary" : "ghost"}
                      >
                        <Star
                          className={cn(
                            file.isThumbnail && "fill-current text-primary"
                          )}
                        />
                      </Button>
                    ) : null}
                    {allowRename ? (
                      <Button
                        aria-label="Rename file"
                        disabled={disabled}
                        onClick={() => {
                          setRenameKey(file.key);
                          setRenameValue(getRenameInputValue(file.name));
                        }}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <PencilLine />
                      </Button>
                    ) : null}
                    {allowDelete ? (
                      <Button
                        aria-label="Delete file"
                        disabled={disabled || deleteKey === file.key}
                        loading={deleteKey === file.key}
                        onClick={() => removeFile(file).catch(() => undefined)}
                        size="icon-sm"
                        type="button"
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
