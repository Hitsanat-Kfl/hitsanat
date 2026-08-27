# Phase 2 — Authentication & Authorization

## Objective

Implement complete authentication and authorization infrastructure: Better Auth integration, scoped RBAC guards, login flows, session management, and role-based access control. This phase gates all subsequent protected features.

## Scope

### Included
- Better Auth configuration and integration
- Session management (cookies, tokens)
- Scoped RBAC middleware (`requireAuth`, `requireScopePermission`)
- Login page (Admin app)
- Role-based route guards
- Auth-related API endpoints
- Auth integration tests

### Out of Scope
- Member registration (Phase 4)
- Dashboard features (Phase 7)
- Public portfolio authentication (not needed — zero auth)

---

## Dependencies

- Phase 1 complete (database tables, shared packages)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Auth architecture, RBAC guards, session management, auth endpoints |
| Israel | Backend Support | SUPPORT — Auth validation schemas, tests |
| Eyob | Frontend Developer | SUPPORT — Login page, route guards |
| TBD | Frontend Developer | SUPPORT — Login page, route guards |

---

## Tasks

### AUTH-001
**Better Auth Configuration**

- **Description:** Configure Better Auth in `packages/auth`. Set up auth adapter for PostgreSQL, session cookie configuration, and provider setup (email/password).
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** FND-001
- **Deliverable:** `packages/auth` with working auth configuration
- **Acceptance Criteria:**
  - Better Auth configured with PostgreSQL adapter
  - Session cookies configured (httpOnly, secure, sameSite)
  - Auth tables created (users, sessions, accounts)
  - Unit tests pass
- **Reviewer:** Core

### AUTH-002
**Auth Database Tables**

- **Description:** Create Drizzle schemas and migrations for Better Auth tables: `users`, `sessions`, `accounts`, `verification_tokens`. Include role field on `users` table.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** FND-001
- **Deliverable:** Auth table migrations + integration test
- **Acceptance Criteria:**
  - Auth tables created in migration
  - Role field included on users table
  - Session table has proper indexes
  - Migration runs cleanly
- **Reviewer:** Core

### AUTH-003
**Scoped RBAC Middleware**

- **Description:** Implement `requireAuth()` and `requireScopePermission(resource, action, subDeptScope?)` middleware in `apps/api/src/shared/`. Integrate with `packages/permissions`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** FND-008, AUTH-001
- **Deliverable:** RBAC middleware + unit tests + integration tests
- **Acceptance Criteria:**
  - `requireAuth()` validates session cookies
  - `requireScopePermission()` checks global roles first
  - Falls back to sub-department scoped roles
  - Returns HTTP 403 with `FORBIDDEN_INSUFFICIENT_SCOPE` on failure
  - Non-leadership members denied access (ADR-0007, BR-033)
  - Unit tests cover all permission scenarios
- **Reviewer:** Core

### AUTH-004
**Auth API Endpoints**

- **Description:** Implement auth endpoints: `POST /api/v1/auth/sign-in/email`, `POST /api/v1/auth/sign-up/email`, `POST /api/v1/auth/sign-out`, `GET /api/v1/auth/session`.
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** AUTH-001, AUTH-003
- **Deliverable:** Auth endpoints + integration tests
- **Acceptance Criteria:**
  - Sign-in creates session cookie
  - Sign-up creates user account
  - Sign-out invalidates session
  - Session endpoint returns current user with roles
  - Integration tests verify all flows
- **Reviewer:** Core

### AUTH-005
**Admin Login Page**

- **Description:** Build the login page in `apps/admin` with email/password form, error handling, and redirect to dashboard on success.
- **Lane:** Frontend 2
- **Priority:** Critical
- **Dependencies:** AUTH-004
- **Deliverable:** Login page + Playwright E2E test
- **Acceptance Criteria:**
  - Login form with email and password fields
  - Error message display on invalid credentials
  - Redirect to dashboard on successful login
  - Loading state during authentication
  - Accessible (WCAG 2.1 AA)
  - Mobile-responsive
- **Reviewer:** Core, Frontend 2

### AUTH-006
**Admin Route Guards**

- **Description:** Implement protected route wrapper in `apps/admin` that redirects unauthenticated users to login and enforces role-based access.
- **Lane:** Frontend 2
- **Priority:** Critical
- **Dependencies:** AUTH-005
- **Deliverable:** Route guard component + E2E test
- **Acceptance Criteria:**
  - Unauthenticated users redirected to login
  - Authenticated users with no leadership role denied access (ADR-0007)
  - Session refresh on navigation
  - E2E test verifies guard behavior
- **Reviewer:** Core, Frontend 2

### AUTH-007
**Auth Integration Tests**

- **Description:** Write comprehensive integration tests for the auth system: sign-in, sign-out, session validation, role checking, scope isolation.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** AUTH-004
- **Deliverable:** Auth integration test suite
- **Acceptance Criteria:**
  - Sign-in/sign-out flow tested
  - Session persistence tested
  - Role-based access tested
  - Scope isolation tested (Timihrt lead cannot access Mezmur data)
  - Non-leader lockout tested (ADR-0007)
- **Reviewer:** Core

### AUTH-008
**OpenAPI Auth Documentation**

- **Description:** Update Swagger/OpenAPI specification with auth endpoint documentation including request/response schemas.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** AUTH-004
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - All auth endpoints documented
  - Request/response schemas defined
  - Error responses documented
  - Security scheme defined
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- AUTH-001 and AUTH-002 (independent auth setup)
- AUTH-005 and AUTH-007 (frontend login and backend tests)
- AUTH-008 (documentation)

**Must happen sequentially:**
- AUTH-003 depends on AUTH-001 and FND-008
- AUTH-004 depends on AUTH-001 and AUTH-003
- AUTH-005 depends on AUTH-004
- AUTH-006 depends on AUTH-005

---

## Deliverables

1. Better Auth configuration
2. Auth database tables
3. Scoped RBAC middleware
4. Auth API endpoints
5. Admin login page
6. Admin route guards
7. Auth integration tests
8. OpenAPI auth documentation

---

## Exit Criteria

- [ ] Better Auth configured and functional
- [ ] Auth tables migrated
- [ ] RBAC middleware enforces scoped permissions
- [ ] Login endpoint works end-to-end
- [ ] Admin login page functional
- [ ] Route guards prevent unauthorized access
- [ ] Non-leadership members locked out (ADR-0007)
- [ ] All auth integration tests pass
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
