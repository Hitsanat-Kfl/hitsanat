import type { Request, Response, NextFunction } from "express";
import { getDb } from "@repo/database";
import type { SessionUser } from "./types.js";

declare global {
  namespace Express {
    interface Request {
      sessionUser?: SessionUser;
    }
  }
}

/**
 * Resolve session token from cookie or Authorization header
 */
function extractToken(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (match) return match[1];
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return undefined;
}

/**
 * Resolve user's global roles and sub-department scopes from database
 */
async function resolveUserScopes(userId: string): Promise<SessionUser> {
  const db = getDb();

  const user = await db.query.users.findFirst({
    // biome-ignore lint/suspicious/noExplicitAny: drizzle-orm dual-package type conflict requires any
    where: (users: any, { eq }: any) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const memberships = await db.query.subDepartmentMembers.findMany({
    // biome-ignore lint/suspicious/noExplicitAny: drizzle-orm dual-package type conflict requires any
    where: (sdm: any, { eq }: any) => eq(sdm.memberId, userId),
    with: {
      subDepartment: true,
    },
  });

  const globalRoles: string[] = [];
  if (user.role === "SUPER_ADMIN") globalRoles.push("SUPER_ADMIN");
  if (user.role === "CHAIRPERSON") globalRoles.push("CHAIRPERSON");
  if (user.role === "SUB_CHAIRPERSON") globalRoles.push("SUB_CHAIRPERSON");
  if (user.role === "SECRETARY") globalRoles.push("SECRETARY");

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
    globalRoles,
    // biome-ignore lint/suspicious/noExplicitAny: drizzle-orm dual-package type conflict requires any
    subDeptRoles: memberships.map((m: any) => ({
      subDepartmentCode: m.subDepartment?.code || "",
      role: m.role,
    })),
  };
}

/**
 * Require valid authentication session
 */
export function requireAuth() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    }

    try {
      const { getAuth } = await import("./index.js");
      const session = await getAuth().api.getSession({
        headers: new Headers({
          cookie: `better-auth.session_token=${token}`,
        }),
      });

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_SESSION_INVALID",
            message: "Invalid or expired session",
          },
        });
      }

      const sessionUser = await resolveUserScopes(session.user.id);
      req.sessionUser = sessionUser;
      next();
    } catch {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_SESSION_INVALID",
          message: "Invalid or expired session",
        },
      });
    }
  };
}

export interface RequireScopePermissionOptions {
  allowedGlobalRoles?: string[];
  requiredSubDeptCode?: string;
  allowedSubDeptRoles?: string[];
}

/**
 * Require specific permission scope
 * Must be used after requireAuth()
 */
export function requireScopePermission(options: RequireScopePermissionOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.sessionUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    }

    if (user.globalRoles.includes("SUPER_ADMIN")) {
      return next();
    }

    if (options.allowedGlobalRoles?.some((r) => user.globalRoles.includes(r))) {
      return next();
    }

    if (options.requiredSubDeptCode) {
      const match = user.subDeptRoles.find(
        (r) => r.subDepartmentCode === options.requiredSubDeptCode
      );
      if (
        match &&
        (!options.allowedSubDeptRoles || options.allowedSubDeptRoles.includes(match.role))
      ) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN_INSUFFICIENT_SCOPE",
        message: "You do not have permission to perform this action in this sub-department scope.",
      },
    });
  };
}
