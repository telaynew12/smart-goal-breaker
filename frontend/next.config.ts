import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Explicitly set the root directory for Turbopack
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
