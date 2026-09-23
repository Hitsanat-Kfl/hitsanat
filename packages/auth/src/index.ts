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
 * Parse a cookie header into name/value pairs.
 */
function parseCookies(cookieHeader: string): Map<string, string> {
  const cookies = new Map<string, string>();
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (name) cookies.set(name, value);
  }
  return cookies;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isJwt(value: string): boolean {
  return value.split(".").length === 3 && value.length > 40;
}

/**
 * Extract the access token from a Supabase SSR auth cookie.
 *
 * `@supabase/ssr` stores the session as a URL-encoded JSON document
 * (`{"access_token":"…","refresh_token":…}`) in
 * `sb-<project-ref>-auth-token`, chunked into `.0`, `.1`, … siblings when
 * the value exceeds the per-cookie size limit. Older flows stored the raw
 * JWT — support both.
 */
function extractTokenFromSupabaseCookies(cookieHeader: string): string | undefined {
  const cookies = parseCookies(cookieHeader);

  // Collect every project ref that has an auth-token cookie.
  const refs = new Set<string>();
  for (const name of cookies.keys()) {
    const match = name.match(/^sb-([a-z0-9]+)-auth-token/);
    if (match) refs.add(match[1]);
  }

  for (const ref of refs) {
    const base = `sb-${ref}-auth-token`;
    const chunks = [...cookies.entries()]
      .filter(([name]) => name.startsWith(`${base}.`))
      .map(([name, value]) => ({
        index: Number.parseInt(name.slice(base.length + 1), 10),
        value,
      }))
      .filter((chunk) => Number.isInteger(chunk.index))
      .sort((a, b) => a.index - b.index);

    let raw: string | undefined;
    if (chunks.length > 0) {
      raw = chunks.map((chunk) => safeDecode(chunk.value)).join("");
    } else {
      const main = cookies.get(base);
      if (main) raw = safeDecode(main);
    }
    if (!raw) continue;

    // Defensive: some storage adapters prefix base64-encoded payloads.
    if (raw.startsWith("base64-")) {
      raw = Buffer.from(raw.slice("base64-".length), "base64").toString("utf8");
    }

    try {
      const parsed = JSON.parse(raw) as { access_token?: unknown };
      if (typeof parsed.access_token === "string" && isJwt(parsed.access_token)) {
        return parsed.access_token;
      }
    } catch {
      // Not JSON — fall through to the legacy raw-JWT format.
    }

    if (isJwt(raw)) return raw;
  }

  return undefined;
}

/**
 * Extract Supabase JWT from cookie or Authorization header.
 * Supabase SSR sets a JSON session cookie named `sb-<project-ref>-auth-token`
 * (chunked into `.0`, `.1`, … when large).
 */
export function extractToken(req: Request): string | undefined {
  if (req.headers.cookie) {
    const token = extractTokenFromSupabaseCookies(req.headers.cookie);
    if (token) return token;
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
      /** PE-07: set by requireScopePermission when the SUPER_ADMIN bypass allowed the request. */
      permissionBypassUsed?: boolean;
      /** BR-035: set by requireScopePermission when an active temporary grant allowed the request. */
      permissionGrantUsed?: boolean;
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
  /**
   * BR-035: when both resource and action are provided and the role/sub-dept
   * checks fail, an active temporary grant for this pair may still allow
   * the request. Omit both to keep the synchronous role-only path.
   */
  resource?: string;
  action?: string;
}

/**
 * BR-035: true when the user has at least one non-revoked, unexpired grant
 * covering the exact resource+action pair.
 */
async function hasActiveGrant(userId: string, resource: string, action: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute(sql`
    SELECT id FROM permission_grants
    WHERE user_id = ${userId}
      AND resource = ${resource}
      AND action = ${action}
      AND revoked_at IS NULL
      AND expires_at > now()
    LIMIT 1
  `);
  return Array.isArray(result) && result.length > 0;
}

function denyScope(res: Response): Response {
  return res.status(403).json({
    success: false,
    error: {
      code: "FORBIDDEN_INSUFFICIENT_SCOPE",
      message: "You do not have permission to perform this action in this sub-department scope.",
    },
  });
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
      // PE-07 / FR-13.12: mark that this request was allowed only through
      // the SUPER_ADMIN permission bypass so the break-glass audit
      // middleware can record the action.
      if (!options.allowedGlobalRoles?.includes("SUPER_ADMIN")) {
        req.permissionBypassUsed = true;
      }
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

    // BR-035: role checks failed — consult an active temporary grant when
    // this middleware is bound to a concrete resource+action pair.
    if (options.resource && options.action) {
      hasActiveGrant(user.id, options.resource, options.action)
        .then((granted) => {
          if (granted) {
            req.permissionGrantUsed = true;
            next();
          } else {
            denyScope(res);
          }
        })
        .catch(() => {
          denyScope(res);
        });
      return;
    }

    return denyScope(res);
  };
}
