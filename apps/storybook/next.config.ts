import { loadGlobalEnv } from "@xbase/env/load";
import type { NextConfig } from "next";

loadGlobalEnv();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? "",
  },
  reactStrictMode: true,
  transpilePackages: [
    "@xbase/assets",
    "@xbase/design-system",
    "@xbase/env",
    "@xbase/icons",
    "@xbase/libs",
  ],
};

export default nextConfig;
