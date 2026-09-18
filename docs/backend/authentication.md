# Backend Authentication Implementation

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 3.0  
**Authentication Provider:** Supabase Auth (GoTrue)  

---

## 1. Supabase Auth Overview

Authentication is handled entirely by **Supabase Auth** — no custom auth library is needed. Supabase manages:
- Email/password sign-in
- JWT session tokens (HttpOnly cookies)
- Password hashing (bcrypt)
- User metadata storage

The admin app (`apps/admin`) communicates directly with Supabase via `@supabase/ssr`. The API (`apps/api`) verifies Supabase JWTs for protected routes.

---

## 2. Supabase Client Setup (`packages/auth`)

### Server-side client (Express API)
```typescript
import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

### Browser client (Next.js Admin)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

---

## 3. Session Verification (API Middleware)

The API uses `requireAuth()` middleware (`packages/auth/src/middleware.ts`) which:
1. Extracts the Supabase JWT from the `sb-<project-ref>-auth-token` cookie or `Authorization: Bearer` header
2. Verifies the token via `supabase.auth.getUser()` (calls Supabase auth server)
3. Looks up the user in the `users` table and resolves roles/scopes
4. Attaches `req.sessionUser` with the full `SessionUser` object

```typescript
import { requireAuth, requireScopePermission } from "@repo/auth/middleware";

router.get(
  "/members",
  requireAuth(),
  requireScopePermission({ allowedGlobalRoles: ["SUPER_ADMIN", "CHAIRPERSON"] }),
  memberController.list
);
```

---

## 4. Auth Flow

1. **Login:** Admin app calls `supabase.auth.signInWithPassword({ email, password })` directly
2. **Cookie:** Supabase sets an HttpOnly cookie (`sb-<ref>-auth-token`) on the admin domain
3. **API calls:** Admin app makes requests to API via Next.js rewrites (same-origin proxy)
4. **Verification:** API extracts JWT from cookie, verifies via Supabase, resolves user from DB
5. **Logout:** Admin app calls `supabase.auth.signOut()` which clears the cookie

---

## 5. User Provisioning

Users are created in two places:
1. **Supabase Auth** (`auth.users`) — via `supabase.auth.admin.createUser()` in the seed script
2. **Application users table** — inserted with matching UUID

The seed script (`packages/database/src/seeds/users.ts`) handles both. Requires `SUPABASE_SERVICE_ROLE_KEY` for admin API access.
