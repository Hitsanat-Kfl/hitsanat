import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@repo/ui/components",
        replacement: path.resolve(__dirname, "./packages/ui/src/components"),
      },
      { find: "@repo/ui/lib", replacement: path.resolve(__dirname, "./packages/ui/src/lib") },
      { find: "@repo/ui", replacement: path.resolve(__dirname, "./packages/ui/src/index.ts") },
      {
        find: "@repo/database/schema",
        replacement: path.resolve(__dirname, "./packages/database/src/schema/index.ts"),
      },
      {
        find: "@repo/database/client",
        replacement: path.resolve(__dirname, "./packages/database/src/client/index.ts"),
      },
      {
        find: "@repo/database",
        replacement: path.resolve(__dirname, "./packages/database/src/index.ts"),
      },
      {
        find: "@repo/auth/middleware",
        replacement: path.resolve(__dirname, "./packages/auth/src/middleware.ts"),
      },
      { find: "@repo/auth", replacement: path.resolve(__dirname, "./packages/auth/src/index.ts") },
      {
        find: "@repo/schemas",
        replacement: path.resolve(__dirname, "./packages/schemas/src/index.ts"),
      },
      {
        find: "@repo/calendar",
        replacement: path.resolve(__dirname, "./packages/calendar/src/index.ts"),
      },
      {
        find: "@repo/config",
        replacement: path.resolve(__dirname, "./packages/config/src/index.ts"),
      },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "tests/e2e/**"],
  },
});
