import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// biome-ignore lint/performance/noNamespaceImport: Next env can be exposed on either the named export or default export depending on module resolution.
import * as nextEnv from "@next/env";

type NextEnvModule = typeof nextEnv & {
  default?: {
    loadEnvConfig?: typeof nextEnv.loadEnvConfig;
  };
};

const loadEnvConfig =
  nextEnv.loadEnvConfig ?? (nextEnv as NextEnvModule).default?.loadEnvConfig;

const packageDirectory = dirname(fileURLToPath(import.meta.url));
const rootDirectory = resolve(packageDirectory, "../..");
const globalEnvDirectory = join(rootDirectory, "env");

export const loadGlobalEnv = () => {
  if (existsSync(globalEnvDirectory) && loadEnvConfig) {
    loadEnvConfig(globalEnvDirectory);
  }

  return globalEnvDirectory;
};
