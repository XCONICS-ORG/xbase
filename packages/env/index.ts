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
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .optional()
      .default("development"),
    PRODUCTION_URL: optionalString,
    STORYBOOK_PORT: z.coerce.number().int().positive().default(5000),
  },
  client: {},
  runtimeEnv: {
    APP_ENV: appEnv,
    APP_WEB_PORT: process.env.APP_WEB_PORT,
    FLAG_SHOW_BETA_FEATURE: process.env.FLAG_SHOW_BETA_FEATURE,
    NODE_ENV: process.env.NODE_ENV,
    PRODUCTION_URL: process.env.PRODUCTION_URL,
    STORYBOOK_PORT: process.env.STORYBOOK_PORT,
  },
});

export type Env = typeof env;
