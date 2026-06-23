import { loadGlobalEnv } from "@turtle/env/load";
import type { NextConfig } from "next";

loadGlobalEnv();

const nextConfig: NextConfig = {
  transpilePackages: [
    "@turtle/assets",
    "@turtle/design-system",
    "@turtle/env",
    "@turtle/feature-flags",
    "@turtle/utility",
  ],
};

export default nextConfig;
