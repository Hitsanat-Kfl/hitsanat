# Core Tasks — Abrham

## Role: Core / Overall Lead + Backend Developer
**Total Tasks:** 58

---

# Phase 0 — Architecture & Planning

---

## CORE-001 — Database Schema Contract: Identity & Membership

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-00-architecture-planning.md`
- Original item: ARCH-001

### 3. Primary Owner
- **Name:** Abrham
- **Role:** Core / Overall Lead + Backend Developer
- **Lane:** Core

### 4. Supporting Contributors
None

### 5. Task Objective
Define Drizzle schema contracts for `members`, `sub_departments`, `sub_department_members`, `families`, `family_members` tables with all column types, constraints, indexes, and relationships.

### 6. Why This Task Exists
Every subsequent phase depends on these schema contracts being defined before any code is written. This establishes the data model foundation.

### 7. Documentation References

#### Requirements
- `docs/database/entities.md` — Section 1.1–1.5: Complete table specifications
- `docs/requirements/functional-requirements.md` — FR-01.1 through FR-03.2
- `docs/requirements/business-rules.md` — BR-001 through BR-006

#### Architecture
- `docs/architecture/data-architecture.md` — Relational modeling principles
- `docs/architecture/system-architecture.md` — Monorepo structure

#### ADR
- `docs/adr/ADR-0005.md` — Scoped RBAC via Dedicated Join Tables

### 8. Repository References

#### Files/Directories to Read
- `packages/database/src/schema/index.ts` — Current schema (1 table)
- `docs/database/entities.md` — Target schema (190 lines)
- `docs/database/relationships.md` — ERD
- `docs/database/constraints.md` — Check constraints

#### Files/Directories Expected to Change
- `packages/database/src/schema/index.ts` — MODIFY (add 5 table schemas)

### 9. Related Code
- Existing: `packages/database/src/schema/index.ts` (systemMetadata table)
- Reference: `docs/database/entities.md` (full schema specs)

### 10. Expected Implementation
Define Drizzle `pgTable` schemas for: `members`, `sub_departments`, `sub_department_members`, `families`, `family_members`. Include UUID PKs, foreign keys with ON DELETE actions, check constraints, unique constraints, and indexes.

### 11. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `packages/database/src/schema/index.ts` | MODIFY | Add 5 table schemas |

### 12. Documentation Updates
- Verify `docs/database/entities.md` matches implementation

### 13. Testing Requirements
- Schema compiles without errors
- Migration generates cleanly

### 14. Acceptance Criteria
- [ ] 5 tables fully specified with all columns
- [ ] Foreign key relationships defined
- [ ] Check constraints documented
- [ ] Unique constraints documented
- [ ] Indexes specified

### 15. Definition of Done
- [ ] Implementation complete
- [ ] TypeScript compiles
- [ ] Biome passes
- [ ] PR created
- [ ] `pnpm prepare` passes

### 16. Reviewer
Abrham (self-review)

### 17. Git Branch
`feature/core-001-schema-identity-membership`

---

## CORE-002 — Database Schema Contract: Beneficiaries & Parents

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-00-architecture-planning.md`
- Original item: ARCH-002

### 3. Primary Owner
- **Name:** Abrham
- **Role:** Core / Overall Lead + Backend Developer
- **Lane:** Core

### 4. Supporting Contributors
None

### 5. Task Objective
Define Drizzle schema contracts for `children`, `parents`, `child_parents` tables including the composite unique constraint `(child_id, relation)` for parent cardinality.

### 6. Why This Task Exists
Children and parent management requires strict cardinality enforcement (max 1 Father, 1 Mother per child). The schema must enforce BR-010 at the database level.

### 7. Documentation References

#### Requirements
- `docs/database/entities.md` — Section 2.1–2.3
- `docs/requirements/functional-requirements.md` — FR-04.1 through FR-05.3
- `docs/requirements/business-rules.md` — BR-010, BR-011, BR-012, BR-013

#### ADR
- `docs/adr/ADR-0001.md` — Separate Assignment/Attendance Tables

### 8. Repository References

#### Files/Directories to Read
- `packages/database/src/schema/index.ts`
- `docs/database/entities.md` — Section 2
- `docs/database/constraints.md` — Composite unique constraints

#### Files/Directories Expected to Change
- `packages/database/src/schema/index.ts` — MODIFY (add 3 table schemas)

### 9. Expected Implementation
Define Drizzle schemas for `children` (with Kutr group and collection location check constraints), `parents`, and `child_parents` (with UNIQUE(child_id, relation) constraint).

### 10. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `packages/database/src/schema/index.ts` | MODIFY | Add 3 table schemas |

### 11. Acceptance Criteria
- [ ] 3 tables fully specified
- [ ] Parent cardinality constraint (child_id, relation) UNIQUE
- [ ] Kutr group check constraint defined
- [ ] Collection location check constraint defined

### 12. Definition of Done
- [ ] Implementation complete
- [ ] TypeScript compiles
- [ ] Biome passes
- [ ] PR created
- [ ] `pnpm prepare` passes

### 13. Reviewer
Abrham (self-review)

### 14. Git Branch
`feature/core-002-schema-beneficiaries-parents`

---

## CORE-003 — Database Schema Contract: Planning

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Define Drizzle schema contracts for 6 planning tables: `annual_master_plans`, `plan_goals`, `plan_activities`, `plan_distributions`, `weekly_plans`, `plan_progress_records`.

### 5. Why This Task Exists
The planning system is the most complex module. Schema contracts must be defined before the weight calculation engine can be implemented.

### 6. Documentation References
- `docs/database/entities.md` — Section 3
- `docs/planning/annual-master-plan.md` — Planning structure
- `docs/requirements/functional-requirements.md` — FR-08.1 through FR-08.5
- `docs/requirements/business-rules.md` — BR-030, BR-031, BR-032

### 7. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `docs/database/entities.md` — Section 3

### 8. Acceptance Criteria
- [ ] 6 tables fully specified
- [ ] Weight fields documented (NUMERIC(6,4))
- [ ] Quarterly distribution columns defined
- [ ] Progress roll-up fields specified

### 9. Git Branch
`feature/core-003-schema-planning`

---

## CORE-004 — Database Schema Contract: Attendance & Events

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Define Drizzle schema contracts for attendance and event tables, ensuring separate attendance tables per ADR-0001.

### 5. Why This Task Exists
ADR-0001 requires separate attendance tables for regular sessions vs events. This must be established at the schema level.

### 6. Documentation References
- `docs/database/entities.md` — Section 4
- `docs/adr/ADR-0001.md` — Separate Attendance Tables
- `docs/adr/ADR-0002.md` — Auto-Seeded Attendance
- `docs/requirements/business-rules.md` — BR-020, BR-021

### 7. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `docs/database/entities.md` — Section 4

### 8. Acceptance Criteria
- [ ] Separate attendance tables per ADR-0001
- [ ] Auto-seeding fields per ADR-0002
- [ ] Multi-member assignment constraint (≥2 members)
- [ ] Session type check constraints

### 9. Git Branch
`feature/core-004-schema-attendance-events`

---

## CORE-005 — Database Schema Contract: Academic & Announcements

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-005

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Define Drizzle schema contracts for `academic_assessments`, `student_scores`, `announcements`, `audit_logs`.

### 5. Documentation References
- `docs/database/entities.md` — Section 5
- `docs/requirements/functional-requirements.md` — FR-07.1 through FR-07.3, FR-11.1 through FR-11.3

### 6. Repository References
- `packages/database/src/schema/index.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] 4 tables fully specified
- [ ] Assessment type check constraint defined
- [ ] Audit log JSONB payload field documented

### 8. Git Branch
`feature/core-005-schema-academic-announcements`

---

## CORE-006 — API Contract Specification: All Modules

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-006

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Define or verify OpenAPI 3.1 specifications for all 12 module endpoint groups.

### 5. Why This Task Exists
API contracts must be defined before frontend integration. All lanes consume these contracts.

### 6. Documentation References
- `docs/api/endpoints.md` — Full endpoint catalog
- `docs/api/openapi.md` — Zod-to-OpenAPI generation
- `docs/api/swagger.md` — Swagger UI setup

### 7. Repository References
- `apps/api/src/infrastructure/swagger.ts` — Existing OpenAPI spec
- `docs/api/endpoints.md` — Endpoint definitions

### 8. Acceptance Criteria
- [ ] All endpoints from `docs/api/endpoints.md` have OpenAPI specs
- [ ] Request/response schemas defined
- [ ] Error response schemas defined
- [ ] Authentication requirements documented per endpoint
- [ ] Authorization scopes documented per endpoint

### 9. Git Branch
`feature/core-006-api-contracts-all-modules`

---

## CORE-007 — Shared Domain Package Interface

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-007

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Define the interface for `packages/domain` — core business entities, value objects, and calculation engines.

### 5. Documentation References
- `docs/architecture/domain-model.md` — Ubiquitous language, Aggregates
- `docs/planning/annual-master-plan.md` — Weight formula
- `docs/planning/progress-tracking.md` — Roll-up formulas

### 6. Repository References
- NEW FILE: `packages/domain/` — CREATE package structure
- `docs/architecture/domain-model.md` — Domain model reference

### 7. Acceptance Criteria
- [ ] Planning weight engine interface defined
- [ ] Progress roll-up engine interface defined
- [ ] Domain entity interfaces defined
- [ ] Value object interfaces defined

### 8. Git Branch
`feature/core-007-domain-package-interface`

---

## CORE-008 — Shared Permissions Package Interface

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-008

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Define the interface for `packages/permissions` — RBAC matrices, permission constants, scope evaluation helpers.

### 5. Documentation References
- `docs/requirements/roles-and-permissions.md` — Full RBAC matrix
- `docs/architecture/security-architecture.md` — Security design
- `docs/adr/ADR-0005.md` — Scoped RBAC
- `docs/adr/ADR-0007.md` — Regular Members Restricted

### 6. Repository References
- NEW FILE: `packages/permissions/` — CREATE package structure
- `docs/requirements/roles-and-permissions.md` — Permission matrix

### 7. Acceptance Criteria
- [ ] Role taxonomy constants defined
- [ ] Permission matrix mapped to code constants
- [ ] Scope evaluation helper interface defined
- [ ] Guard middleware interface defined

### 8. Git Branch
`feature/core-008-permissions-package-interface`

---

## CORE-009 — Module Structure Template

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-009

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create the template directory structure for API modules following Clean Architecture.

### 5. Documentation References
- `docs/architecture/module-architecture.md` — Module structure
- `docs/backend/architecture.md` — DDD layers
- `docs/backend/modules.md` — Module boundaries

### 6. Repository References
- `apps/api/src/modules/README.md` — MODIFY (update with template)
- `apps/api/src/modules/` — Existing placeholder

### 7. Acceptance Criteria
- [ ] Template directory structure documented
- [ ] Standard file naming conventions defined
- [ ] Import boundary rules documented
- [ ] Example module skeleton provided

### 8. Git Branch
`feature/core-009-module-structure-template`

---

## CORE-010 — Testing Infrastructure Validation

### 1. Phase
Phase 0 — Architecture & Planning

### 2. Source Implementation Plan
- Original item: ARCH-010

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Verify that the testing infrastructure works correctly with the current monorepo structure.

### 5. Documentation References
- `docs/testing/strategy.md` — Testing strategy
- `docs/testing/unit.md` — Unit testing
- `docs/testing/integration.md` — Integration testing
- `docs/testing/e2e.md` — E2E testing

### 6. Repository References
- `vitest.config.ts` — Root Vitest config
- `playwright.config.ts` — Playwright config
- `tests/` — Test directories
- `apps/api/tests/` — API tests
- `apps/admin/tests/` — Admin tests
- `apps/portfolio/tests/` — Portfolio tests

### 7. Acceptance Criteria
- [ ] Unit tests pass
- [ ] Integration tests pass (with test PostgreSQL)
- [ ] E2E smoke tests pass
- [ ] Accessibility tests pass
- [ ] CI pipeline runs successfully

### 8. Git Branch
`feature/core-010-testing-infrastructure`

---

# Phase 1 — Engineering Foundation

---

## CORE-011 — DB Migration: Identity & Membership Tables

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create Drizzle schemas and generate migrations for `members`, `sub_departments`, `sub_department_members`, `families`, `family_members`.

### 5. Why This Task Exists
Schema contracts from Phase 0 must be converted into actual database migrations that can be applied to PostgreSQL.

### 6. Documentation References
- `docs/database/entities.md` — Section 1
- `docs/database/migrations.md` — Migration strategy
- `docs/database/design.md` — PostgreSQL principles

### 7. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `packages/database/src/migrations/` — CREATE migration files
- `packages/database/drizzle.config.ts` — Drizzle Kit config

### 8. Related Code
- Existing: `packages/database/src/schema/index.ts`
- Config: `packages/database/drizzle.config.ts`

### 9. Acceptance Criteria
- [ ] 5 tables created in migration
- [ ] All constraints applied
- [ ] Migration runs cleanly on test database
- [ ] Integration test verifies table creation

### 10. Git Branch
`feature/core-011-migration-identity-membership`

---

## CORE-012 — DB Migration: Beneficiary & Parent Tables

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create Drizzle schemas and generate migrations for `children`, `parents`, `child_parents`.

### 5. Documentation References
- `docs/database/entities.md` — Section 2
- `docs/database/constraints.md` — Parent cardinality constraint

### 6. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `packages/database/src/migrations/` — CREATE

### 7. Acceptance Criteria
- [ ] 3 tables created in migration
- [ ] Parent cardinality constraint enforced (UNIQUE child_id, relation)
- [ ] Kutr group check constraint applied
- [ ] Collection location check constraint applied

### 8. Git Branch
`feature/core-012-migration-beneficiaries-parents`

---

## CORE-013 — DB Migration: Planning Tables

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create Drizzle schemas and generate migrations for 6 planning tables.

### 5. Documentation References
- `docs/database/entities.md` — Section 3
- `docs/planning/annual-master-plan.md` — Planning structure

### 6. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `packages/database/src/migrations/` — CREATE

### 7. Acceptance Criteria
- [ ] 6 tables created in migration
- [ ] Weight calculation fields included
- [ ] Quarterly distribution columns defined
- [ ] Progress roll-up fields specified

### 8. Git Branch
`feature/core-013-migration-planning`

---

## CORE-014 — DB Migration: Attendance & Event Tables

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create Drizzle schemas and generate migrations for attendance and event tables.

### 5. Documentation References
- `docs/database/entities.md` — Section 4
- `docs/adr/ADR-0001.md` — Separate attendance tables

### 6. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `packages/database/src/migrations/` — CREATE

### 7. Acceptance Criteria
- [ ] Separate attendance tables per ADR-0001
- [ ] Auto-seeding fields included
- [ ] Session type constraints applied

### 8. Git Branch
`feature/core-014-migration-attendance-events`

---

## CORE-015 — DB Migration: Academic & Announcement Tables

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-005

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create Drizzle schemas and generate migrations for `academic_assessments`, `student_scores`, `announcements`, `audit_logs`.

### 5. Documentation References
- `docs/database/entities.md` — Section 5

### 6. Repository References
- `packages/database/src/schema/index.ts` — MODIFY
- `packages/database/src/migrations/` — CREATE

### 7. Acceptance Criteria
- [ ] 4 tables created in migration
- [ ] Assessment type check constraint applied
- [ ] Audit log JSONB field included

### 8. Git Branch
`feature/core-015-migration-academic-announcements`

---

## CORE-016 — Shared Package: packages/domain

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-007

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Implement `packages/domain` with core business entities, value objects, and calculation engine interfaces.

### 5. Documentation References
- `docs/architecture/domain-model.md` — Domain model
- `docs/planning/annual-master-plan.md` — Weight formula
- `docs/planning/progress-tracking.md` — Roll-up formulas

### 6. Repository References
- NEW FILE: `packages/domain/` — CREATE full package
- `packages/domain/package.json` — CREATE
- `packages/domain/tsconfig.json` — CREATE
- `packages/domain/src/index.ts` — CREATE

### 7. Acceptance Criteria
- [ ] Package compiles without errors
- [ ] Planning weight engine interface defined
- [ ] Progress roll-up engine interface defined
- [ ] Unit tests pass
- [ ] Biome passes

### 8. Git Branch
`feature/core-016-domain-package`

---

## CORE-017 — Shared Package: packages/permissions

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-008

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Implement `packages/permissions` with RBAC constants, role taxonomy, permission matrix, and scope evaluation helpers.

### 5. Documentation References
- `docs/requirements/roles-and-permissions.md` — RBAC matrix
- `docs/adr/ADR-0005.md` — Scoped RBAC
- `docs/adr/ADR-0007.md` — Regular Members Restricted

### 6. Repository References
- NEW FILE: `packages/permissions/` — CREATE full package
- `docs/requirements/roles-and-permissions.md` — Permission matrix

### 7. Acceptance Criteria
- [ ] Role constants defined (SUPER_ADMIN, CHAIRPERSON, etc.)
- [ ] Permission matrix implemented
- [ ] Scope evaluation helper functional
- [ ] Unit tests pass
- [ ] Biome passes

### 8. Git Branch
`feature/core-017-permissions-package`

---

## CORE-018 — Module Skeleton: All API Modules

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Original item: FND-010

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create the directory structure and placeholder files for all 11 API modules.

### 5. Documentation References
- `docs/architecture/module-architecture.md` — Module structure
- `docs/backend/modules.md` — Module boundaries

### 6. Repository References
- `apps/api/src/modules/` — CREATE 11 module directories
- `apps/api/src/modules/README.md` — MODIFY

### 7. Acceptance Criteria
- [ ] All 11 module directories created
- [ ] Each module has `domain/`, `application/`, `infrastructure/`, `presentation/`
- [ ] Placeholder README in each module
- [ ] Import boundaries enforced

### 8. Git Branch
`feature/core-018-module-skeleton`

---

# Phase 2 — Authentication & Authorization

---

## CORE-019 — Better Auth Configuration

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Original item: AUTH-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Configure Better Auth in `packages/auth` with PostgreSQL adapter, session cookies, and email/password provider.

### 5. Why This Task Exists
Authentication is the gateway to all protected features. This must be implemented before any admin functionality.

### 6. Documentation References
- `docs/architecture/security-architecture.md` — Auth design
- `docs/backend/authentication.md` — Better Auth setup
- `docs/api/authentication.md` — Auth endpoints
- `docs/adr/ADR-0007.md` — Regular Members Restricted

### 7. Repository References
- NEW FILE: `packages/auth/` — CREATE
- `packages/auth/package.json` — CREATE
- `packages/auth/src/index.ts` — CREATE
- `apps/api/src/config/env.ts` — READ (environment vars)

### 8. Acceptance Criteria
- [ ] Better Auth configured with PostgreSQL adapter
- [ ] Session cookies configured (httpOnly, secure, sameSite)
- [ ] Auth tables created (users, sessions, accounts)
- [ ] Unit tests pass

### 9. Git Branch
`feature/core-019-better-auth-configuration`

---

## CORE-020 — Auth Database Tables

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Original item: AUTH-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Create Drizzle schemas and migrations for Better Auth tables: `users`, `sessions`, `accounts`, `verification_tokens`.

### 5. Documentation References
- `docs/backend/authentication.md` — Auth table requirements

### 6. Repository References
- `packages/database/src/schema/index.ts` — MODIFY (add auth tables)
- `packages/database/src/migrations/` — CREATE

### 7. Acceptance Criteria
- [ ] Auth tables created in migration
- [ ] Role field included on users table
- [ ] Session table has proper indexes
- [ ] Migration runs cleanly

### 8. Git Branch
`feature/core-020-auth-database-tables`

---

## CORE-021 — Scoped RBAC Middleware

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Original item: AUTH-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Implement `requireAuth()` and `requireScopePermission(resource, action, subDeptScope?)` middleware.

### 5. Why This Task Exists
RBAC is the security backbone. Every protected endpoint depends on these middleware functions.

### 6. Documentation References
- `docs/requirements/roles-and-permissions.md` — Permission matrix
- `docs/api/authorization.md` — Guard implementation
- `docs/architecture/security-architecture.md` — Security design
- `docs/adr/ADR-0005.md` — Scoped RBAC
- `docs/adr/ADR-0007.md` — Regular Members Restricted
- `docs/requirements/business-rules.md` — BR-033

### 7. Repository References
- NEW FILE: `apps/api/src/shared/middleware/auth.ts` — CREATE
- NEW FILE: `apps/api/src/shared/middleware/rbac.ts` — CREATE
- `packages/permissions/src/index.ts` — READ

### 8. Acceptance Criteria
- [ ] `requireAuth()` validates session cookies
- [ ] `requireScopePermission()` checks global roles first
- [ ] Falls back to sub-department scoped roles
- [ ] Returns HTTP 403 with `FORBIDDEN_INSUFFICIENT_SCOPE` on failure
- [ ] Non-leadership members denied access (ADR-0007, BR-033)
- [ ] Unit tests cover all permission scenarios

### 9. Git Branch
`feature/core-021-scoped-rbac-middleware`

---

## CORE-022 — Auth API Endpoints

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Original item: AUTH-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement auth endpoints: sign-in, sign-up, sign-out, session.

### 5. Documentation References
- `docs/api/authentication.md` — Auth endpoint specs
- `docs/api/endpoints.md` — Endpoint catalog

### 6. Repository References
- NEW FILE: `apps/api/src/modules/auth/presentation/auth.router.ts` — CREATE
- NEW FILE: `apps/api/src/modules/auth/application/sign-in.use-case.ts` — CREATE
- `apps/api/src/app.ts` — MODIFY (register auth routes)

### 7. Acceptance Criteria
- [ ] Sign-in creates session cookie
- [ ] Sign-up creates user account
- [ ] Sign-out invalidates session
- [ ] Session endpoint returns current user with roles
- [ ] Integration tests verify all flows

### 8. Git Branch
`feature/core-022-auth-api-endpoints`

---

# Phase 3 — Organization Structure

---

## CORE-023 — Member API: Stage 1 Registration

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement `POST /api/v1/members/stage-1` endpoint for Secretary member creation.

### 5. Why This Task Exists
Member registration is the entry point for all organization data. Stage 1 creates the minimal record.

### 6. Documentation References
- `docs/api/endpoints.md` — Members endpoint
- `docs/requirements/functional-requirements.md` — FR-01.1
- `docs/requirements/business-rules.md` — BR-001

### 7. Repository References
- NEW FILE: `apps/api/src/modules/members/presentation/members.router.ts` — CREATE
- NEW FILE: `apps/api/src/modules/members/application/create-member.use-case.ts` — CREATE
- NEW FILE: `apps/api/src/modules/members/infrastructure/member.repository.ts` — CREATE
- `apps/api/src/app.ts` — MODIFY

### 8. Acceptance Criteria
- [ ] Endpoint creates member with Stage 1 fields only
- [ ] Phone number uniqueness enforced
- [ ] Zod validation on all required fields
- [ ] Returns created member with UUID
- [ ] Integration test verifies creation

### 9. Git Branch
`feature/core-023-member-stage1-registration`

---

## CORE-024 — Member API: Stage 2 Enrichment

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement `PUT /api/v1/members/:id/stage-2` endpoint for sub-department and family assignment.

### 5. Documentation References
- `docs/api/endpoints.md` — Members endpoint
- `docs/requirements/functional-requirements.md` — FR-01.1, FR-01.2
- `docs/requirements/business-rules.md` — BR-002

### 6. Repository References
- `apps/api/src/modules/members/` — MODIFY (add stage-2)

### 7. Acceptance Criteria
- [ ] Endpoint updates member with Stage 2 fields
- [ ] Sub-department assignment creates `sub_department_members` records
- [ ] Family allocation creates `family_members` record
- [ ] Photo URL stored
- [ ] Telegram username stored

### 8. Git Branch
`feature/core-024-member-stage2-enrichment`

---

## CORE-025 — Family API: CRUD & Parent Assignment

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement family endpoints with Father/Mother assignment enforcement (BR-004).

### 5. Documentation References
- `docs/api/endpoints.md` — Families endpoint
- `docs/requirements/functional-requirements.md` — FR-02.1 through FR-02.4
- `docs/requirements/business-rules.md` — BR-004, BR-005

### 6. Repository References
- NEW FILE: `apps/api/src/modules/families/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Family creation with name and academic year
- [ ] Father assignment (male member, max 1)
- [ ] Mother assignment (female member, max 1)
- [ ] Member allocation to family
- [ ] Family roster retrieval
- [ ] Integration tests verify BR-004 constraint

### 8. Git Branch
`feature/core-025-family-crud`

---

# Phase 4 — Member Management

---

## CORE-026 — Child API: Registration & CRUD

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement child endpoints with Kutr group and collection location constraints.

### 5. Documentation References
- `docs/api/endpoints.md` — Children endpoint
- `docs/requirements/functional-requirements.md` — FR-04.1 through FR-04.4
- `docs/requirements/business-rules.md` — BR-012, BR-013

### 6. Repository References
- NEW FILE: `apps/api/src/modules/children/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Child registration with all fields (FR-04.1)
- [ ] Kutr group constrained to 'Kutr 1' or 'Kutr 2' (BR-012)
- [ ] Collection location constrained to 5 routes (BR-013)
- [ ] Birthday month query available
- [ ] Reclassification endpoint works
- [ ] Integration tests verify constraints

### 8. Git Branch
`feature/core-026-child-crud`

---

## CORE-027 — Child-Parent Linking API

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement child-parent linking with strict cardinality enforcement (BR-010).

### 5. Documentation References
- `docs/api/endpoints.md` — Child-parents endpoint
- `docs/requirements/business-rules.md` — BR-010, BR-011

### 6. Repository References
- `apps/api/src/modules/children/` — MODIFY (add parent linking)

### 7. Acceptance Criteria
- [ ] Link parent to child with relation type (Father/Mother)
- [ ] Composite unique constraint enforced (BR-010)
- [ ] Cannot add duplicate Father or Mother
- [ ] Sibling association works
- [ ] Unlink parent from child
- [ ] Integration tests verify cardinality constraint

### 8. Git Branch
`feature/core-027-child-parent-linking`

---

# Phase 5 — Planning

---

## CORE-028 — Planning Domain: Weight Calculation Engine

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Implement the 3-factor weight calculation engine in `packages/domain`.

### 5. Why This Task Exists
The weight formula is the mathematical foundation of the entire planning system. It must be implemented and verified against the Action PLN.xlsx baseline.

### 6. Documentation References
- `docs/planning/annual-master-plan.md` — Weight formula
- `docs/requirements/functional-requirements.md` — FR-08.3
- `docs/requirements/business-rules.md` — BR-030

### 7. Repository References
- `packages/domain/src/` — MODIFY (add weight engine)
- `docs/planning/annual-master-plan.md` — Baseline data (25 activities)

### 8. Acceptance Criteria
- [ ] Weight formula implemented exactly per FR-08.3
- [ ] Sum of all weights = 100.00%
- [ ] Handles edge cases (zero budget, zero people, zero time)
- [ ] Unit tests cover all 25 master activities
- [ ] Matches baseline totals (Budget: 3500, People: 112, Time: 45)

### 9. Git Branch
`feature/core-028-weight-calculation-engine`

---

## CORE-029 — Planning Domain: Progress Roll-Up Engine

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Implement the bottom-up progress roll-up engine (Weekly → Monthly → Quarterly → Annual).

### 5. Documentation References
- `docs/planning/progress-tracking.md` — Roll-up formulas
- `docs/requirements/business-rules.md` — BR-032

### 6. Repository References
- `packages/domain/src/` — MODIFY (add roll-up engine)

### 7. Acceptance Criteria
- [ ] Weekly progress aggregates to monthly
- [ ] Monthly aggregates to quarterly
- [ ] Quarterly aggregates to annual
- [ ] Weighted contribution calculated correctly
- [ ] Unit tests verify aggregation math

### 8. Git Branch
`feature/core-029-progress-rollup-engine`

---

## CORE-030 — Planning API: Annual Master Plan

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement annual plan CRUD with goal and activity management.

### 5. Documentation References
- `docs/api/endpoints.md` — Planning endpoint
- `docs/planning/annual-master-plan.md` — Plan structure

### 6. Repository References
- NEW FILE: `apps/api/src/modules/planning/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Annual plan creation with goals and activities
- [ ] Activity weight auto-calculated via engine
- [ ] Plan status lifecycle (Draft → Distributed → Active → Completed → Archived)
- [ ] RBAC: Ekd creates, Chairperson approves

### 8. Git Branch
`feature/core-030-annual-plan-api`

---

## CORE-031 — Planning API: Plan Distribution

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement plan distribution to sub-departments per BR-031.

### 5. Documentation References
- `docs/planning/plan-distribution.md` — Distribution workflow
- `docs/requirements/business-rules.md` — BR-031

### 6. Repository References
- `apps/api/src/modules/planning/` — MODIFY

### 7. Acceptance Criteria
- [ ] Activity distributed to one or more sub-departments
- [ ] Distribution creates `plan_distributions` records
- [ ] Sub-departments cannot create independent plans (BR-031)
- [ ] Status tracking (Assigned → In_Progress → Completed)

### 8. Git Branch
`feature/core-031-plan-distribution`

---

## CORE-032 — Planning API: Weekly Plans & Progress

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-005

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement weekly execution items and progress recording.

### 5. Documentation References
- `docs/planning/weekly-planning.md` — Weekly planning
- `docs/planning/progress-tracking.md` — Progress recording

### 6. Repository References
- `apps/api/src/modules/planning/` — MODIFY

### 7. Acceptance Criteria
- [ ] Weekly plan creation from distribution
- [ ] Progress recording with actual results
- [ ] Roll-up triggered on progress submission
- [ ] Status updates flow upward (BR-032)

### 8. Git Branch
`feature/core-032-weekly-plans-progress`

---

# Phase 6 — Operational Tracking

---

## CORE-033 — Attendance API: Session Management

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement program session creation and listing.

### 5. Documentation References
- `docs/api/endpoints.md` — Attendance endpoint
- `docs/requirements/functional-requirements.md` — FR-06.1

### 6. Repository References
- NEW FILE: `apps/api/src/modules/attendance/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Session creation with type, date, time
- [ ] Session list with filtering
- [ ] Session types constrained per FR-06.1
- [ ] RBAC enforced

### 8. Git Branch
`feature/core-033-session-management`

---

## CORE-034 — Attendance API: Auto-Seeding

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement attendance auto-seeding when members/children are assigned to sessions.

### 5. Why This Task Exists
ADR-0002 and BR-020 require automatic creation of Expected attendance rows. This is a core domain logic piece.

### 6. Documentation References
- `docs/adr/ADR-0002.md` — Auto-Seeded Attendance
- `docs/requirements/business-rules.md` — BR-020

### 7. Repository References
- `apps/api/src/modules/attendance/` — MODIFY

### 8. Acceptance Criteria
- [ ] Auto-creates `Expected` attendance rows for all assigned members/children
- [ ] Handles both member and child attendance (person_type)
- [ ] Idempotent (running twice doesn't duplicate)
- [ ] Integration test verifies auto-seeding

### 9. Git Branch
`feature/core-034-attendance-auto-seeding`

---

## CORE-035 — Attendance API: Verification & Batch Confirm

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement attendance verification and batch confirmation.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-06.3

### 6. Repository References
- `apps/api/src/modules/attendance/` — MODIFY

### 7. Acceptance Criteria
- [ ] Single record update (status, recorded_by, confirmed_at)
- [ ] Batch update for entire session
- [ ] Status constrained to Present/Absent/Excused
- [ ] RBAC: Kutitr leaders can update all, others limited

### 8. Git Branch
`feature/core-035-attendance-verification`

---

## CORE-036 — Transport Route Assignment API

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement transport route assignment with multi-member constraint.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-06.4
- `docs/requirements/business-rules.md` — BR-014, BR-022

### 6. Repository References
- `apps/api/src/modules/attendance/` — MODIFY

### 7. Acceptance Criteria
- [ ] Assign members to 5 collection routes
- [ ] Enforce ≥2 members per route (BR-014)
- [ ] RBAC: Kutitr exclusive authority (BR-022)

### 8. Git Branch
`feature/core-036-transport-route-assignment`

---

## CORE-037 — Event API: Creation & Program Assignment

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-006

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement event creation and sub-department program assignment.

### 5. Documentation References
- `docs/api/endpoints.md` — Events endpoint
- `docs/requirements/functional-requirements.md` — FR-09.1, FR-09.2, FR-09.3
- `docs/requirements/business-rules.md` — BR-014

### 6. Repository References
- NEW FILE: `apps/api/src/modules/events/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Event creation (name, type, date, published status)
- [ ] Program assignment to sub-departments
- [ ] ≥2 members per program (BR-014)
- [ ] Event types: Special, Extra_Training, Awdemerit, Adar

### 8. Git Branch
`feature/core-037-event-api`

---

# Phase 7 — Reporting & Dashboard

---

## CORE-038 — Report Domain: Aggregation Logic

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Implement report aggregation logic consolidating data from all modules.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-10.1, FR-10.2, FR-10.3

### 6. Repository References
- `packages/domain/src/` — MODIFY (add report aggregation)
- NEW FILE: `apps/api/src/modules/reports/` — CREATE

### 7. Acceptance Criteria
- [ ] Weekly, Monthly, Quarterly, Annual report aggregation
- [ ] Performance metrics calculation (planned vs actual)
- [ ] Unit tests verify aggregation accuracy

### 8. Git Branch
`feature/core-038-report-aggregation`

---

## CORE-039 — Report API: Generation & Retrieval

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement report generation and retrieval endpoints.

### 5. Documentation References
- `docs/api/endpoints.md` — Reports endpoint

### 6. Repository References
- `apps/api/src/modules/reports/` — MODIFY
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Report generation from sub-department data
- [ ] Report list with filtering by period and sub-department
- [ ] Report detail with full metrics
- [ ] RBAC: Ekd generates consolidated, others see own

### 8. Git Branch
`feature/core-039-report-api`

---

# Phase 8 — Portfolio & Public Features

---

## CORE-040 — Announcement API: CRUD & Publishing

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement announcement CRUD and publishing workflow.

### 5. Documentation References
- `docs/api/endpoints.md` — Announcements endpoint
- `docs/requirements/functional-requirements.md` — FR-11.1

### 6. Repository References
- NEW FILE: `apps/api/src/modules/announcements/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Announcement CRUD (title, content, target_audience)
- [ ] Target audience: Public, Members, Parents
- [ ] Publish endpoint sets is_published=true, published_at
- [ ] RBAC: Ekd and Chairperson can publish

### 8. Git Branch
`feature/core-040-announcement-api`

---

## CORE-041 — Public API: Stats & Events

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement public (no-auth) endpoints for stats and events.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-11.2, FR-11.3

### 6. Repository References
- NEW FILE: `apps/api/src/modules/public/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Public stats (active members, enrolled children, completed events)
- [ ] No PII exposed (FR-11.3)
- [ ] Published events with countdown data
- [ ] Published announcements
- [ ] No authentication required
- [ ] Rate limiting applied

### 8. Git Branch
`feature/core-041-public-api`

---

# Phase 9 — Hardening

---

## CORE-042 — Cross-Module Integration Test Suite

### 1. Phase
Phase 9 — Integration, Security & Hardening

### 2. Source Implementation Plan
- Original item: HRD-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Write comprehensive integration tests spanning multiple modules.

### 5. Documentation References
- `docs/testing/integration.md` — Integration testing strategy

### 6. Repository References
- `tests/integration/` — CREATE cross-module tests

### 7. Acceptance Criteria
- [ ] Member → family → child → attendance → planning → reports flow tested
- [ ] All RBAC boundaries verified
- [ ] All constraints enforced across modules

### 8. Git Branch
`feature/core-042-cross-module-integration`

---

## CORE-043 — Security Audit: Authentication & Authorization

### 1. Phase
Phase 9 — Hardening

### 2. Source Implementation Plan
- Original item: HRD-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Perform security audit on auth and RBAC systems.

### 5. Documentation References
- `docs/architecture/security-architecture.md` — Security design
- `docs/testing/security.md` — Security testing

### 6. Repository References
- All auth-related files
- All RBAC-related files

### 7. Acceptance Criteria
- [ ] Session cookies properly configured
- [ ] RBAC enforced on all protected endpoints
- [ ] Scope isolation verified
- [ ] No privilege escalation vectors found

### 8. Git Branch
`feature/core-043-security-audit-auth`

---

## CORE-044 — Security Audit: Data Protection

### 1. Phase
Phase 9 — Hardening

### 2. Source Implementation Plan
- Original item: HRD-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Verify PII protection across the system.

### 5. Documentation References
- `docs/architecture/security-architecture.md` — PII protection
- `docs/requirements/non-functional-requirements.md` — Security requirements

### 6. Repository References
- Public API responses
- Database schemas (PII fields)

### 7. Acceptance Criteria
- [ ] Public API returns no PII
- [ ] Sensitive data not logged
- [ ] Database connections use TLS
- [ ] No secrets in codebase

### 8. Git Branch
`feature/core-044-security-audit-data`

---

## CORE-045 — API Error Handling Standardization

### 1. Phase
Phase 9 — Hardening

### 2. Source Implementation Plan
- Original item: HRD-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Standardize error handling per RFC 7807.

### 5. Documentation References
- `docs/api/error-handling.md` — RFC 7807 taxonomy

### 6. Repository References
- `apps/api/src/shared/` — MODIFY (add error handler)

### 7. Acceptance Criteria
- [ ] All endpoints return RFC 7807 error format
- [ ] Error codes consistent across modules
- [ ] Validation errors return field-level details

### 8. Git Branch
`feature/core-045-error-handling`

---

## CORE-046 — Rate Limiting & Throttling

### 1. Phase
Phase 9 — Hardening

### 2. Source Implementation Plan
- Original item: HRD-005

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core + Backend

### 4. Task Objective
Implement rate limiting on public and sensitive endpoints.

### 5. Documentation References
- `docs/architecture/security-architecture.md` — Rate limiting

### 6. Repository References
- `apps/api/src/shared/middleware/` — CREATE rate limiter

### 7. Acceptance Criteria
- [ ] Public API endpoints rate-limited
- [ ] Auth endpoints rate-limited
- [ ] Rate limit headers returned

### 8. Git Branch
`feature/core-046-rate-limiting`

---

## CORE-047 — Code Quality Review

### 1. Phase
Phase 9 — Hardening

### 2. Source Implementation Plan
- Original item: HRD-009

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Full codebase review for Biome compliance and TypeScript strictness.

### 5. Documentation References
- `docs/development/coding-standards.md` — Coding standards

### 6. Repository References
- All source files

### 7. Acceptance Criteria
- [ ] Biome passes on all files
- [ ] TypeScript strict mode enforced
- [ ] Import boundaries respected

### 8. Git Branch
`feature/core-047-code-quality`

---

# Phase 10 — Deployment

---

## CORE-048 — Railway: API Service Deployment

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-001

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Deploy API to Railway with proper configuration.

### 5. Documentation References
- `docs/deployment/railway.md` — Railway deployment
- `docs/architecture/deployment-architecture.md` — Infrastructure topology

### 6. Repository References
- `docker/Dockerfile.api` — READ
- `apps/api/src/config/env.ts` — READ

### 7. Acceptance Criteria
- [ ] API builds successfully on Railway
- [ ] Health check endpoint responds
- [ ] Swagger UI accessible
- [ ] All environment variables configured

### 8. Git Branch
`feature/core-048-railway-api-deployment`

---

## CORE-049 — Railway: PostgreSQL Database

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-002

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Configure Railway-managed PostgreSQL.

### 5. Documentation References
- `docs/deployment/railway.md`
- `docs/database/design.md`

### 6. Repository References
- `packages/database/drizzle.config.ts` — READ

### 7. Acceptance Criteria
- [ ] PostgreSQL 15 running on Railway
- [ ] Connection via internal hostname
- [ ] TLS enabled
- [ ] All migrations applied

### 8. Git Branch
`feature/core-049-railway-postgres`

---

## CORE-050 — Railway: Telegram Bot Service

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-003

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Deploy Telegram worker to Railway.

### 5. Documentation References
- `docs/deployment/railway.md`
- `docs/open-decisions.md` — OD-01 (resolved: Railway)

### 6. Repository References
- NEW FILE: `apps/telegram/` — CREATE (or verify exists)

### 7. Acceptance Criteria
- [ ] Telegram service builds and starts
- [ ] Connects to PostgreSQL via private network
- [ ] Posts announcements to Telegram group

### 8. Git Branch
`feature/core-050-railway-telegram`

---

## CORE-051 — Vercel: Portfolio Deployment

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-004

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Deploy Portfolio to Vercel.

### 5. Documentation References
- `docs/deployment/vercel.md`
- `docs/architecture/deployment-architecture.md`

### 6. Repository References
- `apps/portfolio/next.config.ts` — READ
- `apps/portfolio/package.json` — READ

### 7. Acceptance Criteria
- [ ] Portfolio builds on Vercel
- [ ] Accessible at production URL
- [ ] API URL points to production API

### 8. Git Branch
`feature/core-051-vercel-portfolio`

---

## CORE-052 — Vercel: Admin Deployment

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-005

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Deploy Admin to Vercel.

### 5. Documentation References
- `docs/deployment/vercel.md`

### 6. Repository References
- `apps/admin/next.config.ts` — READ
- `apps/admin/package.json` — READ

### 7. Acceptance Criteria
- [ ] Admin builds on Vercel
- [ ] Accessible at production URL
- [ ] Auth callback URL configured

### 8. Git Branch
`feature/core-052-vercel-admin`

---

## CORE-053 — CORS & Security Configuration

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-006

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Configure CORS and security headers for production.

### 5. Documentation References
- `docs/architecture/security-architecture.md`

### 6. Repository References
- `apps/api/src/app.ts` — MODIFY (CORS config)
- `apps/api/src/config/env.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] CORS allows production frontend domains only
- [ ] Helmet security headers present
- [ ] HTTPS enforced

### 8. Git Branch
`feature/core-053-cors-security`

---

## CORE-054 — CI/CD Pipeline Verification

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-007

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Verify full CI/CD pipeline works end-to-end.

### 5. Documentation References
- `docs/ci-cd/github-actions.md`
- `.github/workflows/ci.yml`

### 6. Repository References
- `.github/workflows/ci.yml` — READ
- `turbo.json` — READ

### 7. Acceptance Criteria
- [ ] Push to main triggers CI
- [ ] CI passes
- [ ] Vercel auto-deploys on merge
- [ ] Railway deploys on merge

### 8. Git Branch
`feature/core-054-cicd-verification`

---

## CORE-055 — Domain & DNS Configuration

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-009

### 3. Primary Owner
- **Name:** Abrham
- **Lane:** Core

### 4. Task Objective
Configure custom domains and DNS.

### 5. Documentation References
- `docs/deployment/overview.md`

### 6. Repository References
- N/A (DNS configuration)

### 7. Acceptance Criteria
- [ ] `hitsanat.org` points to Vercel Portfolio
- [ ] `admin.hitsanat.org` points to Vercel Admin
- [ ] `api.hitsanat.org` points to Railway API
- [ ] SSL certificates active

### 8. Git Branch
`feature/core-055-domain-dns`
