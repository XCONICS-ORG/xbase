import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const packageDirectory = dirname(fileURLToPath(import.meta.url));
const rootDirectory = resolve(packageDirectory, "../..");
const globalEnvDirectory = join(rootDirectory, "env");

export const loadGlobalEnv = () => {
  if (existsSync(globalEnvDirectory)) {
    loadEnvConfig(globalEnvDirectory);
  }

  return globalEnvDirectory;
};
