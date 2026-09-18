# API Authentication & Session Management

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 3.0  
**Authentication Provider:** Supabase Auth (GoTrue)  

---

## 1. Authentication Endpoints

| Endpoint | Method | Description | Auth Source | Status Codes |
| :--- | :---: | :--- | :--- | :---: |
| `/api/v1/auth/session` | `GET` | Get current user with roles & scopes | Supabase JWT (cookie/header) | `200 OK`<br>`401 Unauthorized` |
| `/api/v1/auth/sign-out` | `POST` | Client-side sign out (compatibility endpoint) | None | `200 OK` |

> **Note:** Sign-in is handled directly by Supabase Auth on the client side (`supabase.auth.signInWithPassword()`), not through the Express API.

---

## 2. Session Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Leader as Ministry Leader
    participant Admin as Next.js Admin (apps/admin)
    participant Supabase as Supabase Auth
    participant API as Express API (apps/api)
    participant DB as PostgreSQL Database

    Leader->>Admin: Enters Email & Password
    Admin->>Supabase: supabase.auth.signInWithPassword()
    Supabase-->>Admin: Session (access_token, refresh_token) + Set-Cookie

    Note over Admin, API: Authenticated API Requests
    Admin->>API: GET /api/v1/annual-plans (Cookie: sb-xxx-auth-token)
    API->>Supabase: supabase.auth.getUser(token) — verify JWT
    Supabase-->>API: Authenticated user ID
    API->>DB: Query user by ID, resolve roles & scopes
    API-->>Admin: 200 OK with Plan Data

    Leader->>Admin: Clicks Logout
    Admin->>Supabase: supabase.auth.signOut()
    Supabase-->>Admin: Cookie cleared
    Admin->>Admin: Redirect to /login
```

---

## 3. Regular Member Denial Policy (ADR-0007)

The RouteGuard component checks the user's roles after session validation. If the user does not hold at least one leadership role (`CHAIRPERSON`, `SUB_CHAIRPERSON`, `SECRETARY`, `SUPER_ADMIN`, or a sub-department `LEAD`/`ADMIN` role), access is denied:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_UNAUTHORIZED",
    "message": "Access restricted. Regular members interact via the public portfolio website and Telegram."
  }
}
```
