import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

// Mock the database module
vi.mock("@repo/database", () => ({
  getDb: vi.fn(),
}));

// Mock the auth module
vi.mock("@repo/auth", () => ({
  getAuth: vi.fn(),
}));

describe("Auth Integration Tests", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      headers: {},
      sessionUser: undefined,
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
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

    it("should return 401 when session is invalid", async () => {
      const { getAuth } = await import("@repo/auth");
      vi.mocked(getAuth).mockReturnValue({
        api: {
          getSession: vi.fn().mockResolvedValue(null),
        },
      } as any);

      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {
        cookie: "better-auth.session_token=invalid-token",
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

    it("should extract token from Authorization header", async () => {
      const mockSession = {
        user: { id: "user-1", email: "test@example.com" },
      };

      const { getAuth } = await import("@repo/auth");
      vi.mocked(getAuth).mockReturnValue({
        api: {
          getSession: vi.fn().mockResolvedValue(mockSession),
        },
      } as any);

      const { getDb } = await import("@repo/database");
      vi.mocked(getDb).mockReturnValue({
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue({
              id: "user-1",
              email: "test@example.com",
              name: "Test User",
              role: "CHAIRPERSON",
            }),
          },
          subDepartmentMembers: {
            findMany: vi.fn().mockResolvedValue([]),
          },
        },
      } as any);

      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {
        authorization: "Bearer valid-token-123",
      };

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.sessionUser).toBeDefined();
      expect(mockReq.sessionUser?.id).toBe("user-1");
    });

    it("should resolve user scopes from database on valid session", async () => {
      const mockSession = {
        user: { id: "user-1", email: "test@example.com" },
      };

      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "CHAIRPERSON",
      };

      const mockMemberships = [
        {
          subDepartment: { code: "TIMIHRT" },
          role: "LEAD",
        },
      ];

      const { getAuth } = await import("@repo/auth");
      vi.mocked(getAuth).mockReturnValue({
        api: {
          getSession: vi.fn().mockResolvedValue(mockSession),
        },
      } as any);

      const { getDb } = await import("@repo/database");
      const mockDb = {
        query: {
          users: {
            findFirst: vi.fn().mockResolvedValue(mockUser),
          },
          subDepartmentMembers: {
            findMany: vi.fn().mockResolvedValue(mockMemberships),
          },
        },
      };
      vi.mocked(getDb).mockReturnValue(mockDb as any);

      const { requireAuth } = await import("@repo/auth/middleware");
      const middleware = requireAuth();

      mockReq.headers = {
        cookie: "better-auth.session_token=valid-token",
      };

      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.sessionUser).toEqual({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "CHAIRPERSON",
        image: undefined,
        globalRoles: ["CHAIRPERSON"],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "LEAD",
          },
        ],
      });
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
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        },
      });
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
        allowedSubDeptRoles: ["LEAD", "MEMBER"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt User",
        role: "MEMBER_REGULAR",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "LEAD",
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
        allowedSubDeptRoles: ["LEAD", "MEMBER"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt User",
        role: "MEMBER_REGULAR",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "LEAD",
          },
        ],
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

    it("should deny access when user has wrong role in sub-department", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        requiredSubDeptCode: "TIMIHRT",
        allowedSubDeptRoles: ["LEAD"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt User",
        role: "MEMBER_REGULAR",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "MEMBER",
          },
        ],
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
  });

  describe("Scope Isolation Tests", () => {
    it("should prevent Timihrt lead from accessing Mezmur data", async () => {
      const { requireScopePermission } = await import("@repo/auth/middleware");
      const middleware = requireScopePermission({
        requiredSubDeptCode: "MEZMUR",
        allowedSubDeptRoles: ["LEAD", "MEMBER"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "timihrt@example.com",
        name: "Timihrt Lead",
        role: "MEMBER_REGULAR",
        globalRoles: [],
        subDeptRoles: [
          {
            subDepartmentCode: "TIMIHRT",
            role: "LEAD",
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
        allowedSubDeptRoles: ["LEAD", "MEMBER"],
      });

      mockReq.sessionUser = {
        id: "user-1",
        email: "chair@example.com",
        name: "Chairperson",
        role: "CHAIRPERSON",
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
  });
});
