# Backend Support Tasks — Israel

## Role: Backend Support
**Total Tasks:** 25

---

# Phase 1 — Engineering Foundation

---

## BES-001 — Seed Script: Sub-Departments

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-01-engineering-foundation.md`
- Original item: FND-006

### 3. Primary Owner
- **Name:** Israel
- **Role:** Backend Support
- **Lane:** Backend Support

### 4. Supporting Contributors
None

### 5. Task Objective
Create seed script to populate `sub_departments` with the 5 fixed departments.

### 6. Why This Task Exists
The 5 sub-departments are foundational data that all subsequent features depend on. They must be seeded before any sub-department functionality can be tested.

### 7. Documentation References

#### Requirements
- `docs/requirements/functional-requirements.md` — FR-03.1 (5 sub-departments)
- `docs/database/entities.md` — Section 1.2 (sub_departments table)

#### Architecture
- `docs/database/migrations.md` — Seed script strategy

### 8. Repository References

#### Files/Directories to Read
- `packages/database/src/schema/index.ts` — sub_departments schema
- `docs/database/entities.md` — Table specification
- `docs/database/migrations.md` — Seeding strategy

#### Files/Directories Expected to Change
- NEW FILE: `packages/database/src/seed/sub-departments.ts` — CREATE

### 9. Related Code
- Existing: `packages/database/src/schema/index.ts`
- Reference: `docs/requirements/functional-requirements.md` — FR-03.1

### 10. Expected Implementation
Create a seed script that inserts 5 rows into `sub_departments` with codes: TIMIHRT, MEZMUR, KUTITR, EKD, KINETIBEB. Include both Amharic and English names. Make idempotent using `ON CONFLICT DO NOTHING`.

### 11. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `packages/database/src/seed/sub-departments.ts` | CREATE | Seed script |

### 12. Documentation Updates
N/A — Documentation already exists

### 13. Testing Requirements
- Unit test: Verify 5 departments seeded correctly
- Integration test: Verify idempotency

### 14. Acceptance Criteria
- [ ] 5 sub-departments seeded
- [ ] Amharic names correct (ትምህርት, መዝሙር, ቁጥር, እቅድ, ቅንጥብጥብ)
- [ ] English names correct (Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb)
- [ ] Seed is idempotent (safe to run multiple times)

### 15. Definition of Done
- [ ] Implementation complete
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Biome passes
- [ ] TypeScript compiles
- [ ] PR created
- [ ] Abrham review completed
- [ ] `pnpm prepare` passes

### 16. Reviewer
Abrham (Core)

### 17. Git Branch
`feature/bes-001-seed-sub-departments`

---

## BES-002 — Shared Package: packages/validation

### 1. Phase
Phase 1 — Engineering Foundation

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-01-engineering-foundation.md`
- Original item: FND-009

### 3. Primary Owner
- **Name:** Israel
- **Role:** Backend Support
- **Lane:** Backend Support

### 4. Task Objective
Implement `packages/validation` with shared Zod schemas for common API request/response patterns.

### 5. Why This Task Exists
Shared validation schemas prevent duplication across API modules and ensure consistent request/response validation.

### 6. Documentation References

#### Requirements
- `docs/api/overview.md` — API conventions, standard envelope
- `docs/api/error-handling.md` — Error response format

#### Architecture
- `docs/architecture/system-architecture.md` — Package structure

### 7. Repository References

#### Files/Directories to Read
- `packages/schemas/src/` — Existing schemas
- `docs/api/overview.md` — API conventions

#### Files/Directories Expected to Change
- NEW FILE: `packages/validation/package.json` — CREATE
- NEW FILE: `packages/validation/src/index.ts` — CREATE
- NEW FILE: `packages/validation/src/pagination.ts` — CREATE
- NEW FILE: `packages/validation/src/error-response.ts` — CREATE

### 8. Related Code
- Existing: `packages/schemas/src/health.ts` — Pattern reference

### 9. Expected Implementation
Create Zod schemas for: pagination (page, limit, offset), error response (RFC 7807 format), common entity ID (UUID), date range, and standard API response envelope.

### 10. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `packages/validation/package.json` | CREATE | Package config |
| `packages/validation/tsconfig.json` | CREATE | TypeScript config |
| `packages/validation/src/index.ts` | CREATE | Exports |
| `packages/validation/src/pagination.ts` | CREATE | Pagination schemas |
| `packages/validation/src/error-response.ts` | CREATE | Error schemas |

### 11. Acceptance Criteria
- [ ] Common validation schemas defined
- [ ] Unit tests pass
- [ ] Biome passes
- [ ] Package compiles

### 12. Definition of Done
- [ ] Implementation complete
- [ ] Unit tests pass
- [ ] Biome passes
- [ ] TypeScript compiles
- [ ] PR created
- [ ] Abrham review completed
- [ ] `pnpm prepare` passes

### 13. Reviewer
Abrham (Core)

### 14. Git Branch
`feature/bes-002-validation-package`

---

# Phase 2 — Authentication & Authorization

---

## BES-003 — Auth Integration Tests

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-02-authentication-authorization.md`
- Original item: AUTH-007

### 3. Primary Owner
- **Name:** Israel
- **Role:** Backend Support
- **Lane:** Backend Support

### 4. Task Objective
Write comprehensive integration tests for the auth system.

### 5. Why This Task Exists
Auth is the security gateway. Comprehensive tests ensure no regression in authentication or authorization behavior.

### 6. Documentation References

#### Requirements
- `docs/requirements/roles-and-permissions.md` — RBAC matrix
- `docs/requirements/business-rules.md` — BR-033 (non-leader lockout)

#### Testing
- `docs/testing/integration.md` — Integration testing strategy
- `docs/testing/security.md` — Security testing

#### ADR
- `docs/adr/ADR-0007.md` — Regular Members Restricted

### 7. Repository References

#### Files/Directories to Read
- `apps/api/src/shared/middleware/auth.ts` — Auth middleware
- `apps/api/src/shared/middleware/rbac.ts` — RBAC middleware
- `apps/api/tests/` — Existing test patterns

#### Files/Directories Expected to Change
- NEW FILE: `apps/api/tests/integration/auth.integration.spec.ts` — CREATE

### 8. Related Code
- Reference: `apps/api/tests/health.test.ts` — Test pattern

### 9. Expected Implementation
Write integration tests covering: sign-in/sign-out flow, session persistence, role-based access (Chairperson sees all, Timihrt lead sees only Timihrt), scope isolation, non-leader lockout (ADR-0007).

### 10. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/api/tests/integration/auth.integration.spec.ts` | CREATE | Auth integration tests |

### 11. Acceptance Criteria
- [ ] Sign-in/sign-out flow tested
- [ ] Session persistence tested
- [ ] Role-based access tested
- [ ] Scope isolation tested (Timihrt lead cannot access Mezmur data)
- [ ] Non-leader lockout tested (ADR-0007)

### 12. Definition of Done
- [ ] Tests written
- [ ] All tests pass
- [ ] Biome passes
- [ ] PR created
- [ ] Abrham review completed
- [ ] `pnpm prepare` passes

### 13. Reviewer
Abrham (Core)

### 14. Git Branch
`feature/bes-003-auth-integration-tests`

---

## BES-004 — OpenAPI Auth Documentation

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Original item: AUTH-008

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI specification with auth endpoint documentation.

### 5. Documentation References
- `docs/api/swagger.md` — Swagger setup
- `docs/api/openapi.md` — OpenAPI generation

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY
- `apps/api/src/modules/auth/` — READ (auth endpoints)

### 7. Acceptance Criteria
- [ ] All auth endpoints documented
- [ ] Request/response schemas defined
- [ ] Error responses documented
- [ ] Security scheme defined

### 8. Git Branch
`feature/bes-004-openapi-auth`

---

# Phase 3 — Organization Structure

---

## BES-005 — Member API: List, Detail, Update

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-003

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement member list, detail, and update endpoints.

### 5. Documentation References
- `docs/api/endpoints.md` — Members endpoint
- `docs/requirements/functional-requirements.md` — FR-01.1 through FR-01.4
- `docs/requirements/business-rules.md` — BR-002, BR-003

### 6. Repository References
- `apps/api/src/modules/members/` — READ (stage-1, stage-2 patterns)
- `apps/api/src/modules/members/presentation/members.router.ts` — MODIFY

### 7. Related Code
- Existing: `apps/api/src/modules/members/` (CORE-023, CORE-024 patterns)

### 8. Acceptance Criteria
- [ ] List endpoint supports pagination, search, filtering
- [ ] Detail endpoint returns member with sub-departments and family
- [ ] Update endpoint modifies member fields
- [ ] RBAC enforced (Secretary can update all, leaders see own scope)

### 9. Definition of Done
- [ ] Implementation complete
- [ ] Integration tests pass
- [ ] Biome passes
- [ ] PR created
- [ ] Abrham review completed
- [ ] `pnpm prepare` passes

### 10. Reviewer
Abrham (Core)

### 11. Git Branch
`feature/bes-005-member-list-detail-update`

---

## BES-006 — Sub-Department API: List & Rosters

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-005

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement sub-department list and roster endpoints.

### 5. Documentation References
- `docs/api/endpoints.md` — Sub-departments endpoint
- `docs/requirements/functional-requirements.md` — FR-03.1, FR-03.2

### 6. Repository References
- NEW FILE: `apps/api/src/modules/sub-departments/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] List returns all 5 sub-departments
- [ ] Roster returns members with scoped roles
- [ ] Sub-department leaders see only own roster
- [ ] Chairperson sees all rosters

### 8. Git Branch
`feature/bes-006-subdepartment-list-rosters`

---

## BES-007 — Organization Integration Tests

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-008

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Write integration tests covering the full member lifecycle.

### 5. Documentation References
- `docs/testing/integration.md`
- `docs/requirements/business-rules.md` — BR-001 through BR-005

### 6. Repository References
- `apps/api/tests/integration/` — CREATE

### 7. Acceptance Criteria
- [ ] Full lifecycle tested (Stage 1 → Stage 2 → sub-dept → family)
- [ ] BR-001 (2-stage registration) verified
- [ ] BR-002 (multi-department) verified
- [ ] BR-004 (family constraints) verified
- [ ] BR-005 (dual family roles) verified

### 8. Git Branch
`feature/bes-007-organization-integration-tests`

---

## BES-008 — OpenAPI Organization Documentation

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-009

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI with member, family, and sub-department documentation.

### 5. Documentation References
- `docs/api/swagger.md`

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] All organization endpoints documented
- [ ] Request/response schemas defined
- [ ] Error responses documented

### 8. Git Branch
`feature/bes-008-openapi-organization`

---

# Phase 4 — Member Management

---

## BES-009 — Parent API: CRUD

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-002

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement parent CRUD endpoints.

### 5. Documentation References
- `docs/api/endpoints.md` — Parents endpoint
- `docs/requirements/functional-requirements.md` — FR-05.1, FR-05.2
- `docs/requirements/business-rules.md` — BR-011

### 6. Repository References
- NEW FILE: `apps/api/src/modules/parents/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Parent creation with contact details
- [ ] Parent list and detail retrieval
- [ ] Parent update
- [ ] Validation on required fields (BR-011)

### 8. Git Branch
`feature/bes-009-parent-crud`

---

## BES-010 — Children & Parents Integration Tests

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-007

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Write integration tests for child registration, parent linking, and cardinality constraints.

### 5. Documentation References
- `docs/testing/integration.md`
- `docs/requirements/business-rules.md` — BR-010, BR-011, BR-012, BR-013

### 6. Repository References
- `apps/api/tests/integration/` — CREATE

### 7. Acceptance Criteria
- [ ] Child registration tested
- [ ] Parent linking tested
- [ ] BR-010 cardinality constraint tested
- [ ] BR-012 Kutr classification tested
- [ ] BR-013 collection routes tested
- [ ] Sibling association tested

### 8. Git Branch
`feature/bes-010-children-parents-integration`

---

## BES-011 — OpenAPI Children & Parents Documentation

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-008

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI with children, parents, and child-parents documentation.

### 5. Documentation References
- `docs/api/swagger.md`

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] All children endpoints documented
- [ ] All parents endpoints documented
- [ ] Child-parents linking documented
- [ ] Error responses documented

### 8. Git Branch
`feature/bes-011-openapi-children-parents`

---

# Phase 5 — Planning

---

## BES-012 — Planning API: Plan Queries & Analytics

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-006

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement query endpoints for plan data.

### 5. Documentation References
- `docs/api/endpoints.md` — Planning endpoints
- `docs/planning/progress-tracking.md`

### 6. Repository References
- `apps/api/src/modules/planning/` — READ (existing patterns)
- `apps/api/src/modules/planning/presentation/planning.router.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Progress summary by goal
- [ ] Distribution status by sub-department
- [ ] Weight-adjusted completion metrics
- [ ] Quarterly breakdown available

### 8. Git Branch
`feature/bes-012-plan-queries-analytics`

---

## BES-013 — Planning Integration Tests

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-009

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Write integration tests covering the full planning lifecycle.

### 5. Documentation References
- `docs/testing/integration.md`
- `docs/requirements/business-rules.md` — BR-030, BR-031, BR-032

### 6. Repository References
- `apps/api/tests/integration/` — CREATE

### 7. Acceptance Criteria
- [ ] Full planning lifecycle tested
- [ ] BR-030 weight formula verified
- [ ] BR-031 distribution constraint verified
- [ ] BR-032 roll-up aggregation verified
- [ ] Weight sum = 100.00% verified

### 8. Git Branch
`feature/bes-013-planning-integration-tests`

---

## BES-014 — OpenAPI Planning Documentation

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-010

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI with planning endpoint documentation.

### 5. Documentation References
- `docs/api/swagger.md`

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] All planning endpoints documented
- [ ] Weight formula documented
- [ ] Roll-up logic documented
- [ ] Error responses documented

### 8. Git Branch
`feature/bes-014-openapi-planning`

---

# Phase 6 — Operational Tracking

---

## BES-015 — Academic Assessment API

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-005

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement academic assessment and scoring endpoints.

### 5. Documentation References
- `docs/api/endpoints.md` — Academic endpoint
- `docs/requirements/functional-requirements.md` — FR-07.1, FR-07.2, FR-07.3

### 6. Repository References
- NEW FILE: `apps/api/src/modules/academic-tracking/` — CREATE module
- `apps/api/src/app.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Assessment creation (type, subject, max_score, period)
- [ ] Score recording (child, score, recorded_by)
- [ ] Score query by assessment or child
- [ ] RBAC: Timihrt leaders manage assessments

### 8. Git Branch
`feature/bes-015-academic-assessment-api`

---

## BES-016 — Event Attendance API

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-007

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement event attendance recording (separate from regular attendance per ADR-0001).

### 5. Documentation References
- `docs/adr/ADR-0001.md` — Separate attendance tables
- `docs/api/endpoints.md` — Events endpoint

### 6. Repository References
- `apps/api/src/modules/events/` — READ (CORE-037 patterns)
- `apps/api/src/modules/events/presentation/events.router.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Event attendance creation
- [ ] Attendance status update
- [ ] Separate from regular session attendance (ADR-0001)
- [ ] RBAC enforced

### 8. Git Branch
`feature/bes-016-event-attendance-api`

---

## BES-017 — Operational Integration Tests

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-012

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Write integration tests for attendance lifecycle, transport, and events.

### 5. Documentation References
- `docs/testing/integration.md`
- `docs/requirements/business-rules.md` — BR-014, BR-020, BR-021, BR-022

### 6. Repository References
- `apps/api/tests/integration/` — CREATE

### 7. Acceptance Criteria
- [ ] Attendance lifecycle tested
- [ ] BR-020 auto-seeding verified
- [ ] BR-014 multi-member constraint verified
- [ ] BR-022 Kutitr authority verified
- [ ] ADR-0001 separate tables verified

### 8. Git Branch
`feature/bes-017-operational-integration-tests`

---

## BES-018 — OpenAPI Operations Documentation

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-013

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI with attendance, transport, academic, and event documentation.

### 5. Documentation References
- `docs/api/swagger.md`

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] All operational endpoints documented
- [ ] Auto-seeding behavior documented
- [ ] Multi-member constraint documented
- [ ] Error responses documented

### 8. Git Branch
`feature/bes-018-openapi-operations`

---

# Phase 7 — Reporting & Dashboard

---

## BES-019 — Report API: Sub-Department Submission

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-003

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Implement sub-department report submission endpoint.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-10.2
- `docs/api/endpoints.md` — Reports endpoint

### 6. Repository References
- `apps/api/src/modules/reports/` — READ (CORE-039 patterns)
- `apps/api/src/modules/reports/presentation/reports.router.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Sub-department submission with period, metrics, challenges
- [ ] Submission status tracking
- [ ] RBAC: Sub-department leaders submit own data
- [ ] Ekd reviews all submissions

### 8. Git Branch
`feature/bes-019-report-submission`

---

## BES-020 — Reporting Integration Tests

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-007

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Write integration tests for report generation, submission, and retrieval.

### 5. Documentation References
- `docs/testing/integration.md`

### 6. Repository References
- `apps/api/tests/integration/` — CREATE

### 7. Acceptance Criteria
- [ ] Report generation tested
- [ ] Sub-department submission tested
- [ ] Report retrieval tested
- [ ] RBAC enforced on all endpoints

### 8. Git Branch
`feature/bes-020-reporting-integration-tests`

---

## BES-021 — OpenAPI Reporting Documentation

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-008

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI with reporting endpoint documentation.

### 5. Documentation References
- `docs/api/swagger.md`

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] All reporting endpoints documented
- [ ] Report schema defined
- [ ] Error responses documented

### 8. Git Branch
`feature/bes-021-openapi-reporting`

---

# Phase 8 — Portfolio & Public Features

---

## BES-022 — Telegram Bot Service

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-003

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Create `apps/telegram` standalone worker service.

### 5. Documentation References
- `docs/architecture/system-architecture.md` — Telegram service
- `docs/open-decisions.md` — OD-01 (Railway)
- `docs/requirements/functional-requirements.md` — FR-12.1, FR-12.2

### 6. Repository References
- NEW FILE: `apps/telegram/` — CREATE service
- `docker/Dockerfile.telegram` — CREATE

### 7. Acceptance Criteria
- [ ] Standalone Node.js service
- [ ] Polls for published announcements
- [ ] Formats messages for Telegram
- [ ] Posts to Hitsanat Kifl Telegram group
- [ ] Handles connection errors gracefully
- [ ] Docker configuration for Railway

### 8. Git Branch
`feature/bes-022-telegram-bot-service`

---

## BES-023 — Portfolio Integration Tests

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-009

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Write integration tests for public API endpoints.

### 5. Documentation References
- `docs/testing/integration.md`

### 6. Repository References
- `apps/api/tests/integration/` — CREATE

### 7. Acceptance Criteria
- [ ] Public stats endpoint tested
- [ ] Public events endpoint tested
- [ ] Public announcements endpoint tested
- [ ] No PII in public responses verified
- [ ] Rate limiting tested

### 8. Git Branch
`feature/bes-023-portfolio-integration-tests`

---

## BES-024 — OpenAPI Public & Announcement Documentation

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-010

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update Swagger/OpenAPI with public and announcement endpoint documentation.

### 5. Documentation References
- `docs/api/swagger.md`

### 6. Repository References
- `apps/api/src/infrastructure/swagger.ts` — MODIFY

### 7. Acceptance Criteria
- [ ] Public endpoints documented
- [ ] Announcement endpoints documented
- [ ] Authentication requirements clear
- [ ] Error responses documented

### 8. Git Branch
`feature/bes-024-openapi-public-announcements`

---

# Phase 9 — Hardening

---

## BES-025 — Performance Testing

### 1. Phase
Phase 9 — Hardening

### 2. Source Implementation Plan
- Original item: HRD-006

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Perform load testing on critical endpoints.

### 5. Documentation References
- `docs/testing/strategy.md`
- `docs/requirements/non-functional-requirements.md` — Performance requirements

### 6. Repository References
- `tests/` — Performance test directory

### 7. Acceptance Criteria
- [ ] Member list responds < 200ms for 1000 records
- [ ] Attendance batch confirm handles 50 records < 500ms
- [ ] Planning matrix loads < 1s
- [ ] Public stats responds < 100ms

### 8. Git Branch
`feature/bes-025-performance-testing`

---

## BES-026 — Deployment Documentation

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-010

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Update deployment documentation with final production configuration.

### 5. Documentation References
- `docs/deployment/overview.md`
- `docs/deployment/environment-variables.md`

### 6. Repository References
- `docs/deployment/` — MODIFY

### 7. Acceptance Criteria
- [ ] Environment variables documented
- [ ] Deployment steps documented
- [ ] Rollback procedures documented
- [ ] Monitoring setup documented

### 8. Git Branch
`feature/bes-026-deployment-documentation`

---

## BES-027 — Production Verification Testing

### 1. Phase
Phase 10 — Deployment

### 2. Source Implementation Plan
- Original item: DEP-008

### 3. Primary Owner
- **Name:** Israel
- **Lane:** Backend Support

### 4. Task Objective
Run end-to-end smoke tests against production.

### 5. Documentation References
- `docs/testing/e2e.md`

### 6. Repository References
- `tests/e2e/` — Smoke tests

### 7. Acceptance Criteria
- [ ] Health check responds
- [ ] Login flow works on production admin
- [ ] Member registration works
- [ ] Public portfolio loads
- [ ] Event countdowns display
- [ ] Announcements publish

### 8. Git Branch
`feature/bes-027-production-verification`
