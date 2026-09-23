import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The auth middleware imports @repo/database for resolveUserScopes — mock it.
vi.mock("@repo/database", () => ({
  getDb: vi.fn(),
}));

describe("RBAC Middleware Structure", () => {
  it("should export requireAuth and requireScopePermission functions from middleware.ts", () => {
    const middlewarePath = resolve(__dirname, "../middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("requireAuth");
    expect(content).toContain("requireScopePermission");
  });

  it("should have RequireScopePermissionOptions interface", () => {
    const middlewarePath = resolve(__dirname, "../index.ts");
    const content = readFileSync(middlewarePath, "utf-8");
    expect(content).toContain("allowedGlobalRoles");
    expect(content).toContain("requiredSubDeptCode");
    expect(content).toContain("allowedSubDeptRoles");
    expect(content).toContain("resource?: string");
    expect(content).toContain("action?: string");
    expect(content).toContain("permissionGrantUsed");
  });

  it("should return 401 when no session token is provided", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("401");
    expect(content).toContain("AUTH_UNAUTHORIZED");
    expect(content).toContain("Authentication required");
  });

  it("should return 403 for insufficient permissions", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("403");
    expect(content).toContain("FORBIDDEN_INSUFFICIENT_SCOPE");
  });

  it("should allow SUPER_ADMIN to bypass all permission checks", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("SUPER_ADMIN");
    expect(content).toContain("user.globalRoles.includes");
  });

  it("should check sub-department scoped roles", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("subDeptRoles.find");
    expect(content).toContain("subDepartmentCode");
  });

  it("should extract token from Supabase cookie or Authorization header", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("extractToken");
    expect(content).toContain("-auth-token");
    expect(content).toContain("Bearer ");
  });

  it("should resolve user scopes from database via member link (BR-007)", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("resolveUserScopes");
    expect(content).toContain("db.query.users.findFirst");
    expect(content).toContain("user.memberId");
  });

  it("should set sessionUser on request object", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
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

  it("should declare sessionUser on Express Request", () => {
    const indexPath = resolve(__dirname, "../index.ts");
    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain("sessionUser?: SessionUser");
  });
});

describe("RBAC Middleware Behavior", () => {
  let mockReq: {
    headers: Record<string, string>;
    cookies?: Record<string, string>;
    sessionUser?: unknown;
  };
  let mockRes: {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
  let mockNext: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it("should return 401 when sessionUser is missing in requireScopePermission", async () => {
    const { requireScopePermission } = await import("../index.js");
    const middleware = requireScopePermission({ allowedGlobalRoles: ["CHAIRPERSON"] });

    middleware(mockReq as never, mockRes as never, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should allow SUPER_ADMIN to bypass scope checks", async () => {
    const { requireScopePermission } = await import("../index.js");
    const middleware = requireScopePermission({ allowedGlobalRoles: ["CHAIRPERSON"] });

    const req = {
      ...mockReq,
      sessionUser: {
        id: "u1",
        email: "a@b.c",
        name: "Admin",
        role: "SUPER_ADMIN",
        memberId: "m1",
        globalRoles: ["SUPER_ADMIN"],
        subDeptRoles: [],
      },
    };

    middleware(req as never, mockRes as never, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should deny non-leadership access (ADR-0007)", async () => {
    const { requireScopePermission } = await import("../index.js");
    const middleware = requireScopePermission({
      allowedGlobalRoles: ["CHAIRPERSON", "SECRETARY"],
    });

    const req = {
      ...mockReq,
      sessionUser: {
        id: "u1",
        email: "m@b.c",
        name: "Member",
        role: "MEMBER_REGULAR",
        memberId: null,
        globalRoles: [],
        subDeptRoles: [],
      },
    };

    middleware(req as never, mockRes as never, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should deny role failure without resource/action (sync path)", async () => {
    const { requireScopePermission } = await import("../index.js");
    const middleware = requireScopePermission({
      allowedGlobalRoles: ["SECRETARY"],
    });

    const req = {
      ...mockReq,
      sessionUser: {
        id: "u1",
        email: "m@b.c",
        name: "Member",
        role: "MEMBER_REGULAR",
        memberId: null,
        globalRoles: [],
        subDeptRoles: [],
      },
    };

    middleware(req as never, mockRes as never, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  describe("temporary grant fallback (BR-035)", () => {
    function scopedReq() {
      return {
        ...mockReq,
        sessionUser: {
          id: "u-grantee",
          email: "g@b.c",
          name: "Grantee",
          role: "MEMBER_REGULAR",
          memberId: null,
          globalRoles: [],
          subDeptRoles: [],
        },
      };
    }

    it("allows the request and marks permissionGrantUsed when an active grant exists", async () => {
      const { getDb } = await import("@repo/database");
      vi.mocked(getDb).mockReturnValue({
        execute: vi.fn().mockResolvedValue([{ id: "g1" }]),
      } as never);

      const { requireScopePermission } = await import("../index.js");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["SECRETARY"],
        resource: "members",
        action: "C",
      });

      const req = scopedReq();
      middleware(req as never, mockRes as never, mockNext);

      await vi.waitFor(() => {
        expect(mockNext).toHaveBeenCalled();
      });
      expect((req as { permissionGrantUsed?: boolean }).permissionGrantUsed).toBe(true);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("denies with 403 when no active grant covers the resource+action", async () => {
      const { getDb } = await import("@repo/database");
      vi.mocked(getDb).mockReturnValue({
        execute: vi.fn().mockResolvedValue([]),
      } as never);

      const { requireScopePermission } = await import("../index.js");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["SECRETARY"],
        resource: "members",
        action: "C",
      });

      middleware(scopedReq() as never, mockRes as never, mockNext);

      await vi.waitFor(() => {
        expect(mockRes.status).toHaveBeenCalledWith(403);
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("denies when the grant lookup fails (fail closed)", async () => {
      const { getDb } = await import("@repo/database");
      vi.mocked(getDb).mockReturnValue({
        execute: vi.fn().mockRejectedValue(new Error("db down")),
      } as never);

      const { requireScopePermission } = await import("../index.js");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["SECRETARY"],
        resource: "members",
        action: "C",
      });

      middleware(scopedReq() as never, mockRes as never, mockNext);

      await vi.waitFor(() => {
        expect(mockRes.status).toHaveBeenCalledWith(403);
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
