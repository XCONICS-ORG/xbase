import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@turtle/assets",
    "@turtle/design-system",
    "@turtle/icons",
  ],
};

export default nextConfig;
