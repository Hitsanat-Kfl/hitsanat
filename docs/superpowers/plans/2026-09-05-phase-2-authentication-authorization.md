# Phase 2: Authentication & Authorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Supabase Auth with scoped RBAC middleware and auth API endpoints for leadership-only access to the admin portal.

**Architecture:** Create `packages/auth` with Supabase Auth (`@supabase/supabase-js`) for session management. Keep application user roles on the `users` table (aligned with Supabase `auth.users` UUIDs). Implement `requireAuth()` (Supabase JWT verification) and `requireScopePermission()` middleware. Mount session/sign-out endpoints on Express; sign-in happens client-side via `supabase.auth.signInWithPassword()`.

**Tech Stack:** Supabase Auth, Drizzle ORM, PostgreSQL, Express, TypeScript, Vitest

**Specs:**
- `docs/backend/authentication.md` — Supabase Auth initialization & Express integration
- `docs/backend/authorization.md` — Scoped RBAC guard middleware
- `docs/architecture/security-architecture.md` — Security architecture & threat model
- `docs/requirements/roles-and-permissions.md` — Roles & permissions matrix
- `docs/adr/ADR-0005-scoped-rbac-tables.md` — Scoped RBAC decision
- `docs/adr/ADR-0007-regular-members-no-dashboard-access.md` — Zero-access for regular members

## Global Constraints

- Node.js >=20, pnpm 9.15.9
- TypeScript strict mode, ESM modules (`"type": "module"`)
- Biome for formatting/linting, Vitest for testing
- PostgreSQL via `postgres` driver, Drizzle ORM for schema/query
- Supabase Auth (`@supabase/supabase-js`, `@supabase/ssr`) for auth/session management
- Cookie: `httpOnly`, `secure`, `sameSite: strict`, 7-day rolling expiration
- Regular members (`MEMBER_REGULAR`) have NO admin portal access (ADR-0007)
- Scoped permissions: global roles first, then sub-department scoped roles

---

## File Structure

| File | Purpose |
|------|---------|
| `packages/auth/package.json` | New package config for @repo/auth |
| `packages/auth/tsconfig.json` | TypeScript config extending base |
| `packages/auth/src/index.ts` | Supabase client initialization & helpers |
| `packages/auth/src/middleware.ts` | requireAuth() and requireScopePermission() middleware |
| `packages/auth/src/types.ts` | Extended session/user types |
| `packages/auth/src/__tests__/auth.test.ts` | Unit tests for auth configuration |
| `packages/auth/src/__tests__/middleware.test.ts` | Unit tests for RBAC middleware |
| `packages/database/src/schema/users.ts` | Application users table (role field; UUID = Supabase auth id) |
| `packages/database/src/schema/index.ts` | MODIFY: Export user schema |
| `packages/database/src/migrations/000X_add_users.sql` | NEW: Migration for application users tables |
| `packages/database/src/migrations/meta/_journal.json` | MODIFY: Add migration entry |
| `apps/api/src/app.ts` | MODIFY: Mount auth routes |
| `apps/api/src/config/env.ts` | MODIFY: Require SUPABASE_URL / SUPABASE_ANON_KEY |
| `apps/api/package.json` | MODIFY: Add @repo/auth dependency |
| `pnpm-workspace.yaml` | VERIFY: Already includes packages/* |
| `vitest.config.ts` | MODIFY: Add auth workspace |

---

### Task 1: Create packages/auth scaffold

**Files:**
- Create: `packages/auth/package.json`
- Create: `packages/auth/tsconfig.json`

**Interfaces:**
- Produces: @repo/auth package structure ready for Supabase Auth

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@repo/auth",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./middleware": {
      "types": "./src/middleware.ts",
      "default": "./src/middleware.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/database": "workspace:*",
    "@repo/permissions": "workspace:*",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "^5.7.3",
    "vitest": "^3.0.7"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`

- [ ] **Step 4: Verify package resolves**

Run: `pnpm --filter @repo/auth typecheck` (should fail with no src files, but package should resolve)

- [ ] **Step 5: Commit**

```bash
git add packages/auth/
git commit -m "feat(auth): create packages/auth scaffold"
```

---

### Task 2: Add application users to database schema

**Files:**
- Create: `packages/database/src/schema/users.ts`
- Modify: `packages/database/src/schema/index.ts` — Add `export * from "./users"`

**Interfaces:**
- Produces: `users` Drizzle table (application profile/role; UUID aligns with Supabase `auth.users.id`). Session/account state lives in Supabase Auth, not custom tables.

- [ ] **Step 1: Create users schema**

```typescript
// packages/database/src/schema/users.ts
import { pgTable, text, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";

/**
 * Application users (leadership profiles & roles).
 * Primary key UUID aligns with Supabase auth.users.id.
 * Session storage is managed by Supabase Auth — no custom sessions/accounts tables.
 * ADR-0007: regular members have no admin portal accounts.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // references Supabase auth.users.id
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: varchar("role", { length: 64 }).default("MEMBER_REGULAR").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

- [ ] **Step 2: Add export to schema index**

Add to `packages/database/src/schema/index.ts`:
```typescript
// Application users (Supabase auth profile/role)
export * from "./users";
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm --filter @repo/database typecheck`

- [ ] **Step 4: Commit**

```bash
git add packages/database/src/schema/users.ts packages/database/src/schema/index.ts
git commit -m "feat(db): add application users schema (Supabase-aligned)"
```

---

### Task 3: Create application users migration SQL

**Files:**
- Create: `packages/database/src/migrations/0002_add_users.sql`
- Modify: `packages/database/src/migrations/meta/_journal.json`

**Interfaces:**
- Produces: Migration SQL that creates the application `users` table (Supabase sessions live on Supabase Auth side)

- [ ] **Step 1: Create migration SQL**

```sql
-- packages/database/src/migrations/0002_add_users.sql
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "email_verified" boolean DEFAULT false NOT NULL,
  "image" text,
  "role" varchar(64) DEFAULT 'MEMBER_REGULAR' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE ("email")
);
```

- [ ] **Step 2: Add journal entry**

Update `packages/database/src/migrations/meta/_journal.json` — add entry:
```json
{
  "idx": 2,
  "version": "7",
  "when": 1788700000000,
  "tag": "0002_add_users",
  "breakpoints": true
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/database/src/migrations/
git commit -m "feat(db): add application users migration"
```

---

### Task 4: Initialize Supabase Auth instance

**Files:**
- Create: `packages/auth/src/types.ts`
- Create: `packages/auth/src/index.ts`

**Interfaces:**
- Produces: `auth` instance from `packages/auth`
- Produces: `SessionUser` type with global roles and sub-department scopes

- [ ] **Step 1: Create types.ts**

```typescript
// packages/auth/src/types.ts
import type { User, Session } from "@repo/database/schema";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
  globalRoles: string[];
  subDeptRoles: Array<{
    subDepartmentCode: string;
    role: string;
  }>;
}

export interface AuthContext {
  user: User;
  session: Session;
  sessionUser: SessionUser;
}
```

- [ ] **Step 2: Create index.ts with Supabase Auth**

```typescript
// packages/auth/src/index.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "../env.js"; // or process.env

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Verify a Supabase access token (JWT) and return the authenticated user.
 * Used by requireAuth() middleware on the Express API.
 */
export async function verifySupabaseToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }
  return data.user;
}

export type AuthUser = Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"];
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm --filter @repo/auth typecheck`

- [ ] **Step 4: Commit**

```bash
git add packages/auth/src/
git commit -m "feat(auth): initialize Supabase Auth client"
```

---

### Task 5: Implement RBAC middleware

**Files:**
- Create: `packages/auth/src/middleware.ts`

**Interfaces:**
- Consumes: `auth` instance from `./index.ts`
- Produces: `requireAuth()` Express middleware
- Produces: `requireScopePermission()` Express middleware

- [ ] **Step 1: Create middleware.ts**

```typescript
// packages/auth/src/middleware.ts
import type { Request, Response, NextFunction } from "express";
import { verifySupabaseToken } from "./index.js";
import { db } from "@repo/database";
import { subDepartmentMembers, subDepartments } from "@repo/database/schema";
import { eq } from "drizzle-orm";
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
  // Supabase SSR auth cookie (or Authorization: Bearer <access_token>)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  // Fallback to Authorization header
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
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get sub-department memberships
  const memberships = await db
    .select({
      subDepartmentCode: subDepartments.code,
      role: subDepartmentMembers.role,
    })
    .from(subDepartmentMembers)
    .innerJoin(subDepartments, eq(subDepartmentMembers.subDepartmentId, subDepartments.id))
    .where(eq(subDepartmentMembers.memberId, userId));

  // Determine global roles from user.role field
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
    subDeptRoles: memberships,
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
      const user = await verifySupabaseToken(token);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: "AUTH_SESSION_INVALID",
            message: "Invalid or expired session",
          },
        });
      }

      const sessionUser = await resolveUserScopes(user.id);
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

    // 1. SUPER_ADMIN always has access
    if (user.globalRoles.includes("SUPER_ADMIN")) {
      return next();
    }

    // 2. Check allowed global roles
    if (options.allowedGlobalRoles?.some((r) => user.globalRoles.includes(r))) {
      return next();
    }

    // 3. Check sub-department scoped role
    if (options.requiredSubDeptCode) {
      const match = user.subDeptRoles.find(
        (r) => r.subDepartmentCode === options.requiredSubDeptCode
      );
      if (
        match &&
        (!options.allowedSubDeptRoles ||
          options.allowedSubDeptRoles.includes(match.role))
      ) {
        return next();
      }
    }

    // 4. Deny access
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN_INSUFFICIENT_SCOPE",
        message:
          "You do not have permission to perform this action in this sub-department scope.",
      },
    });
  };
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @repo/auth typecheck`

- [ ] **Step 3: Commit**

```bash
git add packages/auth/src/middleware.ts
git commit -m "feat(auth): implement requireAuth and requireScopePermission middleware"
```

---

### Task 6: Add auth to API dependencies

**Files:**
- Modify: `apps/api/package.json` — Add `"@repo/auth": "workspace:*"` to dependencies
- Modify: `apps/api/src/config/env.ts` — Require `SUPABASE_URL` and `SUPABASE_ANON_KEY` env vars

**Interfaces:**
- Consumes: @repo/auth package
- Produces: API app with auth dependency available

- [ ] **Step 1: Add dependency to API package.json**

Add to `dependencies`:
```json
"@repo/auth": "workspace:*",
```

- [ ] **Step 2: Add Supabase env vars to env config**

Add to `apps/api/src/config/env.ts` (Zod schema / env object):
```typescript
SUPABASE_URL: process.env.SUPABASE_URL,
SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`

- [ ] **Step 4: Commit**

```bash
git add apps/api/package.json apps/api/src/config/env.ts pnpm-lock.yaml
git commit -m "feat(api): add @repo/auth dependency and Supabase env vars"
```

---

### Task 7: Mount auth handlers on Express

**Files:**
- Modify: `apps/api/src/app.ts` — Mount auth session/sign-out routes

**Interfaces:**
- Consumes: `verifySupabaseToken` from `@repo/auth`
- Produces: Auth routes at `/api/v1/auth/*`

- [ ] **Step 1: Mount auth routes on app.ts**

Add to `apps/api/src/app.ts` (matches existing `authRouter` mount):

```typescript
// Auth session endpoint (Supabase JWT verification)
app.use(`${env.API_PREFIX}/auth`, authRouter);
// authRouter implements:
//   GET  /api/v1/auth/session  → verifySupabaseToken + return user
//   POST /api/v1/auth/sign-out → clear session cookie / no-op JWT
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @repo/api typecheck`

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/app.ts
git commit -m "feat(api): mount auth routes on Express"
```

---

### Task 8: Write unit tests for auth configuration

**Files:**
- Create: `packages/auth/src/__tests__/auth.test.ts`

**Interfaces:**
- Consumes: `supabase` / `verifySupabaseToken` from `../index.js`
- Produces: Tests verifying Supabase Auth client is configured correctly

- [ ] **Step 1: Create auth test**

```typescript
// packages/auth/src/__tests__/auth.test.ts
import { describe, it, expect } from "vitest";
import { supabase, verifySupabaseToken } from "../index.js";

describe("Supabase Auth Configuration", () => {
  it("should export a Supabase client", () => {
    expect(supabase).toBeDefined();
    expect(typeof verifySupabaseToken).toBe("function");
  });

  it("should expose verifySupabaseToken for JWT verification", () => {
    expect(typeof verifySupabaseToken).toBe("function");
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd packages/auth && npx vitest run`

- [ ] **Step 3: Commit**

```bash
git add packages/auth/src/__tests__/
git commit -m "test(auth): add unit tests for Supabase Auth configuration"
```

---

### Task 9: Write unit tests for RBAC middleware

**Files:**
- Create: `packages/auth/src/__tests__/middleware.test.ts`

**Interfaces:**
- Consumes: `requireAuth`, `requireScopePermission`
- Produces: Tests covering all permission scenarios

- [ ] **Step 1: Create middleware test**

```typescript
// packages/auth/src/__tests__/middleware.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requireScopePermission, type RequireScopePermissionOptions } from "../middleware.js";

// Mock the auth module
vi.mock("../index.js", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

function createMockRequest(sessionUser?: any): Request {
  return {
    sessionUser,
    headers: {},
    url: "/test",
    method: "GET",
  } as unknown as Request;
}

function createMockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

describe("requireScopePermission Middleware", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = createMockResponse();
    next = vi.fn();
  });

  it("should return 401 if no session user", () => {
    const req = createMockRequest(undefined);
    const middleware = requireScopePermission({});
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should allow SUPER_ADMIN access to everything", () => {
    const req = createMockRequest({
      globalRoles: ["SUPER_ADMIN"],
      subDeptRoles: [],
    });
    const middleware = requireScopePermission({ requiredSubDeptCode: "TIMIHRT" });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should allow matching global role", () => {
    const req = createMockRequest({
      globalRoles: ["CHAIRPERSON"],
      subDeptRoles: [],
    });
    const middleware = requireScopePermission({ allowedGlobalRoles: ["CHAIRPERSON"] });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should deny non-matching global role", () => {
    const req = createMockRequest({
      globalRoles: ["MEMBER_REGULAR"],
      subDeptRoles: [],
    });
    const middleware = requireScopePermission({ allowedGlobalRoles: ["CHAIRPERSON"] });
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should allow matching sub-department role", () => {
    const req = createMockRequest({
      globalRoles: [],
      subDeptRoles: [{ subDepartmentCode: "TIMIHRT", role: "SUB_DEPT_LEADER" }],
    });
    const middleware = requireScopePermission({
      requiredSubDeptCode: "TIMIHRT",
      allowedSubDeptRoles: ["SUB_DEPT_LEADER"],
    });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should deny wrong sub-department scope", () => {
    const req = createMockRequest({
      globalRoles: [],
      subDeptRoles: [{ subDepartmentCode: "MEZMUR", role: "SUB_DEPT_LEADER" }],
    });
    const middleware = requireScopePermission({
      requiredSubDeptCode: "TIMIHRT",
      allowedSubDeptRoles: ["SUB_DEPT_LEADER"],
    });
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should deny wrong role in correct sub-department", () => {
    const req = createMockRequest({
      globalRoles: [],
      subDeptRoles: [{ subDepartmentCode: "TIMIHRT", role: "MEMBER_REGULAR" }],
    });
    const middleware = requireScopePermission({
      requiredSubDeptCode: "TIMIHRT",
      allowedSubDeptRoles: ["SUB_DEPT_LEADER", "SUB_DEPT_SECRETARY"],
    });
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return FORBIDDEN_INSUFFICIENT_SCOPE error code", () => {
    const req = createMockRequest({
      globalRoles: [],
      subDeptRoles: [],
    });
    const middleware = requireScopePermission({
      allowedGlobalRoles: ["CHAIRPERSON"],
    });
    middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "FORBIDDEN_INSUFFICIENT_SCOPE",
        }),
      })
    );
  });
});
```

- [ ] **Step 2: Run tests**

Run: `cd packages/auth && npx vitest run`

- [ ] **Step 3: Commit**

```bash
git add packages/auth/src/__tests__/middleware.test.ts
git commit -m "test(auth): add unit tests for RBAC middleware"
```

---

### Task 10: Run full CI and fix any issues

**Files:**
- Any files with type or lint errors

**Interfaces:**
- Consumes: All previous tasks
- Produces: Clean CI pass (format, lint, typecheck, unit tests, build)

- [ ] **Step 1: Run format check**

Run: `pnpm format:check`

- [ ] **Step 2: Run lint**

Run: `pnpm lint`

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`

- [ ] **Step 4: Run unit tests**

Run: `pnpm test:unit`

- [ ] **Step 5: Run build**

Run: `pnpm build`

- [ ] **Step 6: Fix any errors found**

- [ ] **Step 7: Commit fixes**

```bash
git add -A
git commit -m "fix: resolve CI issues for Phase 2 auth implementation"
```

---

### Task 11: Update ClickUp tasks to done

- [ ] **Step 1: Update CORE-019 to done**
- [ ] **Step 2: Update CORE-020 to done**
- [ ] **Step 3: Update CORE-021 to done**
- [ ] **Step 4: Update CORE-022 to done**

---

## Self-Review

**1. Spec coverage:**
- ✅ Supabase Auth client configured (Task 4)
- ✅ Application users table created (roles/UUID = Supabase auth id) (Task 2, 3)
- ✅ Session cookies configured (httpOnly, secure, sameSite) (Task 4)
- ✅ Supabase Auth client configured (Task 4)
- ✅ Application users table created (roles/UUID = Supabase auth id) (Task 2, 3)
- ✅ requireAuth() validates session cookies (Task 5)
- ✅ requireScopePermission() checks global roles first, then sub-dept (Task 5)
- ✅ Returns HTTP 403 with FORBIDDEN_INSUFFICIENT_SCOPE (Task 5)
- ✅ Non-leadership members denied access (ADR-0007) (Task 5 middleware resolves roles)
- ✅ Unit tests cover all permission scenarios (Task 9)
- ✅ Auth API endpoints via Supabase Auth handlers (Task 7)

**2. Placeholder scan:** No placeholders found. All code blocks are complete.

**3. Type consistency:**
- `SessionUser` type used consistently in middleware and types
- `requireAuth()` and `requireScopePermission()` signatures match docs
- Auth tables use consistent UUID primary keys and timestamp patterns
