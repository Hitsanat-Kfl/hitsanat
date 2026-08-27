import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/ui/components": path.resolve(__dirname, "./packages/ui/src/components"),
      "@repo/ui/lib": path.resolve(__dirname, "./packages/ui/src/lib"),
      "@repo/ui": path.resolve(__dirname, "./packages/ui/src/index.ts"),
      "@repo/database": path.resolve(__dirname, "./packages/database/src/index.ts"),
      "@repo/schemas": path.resolve(__dirname, "./packages/schemas/src/index.ts"),
      "@repo/calendar": path.resolve(__dirname, "./packages/calendar/src/index.ts"),
      "@repo/config": path.resolve(__dirname, "./packages/config/src/index.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "tests/e2e/**"],
  },
});
