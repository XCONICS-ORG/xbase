import { env } from "@xbase/env";
import {
  buildLinodeUploadBaseUrl,
  buildS3CompatibleUploadBaseUrl,
  type UploadProvider,
} from "./shared";

export interface UploadStorageConfig {
  accessKeyId: string;
  bucketName: string;
  endpoint: string;
  provider: UploadProvider;
  proxySignedUrls: boolean;
  publicBaseUrl: string;
  region: string;
  secretAccessKey: string;
}

const getDefaultEndpoint = ({
  provider,
  region,
}: {
  provider: UploadProvider;
  region: string;
}) => {
  if (provider === "linode") {
    return `https://${region}.linodeobjects.com`;
  }

  if (provider === "minio") {
    return "http://localhost:9000";
  }

  return "https://s3.amazonaws.com";
};

export const createUploadStorageConfig = (): UploadStorageConfig => {
  const provider = env.BUCKET_PROVIDER;
  const endpoint =
    env.BUCKET_ENDPOINT ||
    getDefaultEndpoint({
      provider,
      region: env.BUCKET_REGION,
    });
  const generatedPublicBaseUrl =
    provider === "linode"
      ? buildLinodeUploadBaseUrl({
          bucketName: env.BUCKET_NAME,
          region: env.BUCKET_REGION,
        })
      : buildS3CompatibleUploadBaseUrl({
          bucketName: env.BUCKET_NAME,
          endpoint,
        });

  return {
    accessKeyId: env.BUCKET_ACCESS_KEY_ID,
    bucketName: env.BUCKET_NAME,
    endpoint,
    provider,
    proxySignedUrls: env.BUCKET_PROXY_SIGNED_URLS,
    publicBaseUrl: env.BUCKET_PUBLIC_BASE_URL || generatedPublicBaseUrl,
    region: env.BUCKET_REGION,
    secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY,
  };
};

export const uploadStorageConfig = createUploadStorageConfig();
