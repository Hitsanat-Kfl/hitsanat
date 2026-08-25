# API Authentication & Session Management

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Authentication Engine:** Better Auth (`packages/auth`)  

---

## 1. Authentication Endpoints

Better Auth handles authentication routes under `/api/v1/auth/*`:

| Endpoint | Method | Description | Request Body / Cookies | Status Codes |
| :--- | :---: | :--- | :--- | :---: |
| `/api/v1/auth/sign-in/email` | `POST` | Authenticate leadership user with email & password | `{ "email": "leader@hitsanat.org", "password": "..." }` | `200 OK`<br>`401 Unauthorized` |
| `/api/v1/auth/sign-out` | `POST` | Invalidate active session and clear cookie | Cookie: `better-auth.session_token` | `200 OK` |
| `/api/v1/auth/session` | `GET` | Get current authenticated user, leadership roles & scopes | Cookie: `better-auth.session_token` | `200 OK`<br>`401 Unauthorized` |
| `/api/v1/auth/change-password`| `POST` | Change password for current logged-in leader | `{ "currentPassword": "...", "newPassword": "..." }` | `200 OK`<br>`400 Bad Request` |

---

## 2. Session Lifecycle & Token Management

```mermaid
sequenceDiagram
    autonumber
    actor Leader as Ministry Leader
    participant Admin as Next.js Admin (apps/admin)
    participant API as Express API (apps/api)
    participant DB as PostgreSQL Database

    Leader->>Admin: Enters Email & Password
    Admin->>API: POST /api/v1/auth/sign-in/email
    API->>DB: Verify credentials & fetch active leadership roles
    alt Non-leadership user
        API-->>Admin: 403 Forbidden (Non-leadership members have no admin access)
    else Active Leader
        API->>DB: Create session record
        API-->>Admin: 200 OK with Set-Cookie: better-auth.session_token (HttpOnly; Secure; SameSite=Strict)
        Admin->>Leader: Redirect to Role-Based Dashboard
    end

    Note over Admin, API: Authenticated API Requests
    Admin->>API: GET /api/v1/annual-plans (with Cookie)
    API->>API: Better Auth validates session cookie
    API->>API: Resolves user ID, global roles & sub-dept scopes
    API-->>Admin: 200 OK with Plan Data
```

---

## 3. Regular Member Denial Policy (ADR-0007)
During the authentication handshake, if the authenticated user does not hold at least one valid leadership assignment (`CHAIRPERSON`, `SUB_CHAIRPERSON`, `SECRETARY`, `SUPER_ADMIN`, or a `SUB_DEPT_LEADER` / `SUB_DEPT_SECRETARY` role), Better Auth immediately invalidates the session and returns:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_NOT_AUTHORIZED_LEADERSHIP",
    "message": "Access restricted. Regular members interact via the public portfolio website and Telegram."
  }
}
```
