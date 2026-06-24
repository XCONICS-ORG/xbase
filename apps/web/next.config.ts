import { loadGlobalEnv } from "@xbase/env/load";
import type { NextConfig } from "next";

loadGlobalEnv();

const nextConfig: NextConfig = {
  transpilePackages: [
    "@xbase/assets",
    "@xbase/design-system",
    "@xbase/env",
    "@xbase/feature-flags",
    "@xbase/utility",
  ],
};

export default nextConfig;
