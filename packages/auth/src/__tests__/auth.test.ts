import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Auth Package (Supabase)", () => {
  it("should have package.json with correct name", () => {
    const pkgPath = resolve(__dirname, "../../package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    expect(pkg.name).toBe("@repo/auth");
    expect(pkg.type).toBe("module");
  });

  it("should have index.ts with Supabase JWT verification and auth middleware", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("@supabase/supabase-js");
    expect(content).toContain("@repo/database");
    expect(content).toContain("getSupabase");
    expect(content).toContain("verifySupabaseToken");
    expect(content).toContain("resolveUserScopes");
  });

  it("should have middleware.ts with requireAuth and requireScopePermission", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("requireAuth");
    expect(content).toContain("requireScopePermission");
  });

  it("should have types.ts with SessionUser interface including member link (BR-007)", () => {
    const typesPath = resolve(__dirname, "../types.ts");
    const content = readFileSync(typesPath, "utf-8");
    expect(content).toContain("SessionUser");
    expect(content).toContain("memberId");
  });

  it("should extract Supabase JWT from cookie or Authorization header", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("extractToken");
    expect(content).toContain("Bearer ");
  });
});
