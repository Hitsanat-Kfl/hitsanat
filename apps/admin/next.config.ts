import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@repo/schemas",
    "@repo/calendar",
    "@repo/config",
    "@repo/permissions",
  ],
  reactStrictMode: true,
  webpack: (config) => {
    // Workspace packages use NodeNext-style relative imports (./types.js → types.ts).
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx"],
      ".jsx": [".jsx", ".ts", ".tsx"],
    };
    return config;
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
