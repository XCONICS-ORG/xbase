import { loadGlobalEnv } from "@xbase/env/load";
import type { NextConfig } from "next";

loadGlobalEnv();

const nextConfig: NextConfig = {
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
