# Backend Authorization & Scoped RBAC Engine

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Architecture ADR:** Scoped RBAC Tables (ADR-0005)  

---

## 1. Scoped Role Evaluation Algorithm

When an authenticated user invokes an endpoint requiring permissions on resource $R$ within sub-department scope $S$:

```mermaid
flowchart TD
    Start[Evaluate User Request] --> CheckSuper{User is SUPER_ADMIN?}
    CheckSuper -- Yes --> Grant[GRANT ACCESS]
    CheckSuper -- No --> CheckChair{User is CHAIRPERSON or SUB_CHAIRPERSON?}
    CheckChair -- Yes --> Grant
    CheckChair -- No --> CheckSec{Endpoint is Secretary Admin & User is SECRETARY?}
    CheckSec -- Yes --> Grant
    CheckSec -- No --> CheckScope{User holds Leader/Sub-Leader/Secretary in Target Sub-Dept S?}
    CheckScope -- Yes --> Grant
    CheckScope -- No --> CheckGrant{Endpoint bound to resource+action and active BR-035 grant exists?}
    CheckGrant -- Yes --> Grant
    CheckGrant -- No --> Deny[DENY ACCESS: HTTP 403 FORBIDDEN]
```

### 1.1 Temporary grant fallback (BR-035 / ADR-0019)

When `requireScopePermission` is declared with both `resource` and `action` (e.g. `members` / `C`) and every role/sub-department check fails, the middleware performs a fail-closed DB lookup for a non-revoked, unexpired `permission_grants` row matching the user + resource + action. On success it sets `req.permissionGrantUsed = true` and continues; on lookup error or no row it returns `403 FORBIDDEN_INSUFFICIENT_SCOPE`. Middleware declared **without** `resource`/`action` keeps the synchronous role-only path (no DB hit).

---

## 2. Reusable Guard Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

export function requireScopePermission(options: {
  allowedGlobalRoles?: string[];
  requiredSubDeptCode?: string;
  allowedSubDeptRoles?: string[];
  /** BR-035: optional resource+action pair enables the active-grant fallback. */
  resource?: string;
  action?: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_UNAUTHORIZED', message: 'Authentication required' } });
    }

    // 1. Check Global Executive Roles
    if (user.globalRoles.includes('SUPER_ADMIN')) return next();
    if (options.allowedGlobalRoles && options.allowedGlobalRoles.some(r => user.globalRoles.includes(r as any))) {
      return next();
    }

    // 2. Check Sub-Department Scoped Role
    if (options.requiredSubDeptCode) {
      const match = user.subDeptRoles.find(r => r.subDepartmentCode === options.requiredSubDeptCode);
      if (match && (!options.allowedSubDeptRoles || options.allowedSubDeptRoles.includes(match.role))) {
        return next();
      }
    }

    // 3. BR-035: consult an active temporary grant when resource+action are bound
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
        .catch(() => denyScope(res));
      return;
    }

    return denyScope(res);
  };
}
```

### 2.1 Member registration with grant fallback

```typescript
// apps/api/src/modules/member/presentation/member.router.ts
memberRouter.use(requireAuth());
memberRouter.post(
  '/stage1',
  requireScopePermission({
    allowedGlobalRoles: ['CHAIRPERSON', 'SUB_CHAIRPERSON', 'SECRETARY'],
    resource: 'members',
    action: 'C',
  }),
  createStage1
);
```

If the Secretary is unavailable, SUPER_ADMIN can issue `members:C` for up to 7 days to a selected user; that user then passes this guard via the grant fallback.

---

## 3. Implementation Details

### 3.1 packages/permissions

The RBAC system is implemented as a dedicated package:

| File | Purpose |
| :--- | :--- |
| `packages/permissions/src/types.ts` | `GlobalRole` enum (SUPER_ADMIN, CHAIRPERSON, SUB_CHAIRPERSON, SECRETARY, MEMBER_REGULAR), `ResourceType` enum, `ActionType` enum, `SubDepartmentCode` enum |
| `packages/permissions/src/matrix.ts` | `PERMISSION_MATRIX` record mapping `GlobalRole` to `Permission[]` arrays |
| `packages/permissions/src/checker.ts` | `hasGlobalPermission()`, `hasSubDeptPermission()`, `checkPermission()` functions |
| `packages/permissions/src/leadership.ts` | BR-009 One Leadership Post Rule validation |
| `packages/permissions/src/sub-dept-permissions.ts` | Sub-department scoped permission evaluation |
| `packages/permissions/src/grants.ts` | BR-035 grant types, `isGrantActive`, `hasActiveGrant`, `validateGrantPayload`, `MAX_GRANT_DURATION_DAYS = 7` |
| `packages/database/src/schema/auth.ts` | `permission_grants` table (migration `0010_permission_grants.sql`) |

### 3.2 packages/auth

The auth middleware wraps permission checks:

| File | Purpose |
| :--- | :--- |
| `packages/auth/src/index.ts` | `requireAuth` (JWT verification), `requireScopePermission` (RBAC evaluation) |

### 3.3 BR-008 Enforcement

User management endpoints are restricted to `SUPER_ADMIN` and `CHAIRPERSON`:

```typescript
// apps/api/src/modules/users/presentation/users.router.ts
router.use(requireScopePermission({ allowedGlobalRoles: ['SUPER_ADMIN', 'CHAIRPERSON'] }));

// apps/api/src/modules/audit/presentation/audit.router.ts
router.use(requireScopePermission({ allowedGlobalRoles: ['SUPER_ADMIN', 'CHAIRPERSON'] }));
```

### 3.4 Super Admin Bypass

The `SUPER_ADMIN` role bypasses all permission checks. This is a design decision: Super Admin has unrestricted access to all resources and actions. Implementation:
- `packages/permissions/src/checker.ts`: `if (role === GlobalRole.SUPER_ADMIN) return true;`
- `packages/auth/src/index.ts`: `if (user.globalRoles.includes('SUPER_ADMIN')) return next();`
