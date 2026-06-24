import type { Meta, StoryObj } from "@storybook/react";
import type { UploadedFileRecord } from "@xbase/bucket";
import {
  AdvancedUploader,
  type AdvancedUploaderProps,
} from "@xbase/design-system/components/modules/uploader";
import { useState } from "react";

const meta: Meta<typeof AdvancedUploader> = {
  title: "Modules/AdvancedUploader",
  component: AdvancedUploader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Media uploader",
    mode: "images",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

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

const createMockUpload = async ({
  files: selectedFiles,
  folder,
  onProgress,
}: Parameters<NonNullable<AdvancedUploaderProps["uploadFiles"]>>[0]) => {
  for (const file of selectedFiles) {
    onProgress?.(file, 35);
    await new Promise((resolve) => setTimeout(resolve, 150));
    onProgress?.(file, 100);
  }

  return selectedFiles.map((file) => ({
    folder: folder ?? null,
    key: `${folder ?? "storybook"}/${crypto.randomUUID()}-${file.name}`,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    uploadedAt: new Date().toISOString(),
    url: URL.createObjectURL(file),
  }));
};

function UploaderStory(args: AdvancedUploaderProps) {
  const [files, setFiles] = useState<UploadedFileRecord[]>([]);

  return (
    <div
      className={
        args.mode === "avatar" ? "w-fit" : "w-[min(720px,calc(100vw-2rem))]"
      }
    >
      <AdvancedUploader
        {...args}
        folder="storybook"
        onDeleteFile={() => undefined}
        onRenameFile={(file, nextName) => {
          const extension = getFileExtension(file.name);
          const nextFileName = extension
            ? `${removeFileExtension(nextName)}${extension}`
            : nextName;
          const nextKey = `${file.folder ?? "storybook"}/${crypto.randomUUID()}-${nextFileName}`;

          return {
            folder: file.folder,
            key: nextKey,
            name: nextFileName,
            url: file.url,
          };
        }}
        onValueChange={setFiles}
        uploadFiles={createMockUpload}
        value={files}
      />
    </div>
  );
}

export const Images: Story = {
  render: (args) => <UploaderStory {...args} mode="images" />,
};

export const Avatar: Story = {
  render: (args) => <UploaderStory {...args} label="Avatar" mode="avatar" />,
};

export const Audio: Story = {
  render: (args) => (
    <UploaderStory {...args} label="Audio files" mode="audio" />
  ),
};

export const Video: Story = {
  render: (args) => (
    <UploaderStory {...args} label="Video files" mode="video" />
  ),
};

export const Files: Story = {
  render: (args) => <UploaderStory {...args} label="Documents" mode="files" />,
};
