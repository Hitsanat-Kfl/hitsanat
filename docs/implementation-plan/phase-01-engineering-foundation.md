# Phase 1 — Engineering Foundation

## Objective

Build the core engineering infrastructure: database migrations for all domain tables, shared packages (`packages/domain`, `packages/permissions`, `packages/validation`), and the module skeleton structure. This phase creates the foundation that all feature development depends on.

## Scope

### Included
- Database migrations for all domain entities
- `packages/domain` — Core business logic, calculation engines
- `packages/permissions` — RBAC constants and evaluation
- `packages/validation` — Shared Zod schemas
- Module skeleton structure in `apps/api/src/modules/`
- Seed scripts for `sub_departments` table

### Out of Scope
- Authentication implementation (Phase 2)
- API endpoint implementation (Phase 3+)
- UI development (Phase 3+)
- Feature business logic (Phase 3+)

---

## Dependencies

- Phase 0 complete (all contracts defined)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Database migrations, shared packages, module skeletons |
| Israel | Backend Support | SUPPORT — Seed scripts, simple validation schemas |
| Eyob | Frontend Developer | NONE |
| TBD | Frontend Developer | NONE |

---

## Tasks

### FND-001
**Database Migration: Identity & Membership Tables**

- **Description:** Create Drizzle schemas and generate migrations for `members`, `sub_departments`, `sub_department_members`, `families`, `family_members`. Include all constraints, indexes, and foreign keys from ARCH-001.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** ARCH-001
- **Deliverable:** Drizzle schemas + migration files + integration test
- **Acceptance Criteria:**
  - 5 tables created in migration
  - All constraints applied
  - Migration runs cleanly on test database
  - Integration test verifies table creation
- **Reviewer:** Core

### FND-002
**Database Migration: Beneficiary & Parent Tables**

- **Description:** Create Drizzle schemas and generate migrations for `children`, `parents`, `child_parents`. Include the composite unique constraint `(child_id, relation)`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** ARCH-002
- **Deliverable:** Drizzle schemas + migration files + integration test
- **Acceptance Criteria:**
  - 3 tables created in migration
  - Parent cardinality constraint enforced
  - Kutr group check constraint applied
  - Collection location check constraint applied
- **Reviewer:** Core

### FND-003
**Database Migration: Planning Tables**

- **Description:** Create Drizzle schemas and generate migrations for `annual_master_plans`, `plan_goals`, `plan_activities`, `plan_distributions`, `weekly_plans`, `plan_progress_records`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** ARCH-003
- **Deliverable:** Drizzle schemas + migration files + integration test
- **Acceptance Criteria:**
  - 6 tables created in migration
  - Weight calculation fields included
  - Quarterly distribution columns defined
  - Progress roll-up fields specified
- **Reviewer:** Core

### FND-004
**Database Migration: Attendance & Event Tables**

- **Description:** Create Drizzle schemas and generate migrations for `program_sessions`, `program_session_attendance`, `events`, `event_program_assignments`, `event_attendance`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** ARCH-004
- **Deliverable:** Drizzle schemas + migration files + integration test
- **Acceptance Criteria:**
  - Separate attendance tables per ADR-0001
  - Auto-seeding fields included
  - Session type constraints applied
- **Reviewer:** Core

### FND-005
**Database Migration: Academic & Announcement Tables**

- **Description:** Create Drizzle schemas and generate migrations for `academic_assessments`, `student_scores`, `announcements`, `audit_logs`.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** ARCH-005
- **Deliverable:** Drizzle schemas + migration files + integration test
- **Acceptance Criteria:**
  - 4 tables created in migration
  - Assessment type check constraint applied
  - Audit log JSONB field included
- **Reviewer:** Core

### FND-006
**Seed Script: Sub-Departments**

- **Description:** Create seed script to populate `sub_departments` with the 5 fixed departments: Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb. Include Amharic and English names.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** FND-001
- **Deliverable:** Seed script + seed integration test
- **Acceptance Criteria:**
  - 5 sub-departments seeded
  - Amharic names correct
  - English names correct
  - Seed is idempotent (safe to run multiple times)
- **Reviewer:** Core

### FND-007
**Shared Package: `packages/domain`**

- **Description:** Implement `packages/domain` with core business entities, value objects, and calculation engine interfaces. Include planning weight calculation engine and progress roll-up engine interfaces.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** ARCH-007
- **Deliverable:** Published package with unit tests
- **Acceptance Criteria:**
  - Package compiles without errors
  - Planning weight engine interface defined
  - Progress roll-up engine interface defined
  - Unit tests pass
  - Biome passes
- **Reviewer:** Core

### FND-008
**Shared Package: `packages/permissions`**

- **Description:** Implement `packages/permissions` with RBAC constants, role taxonomy, permission matrix, and scope evaluation helpers. Map to `docs/requirements/roles-and-permissions.md`.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** ARCH-008
- **Deliverable:** Published package with unit tests
- **Acceptance Criteria:**
  - Role constants defined (SUPER_ADMIN, CHAIRPERSON, etc.)
  - Permission matrix implemented
  - Scope evaluation helper functional
  - Unit tests pass
  - Biome passes
- **Reviewer:** Core

### FND-009
**Shared Package: `packages/validation`**

- **Description:** Implement `packages/validation` with shared Zod schemas for common API request/response patterns. Include pagination, error response, and common entity schemas.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** None
- **Deliverable:** Published package with unit tests
- **Acceptance Criteria:**
  - Common validation schemas defined
  - Unit tests pass
  - Biome passes
- **Reviewer:** Core

### FND-010
**Module Skeleton: All API Modules**

- **Description:** Create the directory structure and placeholder files for all 11 API modules following the Clean Architecture template from ARCH-009.
- **Lane:** Core
- **Priority:** Medium
- **Dependencies:** ARCH-009
- **Deliverable:** Module skeleton directories with placeholder README files
- **Acceptance Criteria:**
  - All 11 module directories created
  - Each module has `domain/`, `application/`, `infrastructure/`, `presentation/`
  - Placeholder README in each module
  - Import boundaries enforced
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- FND-001 through FND-005 (independent schema migrations)
- FND-007 and FND-008 (independent shared packages)
- FND-009 and FND-010 (independent infrastructure)

**Must happen sequentially:**
- FND-006 depends on FND-001 (needs `sub_departments` table)
- All migration tasks must complete before feature development

---

## Deliverables

1. Database migrations for all domain entities
2. `packages/domain` with calculation engine interfaces
3. `packages/permissions` with RBAC constants
4. `packages/validation` with shared Zod schemas
5. Module skeleton structure for all API modules
6. Seed script for sub-departments

---

## Exit Criteria

- [ ] All database migrations run cleanly on test database
- [ ] `packages/domain` compiles and passes unit tests
- [ ] `packages/permissions` compiles and passes unit tests
- [ ] `packages/validation` compiles and passes unit tests
- [ ] 5 sub-departments seeded successfully
- [ ] Module skeleton structure created for all 11 modules
- [ ] CI passes with all new packages
- [ ] `pnpm prepare` passes
