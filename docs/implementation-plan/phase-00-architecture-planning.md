# Phase 0 — Architecture & Planning

## Objective

Establish all schema contracts, API contracts, shared package interfaces, and architectural foundations that every subsequent phase depends on. No feature code is written in this phase — only contracts, interfaces, and specifications.

## Scope

### Included
- Database schema contracts for all domain entities
- API contract specifications (OpenAPI)
- Shared package interfaces (`packages/domain`, `packages/permissions`, `packages/validation`)
- Module structure templates (`apps/api/src/modules/`)
- Testing infrastructure validation

### Out of Scope
- Feature implementation
- Database migrations (schema contracts only)
- UI development
- Authentication implementation

---

## Dependencies

None — this is the starting phase.

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Defines all contracts and interfaces |
| Israel | Backend Support | NONE |
| Eyob | Frontend Developer | REVIEW — Reviews public API contracts |
| TBD | Frontend Developer | REVIEW — Reviews admin API contracts |

---

## Tasks

### ARCH-001
**Database Schema Contract: Identity & Membership**

- **Description:** Define Drizzle schema contracts for `members`, `sub_departments`, `sub_department_members`, `families`, `family_members` tables. Include column types, constraints, indexes, and relationships. Document in `docs/database/entities.md` (already exists — verify completeness).
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** None
- **Deliverable:** Verified schema contracts matching `docs/database/entities.md`
- **Acceptance Criteria:**
  - All 5 tables fully specified
  - Foreign key relationships defined
  - Check constraints documented
  - Unique constraints documented
  - Indexes specified
- **Reviewer:** Core

### ARCH-002
**Database Schema Contract: Beneficiaries & Parents**

- **Description:** Define Drizzle schema contracts for `children`, `parents`, `child_parents` tables. Include the composite unique constraint `(child_id, relation)` for parent cardinality.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** None
- **Deliverable:** Verified schema contracts for beneficiary entities
- **Acceptance Criteria:**
  - 3 tables fully specified
  - Parent cardinality constraint documented
  - Kutr group check constraint defined
  - Collection location check constraint defined
- **Reviewer:** Core

### ARCH-003
**Database Schema Contract: Planning**

- **Description:** Define Drizzle schema contracts for `annual_master_plans`, `plan_goals`, `plan_activities`, `plan_distributions`, `weekly_plans`, `plan_progress_records`. Include the weight calculation fields and quarterly distribution columns.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** None
- **Deliverable:** Verified schema contracts for planning entities
- **Acceptance Criteria:**
  - 6 tables fully specified
  - Weight fields documented
  - Quarterly distribution columns defined
  - Progress roll-up fields specified
- **Reviewer:** Core

### ARCH-004
**Database Schema Contract: Attendance & Events**

- **Description:** Define Drizzle schema contracts for `program_sessions`, `program_session_attendance`, `events`, `event_program_assignments`, `event_attendance`. Include separate attendance tables per ADR-0001.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** None
- **Deliverable:** Verified schema contracts for attendance and event entities
- **Acceptance Criteria:**
  - Separate attendance tables per ADR-0001
  - Auto-seeding fields per ADR-0002
  - Multi-member assignment constraint (≥2 members)
  - Session type check constraints
- **Reviewer:** Core

### ARCH-005
**Database Schema Contract: Academic & Announcements**

- **Description:** Define Drizzle schema contracts for `academic_assessments`, `student_scores`, `announcements`, `audit_logs`.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** None
- **Deliverable:** Verified schema contracts for academic and announcement entities
- **Acceptance Criteria:**
  - 4 tables fully specified
  - Assessment type check constraint defined
  - Audit log JSONB payload field documented
- **Reviewer:** Core

### ARCH-006
**API Contract Specification: All Modules**

- **Description:** Define or verify OpenAPI 3.1 specifications for all 12 module endpoint groups. Use existing `docs/api/endpoints.md` as baseline. Ensure all request/response schemas are Zod-compatible.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** ARCH-001 through ARCH-005
- **Deliverable:** Complete OpenAPI specifications for all modules
- **Acceptance Criteria:**
  - All endpoints from `docs/api/endpoints.md` have OpenAPI specs
  - Request/response schemas defined
  - Error response schemas defined
  - Authentication requirements documented per endpoint
  - Authorization scopes documented per endpoint
- **Reviewer:** Core, Backend

### ARCH-007
**Shared Domain Package Interface**

- **Description:** Define the interface for `packages/domain` — core business entities, value objects, and calculation engines. Include the planning weight calculation engine interface and progress roll-up interface.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** ARCH-003
- **Deliverable:** Package interface specification
- **Acceptance Criteria:**
  - Planning weight engine interface defined
  - Progress roll-up engine interface defined
  - Domain entity interfaces defined
  - Value object interfaces defined
- **Reviewer:** Core

### ARCH-008
**Shared Permissions Package Interface**

- **Description:** Define the interface for `packages/permissions` — RBAC matrices, permission constants, scope evaluation helpers. Map to existing `docs/requirements/roles-and-permissions.md`.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** None
- **Deliverable:** Permissions package interface specification
- **Acceptance Criteria:**
  - Role taxonomy constants defined
  - Permission matrix mapped to code constants
  - Scope evaluation helper interface defined
  - Guard middleware interface defined
- **Reviewer:** Core

### ARCH-009
**Module Structure Template**

- **Description:** Create the template directory structure for API modules following Clean Architecture. Define the standard file layout: `domain/`, `application/`, `infrastructure/`, `presentation/`.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** None
- **Deliverable:** Module template in `apps/api/src/modules/README.md` (update existing)
- **Acceptance Criteria:**
  - Template directory structure documented
  - Standard file naming conventions defined
  - Import boundary rules documented
  - Example module skeleton provided
- **Reviewer:** Core

### ARCH-010
**Testing Infrastructure Validation**

- **Description:** Verify that the testing infrastructure (Vitest, Playwright, integration test setup) works correctly with the current monorepo structure. Run full test suite and document any issues.
- **Lane:** Core
- **Priority:** Medium
- **Dependencies:** None
- **Deliverable:** Test infrastructure validation report
- **Acceptance Criteria:**
  - Unit tests pass
  - Integration tests pass (with test PostgreSQL)
  - E2E smoke tests pass
  - Accessibility tests pass
  - CI pipeline runs successfully
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- ARCH-001 through ARCH-005 (independent schema contracts)
- ARCH-007 and ARCH-008 (independent package interfaces)
- ARCH-009 and ARCH-010 (independent infrastructure tasks)

**Must happen sequentially:**
- ARCH-006 depends on ARCH-001 through ARCH-005
- ARCH-007 depends on ARCH-003 (planning schema informs domain interface)

---

## Deliverables

1. Verified database schema contracts for all entities
2. Complete OpenAPI specifications for all modules
3. Shared package interface specifications
4. Module structure template
5. Test infrastructure validation report

---

## Exit Criteria

- [ ] All 5 database schema contracts verified against `docs/database/entities.md`
- [ ] OpenAPI specifications complete for all 12 modules
- [ ] `packages/domain` interface defined
- [ ] `packages/permissions` interface defined
- [ ] Module template documented
- [ ] Test infrastructure validated (all tests pass)
- [ ] No OPEN DECISION items blocking Phase 1
