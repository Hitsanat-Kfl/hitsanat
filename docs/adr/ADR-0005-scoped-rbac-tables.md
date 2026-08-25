# ADR-0005: Scoped Role-Based Access Control via Dedicated Join Tables

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Kifl Leadership  
**Date:** August 2026  

---

## Context
In Hitsanat Kifl, leadership responsibilities are distributed across five distinct sub-departments (Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb) and executive roles (Chairperson, Sub-Chairperson, Secretary). 

A single flat role column on the member entity (e.g. `role = 'Leader'`) cannot capture reality because:
1. A student member may be a Leader in Timihrt, but simultaneously a regular Member in Mezmur.
2. A member holding a leadership role in one sub-department must **not** have administrative write access in another sub-department.
3. Members can hold multiple roles simultaneously across different scopes.

---

## Decision
Implement a scoped RBAC model with dedicated relational join tables:
- `sub_department_members`: Maps `member_id` $\leftrightarrow$ `sub_department_id` with scoped role (`Leader`, `Sub-Leader`, `Secretary`, `Member`).
- Executive roles (`CHAIRPERSON`, `SUB_CHAIRPERSON`, `SECRETARY`, `SUPER_ADMIN`) grant global oversight across all sub-departments.
- Scoped guard middleware (`requireScopePermission`) validates permissions at the controller boundary.

---

## Consequences
### Positive:
- True least-privilege security model matching the ministry's real governance structure.
- Prevents accidental or unauthorized modifications across department boundaries.
- Flexible support for members serving in multiple departments.

### Negative:
- Authorization evaluation requires joining sub-department membership tables during session resolution.
