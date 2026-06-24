import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { loadGlobalEnv } from "./load";

loadGlobalEnv();

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const booleanString = z
  .enum(["true", "false"])
  .optional()
  .default("false")
  .transform((value) => value === "true");

const rawAppEnv = process.env.APP_ENV ?? process.env.NODE;
const appEnv =
  rawAppEnv === "development" || rawAppEnv === "production"
    ? rawAppEnv
    : undefined;

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  server: {
    APP_ENV: z.enum(["development", "production"]).default("development"),
    APP_WEB_PORT: z.coerce.number().int().positive().default(3002),
    FLAG_SHOW_BETA_FEATURE: booleanString,
    GOOGLE_MAPS_SERVER_API_KEY: optionalString,
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .optional()
      .default("development"),
    PRODUCTION_URL: optionalString,
    STORYBOOK_PORT: z.coerce.number().int().positive().default(5000),
    BUCKET_ACCESS_KEY_ID: z
      .string()
      .min(1)
      .default("replace-with-bucket-access-key"),
    BUCKET_ENDPOINT: optionalString,
    BUCKET_NAME: z.string().min(1).default("replace-with-bucket-name"),
    BUCKET_PROVIDER: z.enum(["linode", "s3", "minio"]).default("linode"),
    BUCKET_PROXY_SIGNED_URLS: booleanString,
    BUCKET_PUBLIC_BASE_URL: optionalString,
    BUCKET_REGION: z.string().min(1).default("in-maa-1"),
    BUCKET_SECRET_ACCESS_KEY: z
      .string()
      .min(1)
      .default("replace-with-bucket-secret-key"),
  },
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: optionalString,
    NEXT_PUBLIC_GOOGLE_MAPS_ID: optionalString,
  },
  runtimeEnv: {
    APP_ENV: appEnv,
    APP_WEB_PORT: process.env.APP_WEB_PORT,
    FLAG_SHOW_BETA_FEATURE: process.env.FLAG_SHOW_BETA_FEATURE,
    GOOGLE_MAPS_SERVER_API_KEY: process.env.GOOGLE_MAPS_SERVER_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
    PRODUCTION_URL: process.env.PRODUCTION_URL,
    STORYBOOK_PORT: process.env.STORYBOOK_PORT,
    BUCKET_ACCESS_KEY_ID: process.env.BUCKET_ACCESS_KEY_ID,
    BUCKET_ENDPOINT: process.env.BUCKET_ENDPOINT,
    BUCKET_NAME: process.env.BUCKET_NAME,
    BUCKET_PROVIDER: process.env.BUCKET_PROVIDER,
    BUCKET_PROXY_SIGNED_URLS: process.env.BUCKET_PROXY_SIGNED_URLS,
    BUCKET_PUBLIC_BASE_URL: process.env.BUCKET_PUBLIC_BASE_URL,
    BUCKET_REGION: process.env.BUCKET_REGION,
    BUCKET_SECRET_ACCESS_KEY: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
});

export type Env = typeof env;
