import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Better Auth Package", () => {
  it("should have package.json with correct name", () => {
    const pkgPath = resolve(__dirname, "../../package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    expect(pkg.name).toBe("@repo/auth");
    expect(pkg.type).toBe("module");
  });

  it("should have index.ts with Better Auth lazy initialization", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("better-auth");
    expect(content).toContain("@repo/database");
    expect(content).toContain("betterAuth");
    expect(content).toContain("getAuth");
    expect(content).toContain("createAuth");
  });

  it("should have middleware.ts with requireAuth and requireScopePermission", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("requireAuth");
    expect(content).toContain("requireScopePermission");
    expect(content).toContain("express");
    expect(content).toContain("getAuth");
  });

  it("should have types.ts with SessionUser interface", () => {
    const typesPath = resolve(__dirname, "../types.ts");
    const content = readFileSync(typesPath, "utf-8");
    expect(content).toContain("SessionUser");
    expect(content).toContain("AuthContext");
  });
});
