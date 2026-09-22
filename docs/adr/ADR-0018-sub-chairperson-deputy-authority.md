# ADR-0018: Sub-Chairperson Standing Deputy Authority for Executive Approvals

**Status:** Accepted  
**Deciders:** Project Manager, Abrham (Core Lead)  
**Date:** September 2026  

---

## Context

The Chairperson (`CHAIRPERSON`) is the single executive approver for plan changes (FR-17.1, BR-025), periodic report sign-offs (modules/reports.md §3), and special event publication (workflows §6). Because leadership positions are staffed by students with demanding academic schedules, a single-approver design risks approval bottlenecks whenever the Chairperson is unavailable.

Earlier dashboard documentation described the Sub-Chairperson's approvals inbox as "items the Chairperson has delegated", but no delegation mechanism (per-item assignment, delegation window, or transfer API) was ever specified, and the API spec marked the plan review endpoint "Chairperson only". This ambiguity blocks implementation of the Vice-Chairperson dashboard and the approval workflows.

## Considered Options

1. **Per-item delegation** — The Chairperson explicitly assigns each approval to the Sub-Chairperson. Maximum control, but requires a new data model, UI, and constant discipline; fails exactly when the Chairperson is unreachable.
2. **No deputy approvals** — Sub-Chairperson stays read-only. Simplest, but contradicts the documented deputy role ("can act on behalf of the Chairperson") and creates the bottleneck.
3. **Standing deputy authority (role-based)** — `SUB_CHAIRPERSON` may execute the Chairperson's approval actions at any time; the audit log records the actual actor.

## Decision

Adopt **Option 3: Standing Deputy Authority**. The `SUB_CHAIRPERSON` role may perform, without per-item delegation:

- Review of plan change requests (`PATCH /api/v1/ekd/approvals/:id/review`)
- Periodic report sign-off & archive (`PATCH /api/v1/reports/:id/approve`)
- Event approval & publish flag (`PATCH /api/v1/events/:id/approve`)

Out of scope for the deputy:

- **User account management** (BR-008 remains `SUPER_ADMIN` + `CHAIRPERSON` only).
- **Meeting update/cancellation** (BR-019 grants create/update/delete to `CHAIRPERSON`, `SUB_CHAIRPERSON`, and `SECRETARY` jointly — unchanged).
- No ability to re-delegate authority or to act as Super Admin.

All deputy actions are audit-logged under the acting user's own identity (never attributed to the Chairperson), and both executive roles receive the same notifications.

## Consequences

### Positive:
- Eliminates the single-approver bottleneck with zero new data model or delegation UI.
- Matches the ministry's mental model of a deputy ("can act on behalf of the Chairperson").
- Simple to enforce with the existing `requireScopePermission` guard.

### Negative / Accepted Trade-offs:
- The Sub-Chairperson can act without the Chairperson's prior knowledge; mitigated by audit logging and shared notifications.
- Approvals are no longer attributable to a single person; reports and audit views must display the actual acting user.
