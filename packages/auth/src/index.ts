import { getDb } from "@repo/database";
import { sql } from "drizzle-orm";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";
import type { SessionUser } from "./types.js";

let _client: SupabaseClient | null = null;

/**
 * Get a shared Supabase client instance (server-side).
 * Uses the anon key — relies on RLS and JWT verification for security.
 * Lazily initialized after env vars are loaded by dotenv.
 */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
    }
    _client = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _client;
}

/**
 * Verify a Supabase JWT and return the authenticated user.
 * Calls Supabase auth server to validate the token.
 */
export async function verifySupabaseToken(token: string) {
  const supabase = getSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Extract Supabase JWT from cookie or Authorization header.
 * Supabase SSR sets a cookie named `sb-<project-ref>-auth-token`.
 */
export function extractToken(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/sb-[a-z0-9]+-auth-token=([^;]+)/);
    if (match) return match[1];
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return undefined;
}

/**
 * Resolve user's global roles and sub-department scopes from database.
 *
 * BR-007: Sub-department lookups are performed via the user's linked
 * member record (`users.member_id`), falling back to the user id for
 * legacy rows created before the member link existed.
 */
export async function resolveUserScopes(userId: string): Promise<SessionUser> {
  const db = getDb();

  const user = await db.query.users.findFirst({
    // biome-ignore lint/suspicious/noExplicitAny: drizzle-orm dual-package type conflict requires any
    where: (users: any, { eq }: any) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const memberships = await db.execute(sql`
    SELECT sdm.role, sd.code as sub_department_code
    FROM sub_department_members sdm
    JOIN sub_departments sd ON sd.id = sdm.sub_department_id
    WHERE sdm.member_id = ${user.memberId ?? userId}
  `);

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
    memberId: (user as { memberId?: string | null }).memberId ?? null,
    image: user.image,
    globalRoles,
    subDeptRoles: (
      memberships as unknown as Array<{ role: string; sub_department_code: string }>
    ).map((m) => ({
      subDepartmentCode: m.sub_department_code || "",
      role: m.role,
    })),
  };
}

declare global {
  namespace Express {
    interface Request {
      sessionUser?: SessionUser;
    }
  }
}

/**
 * Require valid Supabase authentication session.
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
      const supabaseUser = await verifySupabaseToken(token);

      if (!supabaseUser) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_SESSION_INVALID",
            message: "Invalid or expired session",
          },
        });
      }

      const sessionUser = await resolveUserScopes(supabaseUser.id);
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
 * Require specific permission scope.
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
