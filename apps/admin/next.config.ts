import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/schemas", "@repo/calendar", "@repo/config"],
  reactStrictMode: true,
};

export default nextConfig;
