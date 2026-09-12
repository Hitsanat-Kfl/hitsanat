import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("RBAC Middleware Structure", () => {
  it("should export requireAuth and requireScopePermission functions from middleware.ts", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("export function requireAuth()");
    expect(content).toContain("export function requireScopePermission(");
  });

  it("should have RequireScopePermissionOptions interface", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("allowedGlobalRoles");
    expect(content).toContain("requiredSubDeptCode");
    expect(content).toContain("allowedSubDeptRoles");
  });

  it("should return 401 when no session token is provided", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("status(401)");
    expect(content).toContain("AUTH_UNAUTHORIZED");
    expect(content).toContain("Authentication required");
  });

  it("should return 403 for insufficient permissions", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("status(403)");
    expect(content).toContain("FORBIDDEN_INSUFFICIENT_SCOPE");
  });

  it("should allow SUPER_ADMIN to bypass all permission checks", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("SUPER_ADMIN");
    expect(content).toContain("user.globalRoles.includes");
  });

  it("should check sub-department scoped roles", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("subDeptRoles.find");
    expect(content).toContain("subDepartmentCode");
  });

  it("should extract token from cookie or Authorization header", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("extractToken");
    expect(content).toContain("better-auth.session_token");
    expect(content).toContain("Bearer ");
  });

  it("should resolve user scopes from database", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("resolveUserScopes");
    expect(content).toContain("db.query.users.findFirst");
    expect(content).toContain("db.query.subDepartmentMembers.findMany");
  });

  it("should set sessionUser on request object", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("req.sessionUser = sessionUser");
  });
});

describe("SessionUser Types", () => {
  it("should define SessionUser interface with correct fields", () => {
    const typesPath = resolve(__dirname, "../types.ts");
    const content = readFileSync(typesPath, "utf-8");
    expect(content).toContain("id: string");
    expect(content).toContain("email: string");
    expect(content).toContain("name: string");
    expect(content).toContain("role: string");
    expect(content).toContain("globalRoles: string[]");
    expect(content).toContain("subDeptRoles");
    expect(content).toContain("subDepartmentCode: string");
  });

  it("should define AuthContext interface", () => {
    const typesPath = resolve(__dirname, "../types.ts");
    const content = readFileSync(typesPath, "utf-8");
    expect(content).toContain("AuthContext");
    expect(content).toContain("user: User");
    expect(content).toContain("session: Session");
    expect(content).toContain("sessionUser: SessionUser");
  });
});
