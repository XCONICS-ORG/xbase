import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadGlobalEnv } from "@xbase/env/load";
import type { NextConfig } from "next";

loadGlobalEnv();

const appDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(appDirectory, "../..");

const nextConfig: NextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
  transpilePackages: [
    "@xbase/assets",
    "@xbase/constants",
    "@xbase/design-system",
    "@xbase/env",
    "@xbase/feature-flags",
    "@xbase/libs",
    "@xbase/utility",
  ],
};

export default nextConfig;
