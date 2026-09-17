import type { NextFunction, Request, Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the database module
vi.mock("@repo/database", () => ({
  getDb: vi.fn(),
}));

// Mock the Supabase client used for token verification
const mockGetUser = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

describe("Auth Integration Tests (Supabase)", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    mockReq = {
      headers: {},
      sessionUser: undefined,
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("requireAuth middleware", () => {
    it("should return 401 when no session token is provided", async () => {
      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {};

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when Supabase token is invalid", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: "invalid jwt" },
      });

      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {
        authorization: "Bearer invalid-token",
      };

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "AUTH_SESSION_INVALID",
          message: "Invalid or expired session",
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should extract token from Authorization header and resolve scopes", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1", email: "test@example.com" } },
        error: null,
      });

      const { getDb } = await import("@repo/database");
      vi.mocked(getDb).mockReturnValue({
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue({
              id: "user-1",
              email: "test@example.com",
              name: "Test User",
              role: "CHAIRPERSON",
              memberId: "member-1",
              image: null,
            }),
          },
        },
        execute: vi.fn().mockResolvedValue([]),
      } as never);

      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {
        authorization: "Bearer valid-token-123",
      };

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.sessionUser).toBeDefined();
      expect(mockReq.sessionUser?.id).toBe("user-1");
      expect(mockReq.sessionUser?.globalRoles).toContain("CHAIRPERSON");
    });

    it("should resolve sub-dept scopes via linked member (BR-007)", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });

      const executeMock = vi
        .fn()
        .mockResolvedValue([{ role: "Leader", sub_department_code: "TIMIHRT" }]);

      const { getDb } = await import("@repo/database");
      vi.mocked(getDb).mockReturnValue({
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue({
              id: "user-1",
              email: "lead@example.com",
              name: "Lead User",
              role: "MEMBER_REGULAR",
              memberId: "member-42",
              image: null,
            }),
          },
        },
        execute: executeMock,
      } as never);

      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {
        authorization: "Bearer valid-token",
      };

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      // BR-007: lookup must use the member link, not the user id
      expect(executeMock).toHaveBeenCalled();
      const sqlArg = executeMock.mock.calls[0][0] as unknown as {
        queryChunks?: unknown[];
      };
      const chunkText = JSON.stringify(sqlArg.queryChunks ?? []);
      expect(chunkText).toContain("member-42");

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.sessionUser?.subDeptRoles).toEqual([
        { subDepartmentCode: "TIMIHRT", role: "Leader" },
      ]);
    });
  });

  describe("requireScopePermission middleware", () => {
    it("should return 401 when sessionUser is not set", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["CHAIRPERSON"],
      });

      mockReq.sessionUser = undefined;

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should allow SUPER_ADMIN to bypass all permission checks", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["CHAIRPERSON"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "admin@example.com",
        name: "Admin User",
        role: "SUPER_ADMIN",
        memberId: "member-1",
        globalRoles: ["SUPER_ADMIN"],
        subDeptRoles: [],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should allow access when user has required global role", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "chair@example.com",
        name: "Chair User",
        role: "CHAIRPERSON",
        memberId: "member-1",
        globalRoles: ["CHAIRPERSON"],
        subDeptRoles: [],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should deny access when user lacks required global role", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["CHAIRPERSON"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "member@example.com",
        name: "Regular Member",
        role: "MEMBER_REGULAR",
        memberId: "member-9",
        globalRoles: [],
        subDeptRoles: [],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "FORBIDDEN_INSUFFICIENT_SCOPE",
          message:
            "You do not have permission to perform this action in this sub-department scope.",
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should allow access when user has correct sub-department scope", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        requiredSubDeptCode: "TIMIHRT",
        allowedSubDeptRoles: ["Leader", "Member"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt User",
        role: "MEMBER_REGULAR",
        memberId: "member-42",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "Leader",
          },
        ],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should deny access when user has wrong sub-department scope", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        requiredSubDeptCode: "MEZMUR",
        allowedSubDeptRoles: ["Leader", "Member"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt User",
        role: "MEMBER_REGULAR",
        memberId: "member-42",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "Leader",
          },
        ],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("Scope Isolation Tests", () => {
    it("should prevent Timihrt lead from accessing Mezmur data", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        requiredSubDeptCode: "MEZMUR",
        allowedSubDeptRoles: ["Leader", "Member"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt Lead",
        role: "MEMBER_REGULAR",
        memberId: "member-42",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "Leader",
          },
        ],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should allow Chairperson to access any sub-department", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["CHAIRPERSON"],
        requiredSubDeptCode: "MEZMUR",
        allowedSubDeptRoles: ["Leader", "Member"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "chair@example.com",
        name: "Chairperson",
        role: "CHAIRPERSON",
        memberId: "member-1",
        globalRoles: ["CHAIRPERSON"],
        subDeptRoles: [],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("Non-Leader Lockout (ADR-0007)", () => {
    it("should deny access to regular members without leadership role", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "member@example.com",
        name: "Regular Member",
        role: "MEMBER_REGULAR",
        memberId: null,
        globalRoles: [],
        subDeptRoles: [],
      };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
