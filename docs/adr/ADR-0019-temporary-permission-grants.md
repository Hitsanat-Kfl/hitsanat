# ADR-0019: Temporary Permission Grants for Temporary Role Holder Unavailability

**Status:** Accepted  
**Date:** 2026-09-23  
**Deciders:** HITs (admin / product)  
**Related:** BR-035, ADR-0005 (Scoped RBAC), ADR-0007 (Regular Members Restricted)

---

## Context

When a designated role holder (e.g. the Secretary) is unavailable, there is no temporary, auditable way to authorize another user for a specific action (e.g. member registration) without permanently elevating their role or violating BR-033 (regular members have zero admin access).

Example scenario: Secretary unavailable → nobody can register members → Super Admin needs to grant `members:C` to a selected user for a short period.

## Decision

We introduce a **temporary permission grant** model:

- A grant is a row in the `permission_grants` table binding `user_id` → single `resource` × `action` with `expires_at`, `revoked_at`, `granted_by`, `revoked_by`, `reason`.
- Only `SUPER_ADMIN` may create, list, or revoke grants (enforced in both the router and the use-cases).
- Expiry is **mandatory**, must be in the future, and is capped at **`MAX_GRANT_DURATION_DAYS = 7`**.
- Early revoke is allowed while active; revoked or expired grants no longer authorize.
- `requireScopePermission({ resource, action, ... })` consults grants **only after** role/sub-department checks fail, then sets `req.permissionGrantUsed = true` for audit visibility. Fail-closed on DB error.
- Create/revoke are audit-logged via `RecordAuditLogUseCase` as `PERMISSION_GRANT_CREATED` / `PERMISSION_GRANT_REVOKED`.

## Consequences

### Positive
- Short-lived, least-privilege recovery path for unavailable role holders without changing global roles.
- Full audit trail; SUPER_ADMIN-only governance; clear UI on User Accounts → user detail.

### Negative / Risks
- Middleware gains an async DB path when `resource`/`action` are bound (existing synchronous role-only path remains for unbound guards).
- Grants do not substitute for role changes; misuse is limited by the 7-day cap and SUPER_ADMIN-only issuance.
