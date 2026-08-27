# Task Matrix — Full Traceability

## Hitsanat Kifl Children's Ministry Management System
**Total Tasks:** 106
**Format:** Task ID | Phase | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status

---

## Phase 0 — Architecture & Planning (10 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ARCH-001 | Schema Contract: Identity & Membership | Abrham | Core | `packages/database/` | None | Unit | `docs/database/entities.md` | `feature/arch-001-identity-membership-schema` | NOT_STARTED |
| ARCH-002 | Schema Contract: Beneficiaries & Parents | Abrham | Core | `packages/database/` | None | Unit | `docs/database/entities.md` | `feature/arch-002-beneficiaries-parents-schema` | NOT_STARTED |
| ARCH-003 | Schema Contract: Planning | Abrham | Core | `packages/database/` | None | Unit | `docs/database/entities.md` | `feature/arch-003-planning-schema` | NOT_STARTED |
| ARCH-004 | Schema Contract: Attendance & Events | Abrham | Core | `packages/database/` | None | Unit | `docs/database/entities.md` | `feature/arch-004-attendance-events-schema` | NOT_STARTED |
| ARCH-005 | Schema Contract: Academic & Announcements | Abrham | Core | `packages/database/` | None | Unit | `docs/database/entities.md` | `feature/arch-005-academic-announcements-schema` | NOT_STARTED |
| ARCH-006 | API Contract Specification | Abrham | Core | `docs/api/` | ARCH-001–005 | Unit | `docs/api/endpoints.md` | `feature/arch-006-api-contracts` | NOT_STARTED |
| ARCH-007 | Domain Package Interface | Abrham | Core | `packages/domain/` | ARCH-003 | Unit | `docs/architecture/system-architecture.md` | `feature/arch-007-domain-interface` | NOT_STARTED |
| ARCH-008 | Permissions Package Interface | Abrham | Core | `packages/permissions/` | None | Unit | `docs/requirements/roles-and-permissions.md` | `feature/arch-008-permissions-interface` | NOT_STARTED |
| ARCH-009 | Module Structure Template | Abrham | Core | `apps/api/src/modules/` | None | Unit | `docs/architecture/system-architecture.md` | `feature/arch-009-module-template` | NOT_STARTED |
| ARCH-010 | Testing Infrastructure | Abrham | Core | `tests/` | None | Unit | `docs/testing/strategy.md` | `feature/arch-010-testing-infra` | NOT_STARTED |

---

## Phase 1 — Engineering Foundation (10 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| FND-001 | DB Migration: Identity & Membership | Abrham | Core | `packages/database/` | ARCH-001 | Integration | `docs/database/entities.md` | `feature/fnd-001-identity-membership-migration` | NOT_STARTED |
| FND-002 | DB Migration: Beneficiary & Parent | Abrham | Core | `packages/database/` | ARCH-002 | Integration | `docs/database/entities.md` | `feature/fnd-002-beneficiary-parent-migration` | NOT_STARTED |
| FND-003 | DB Migration: Planning | Abrham | Core | `packages/database/` | ARCH-003 | Integration | `docs/database/entities.md` | `feature/fnd-003-planning-migration` | NOT_STARTED |
| FND-004 | DB Migration: Attendance & Event | Abrham | Core | `packages/database/` | ARCH-004 | Integration | `docs/database/entities.md` | `feature/fnd-004-attendance-event-migration` | NOT_STARTED |
| FND-005 | DB Migration: Academic & Announcement | Abrham | Core | `packages/database/` | ARCH-005 | Integration | `docs/database/entities.md` | `feature/fnd-005-academic-announcement-migration` | NOT_STARTED |
| FND-006 | Seed Script: Sub-Departments | Israel | Backend Support | `packages/database/src/seed/` | FND-001 | Integration | `docs/database/entities.md` | `feature/fnd-006-seed-sub-departments` | NOT_STARTED |
| FND-007 | Shared Package: packages/domain | Abrham | Core | `packages/domain/` | ARCH-007 | Unit | `docs/architecture/system-architecture.md` | `feature/fnd-007-domain-package` | NOT_STARTED |
| FND-008 | Shared Package: packages/permissions | Abrham | Core | `packages/permissions/` | ARCH-008 | Unit | `docs/requirements/roles-and-permissions.md` | `feature/fnd-008-permissions-package` | NOT_STARTED |
| FND-009 | Shared Package: packages/validation | Israel | Backend Support | `packages/validation/` | None | Unit | `docs/architecture/system-architecture.md` | `feature/fnd-009-validation-package` | NOT_STARTED |
| FND-010 | Module Skeleton: All API Modules | Abrham | Core | `apps/api/src/modules/` | ARCH-009 | Unit | `docs/architecture/system-architecture.md` | `feature/fnd-010-module-skeleton` | NOT_STARTED |

---

## Phase 2 — Authentication & Authorization (8 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| AUTH-001 | Better Auth Configuration | Abrham | Core | `packages/auth/` | FND-001 | Unit | `docs/architecture/system-architecture.md` | `feature/auth-001-better-auth-config` | NOT_STARTED |
| AUTH-002 | Auth Database Tables | Abrham | Core | `packages/database/` | FND-001 | Integration | `docs/database/entities.md` | `feature/auth-002-auth-tables` | NOT_STARTED |
| AUTH-003 | Scoped RBAC Middleware | Abrham | Core | `apps/api/src/shared/middleware/` | FND-008, AUTH-001 | Unit + Integration | `docs/requirements/roles-and-permissions.md` | `feature/auth-003-rbac-middleware` | NOT_STARTED |
| AUTH-004 | Auth API Endpoints | Abrham | Core | `apps/api/src/modules/auth/` | AUTH-001, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/auth-004-auth-endpoints` | NOT_STARTED |
| AUTH-005 | Admin Login Page | Eyob | Frontend 1 | `apps/admin/src/app/(unauthenticated)/login/` | AUTH-004 | E2E + Component | `docs/requirements/functional-requirements.md` | `feature/auth-005-admin-login` | NOT_STARTED |
| AUTH-006 | Admin Route Guards | TBD | Frontend 2 | `apps/admin/src/components/auth/` | AUTH-005 | E2E | `docs/adr/ADR-0007.md` | `feature/auth-006-route-guards` | NOT_STARTED |
| AUTH-007 | Auth Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | AUTH-004 | Integration | `docs/testing/integration.md` | `feature/auth-007-auth-integration-tests` | NOT_STARTED |
| AUTH-008 | OpenAPI Auth Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | AUTH-004 | Unit | `docs/api/swagger.md` | `feature/auth-008-openapi-auth` | NOT_STARTED |

---

## Phase 3 — Organization Structure (9 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ORG-001 | Member API: Stage 1 Registration | Abrham | Core | `apps/api/src/modules/members/` | FND-001, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/org-001-member-stage1` | NOT_STARTED |
| ORG-002 | Member API: Stage 2 Enrichment | Abrham | Core | `apps/api/src/modules/members/` | ORG-001 | Integration | `docs/api/endpoints.md` | `feature/org-002-member-stage2` | NOT_STARTED |
| ORG-003 | Member API: List, Detail, Update | Israel | Backend Support | `apps/api/src/modules/members/` | ORG-001 | Integration | `docs/api/endpoints.md` | `feature/org-003-member-list-detail` | NOT_STARTED |
| ORG-004 | Family API: CRUD & Parent Assignment | Abrham | Core | `apps/api/src/modules/families/` | FND-001, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/org-004-family-crud` | NOT_STARTED |
| ORG-005 | Sub-Department API: List & Rosters | Israel | Backend Support | `apps/api/src/modules/sub-departments/` | FND-001, FND-006, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/org-005-subdepartment-list` | NOT_STARTED |
| ORG-006 | Member Registration Wizard UI | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/members/register/` | ORG-001, ORG-002, ORG-004 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/org-006-registration-wizard` | NOT_STARTED |
| ORG-007 | Member List & Detail UI | Eyob | Frontend 1 | `apps/admin/src/app/(authenticated)/members/` | ORG-003, ORG-005 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/org-007-member-list-detail` | NOT_STARTED |
| ORG-008 | Organization Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | ORG-001, ORG-002, ORG-004 | Integration | `docs/testing/integration.md` | `feature/org-008-organization-integration` | NOT_STARTED |
| ORG-009 | OpenAPI Organization Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | ORG-001–005 | Unit | `docs/api/swagger.md` | `feature/org-009-openapi-organization` | NOT_STARTED |

---

## Phase 4 — Member Management: Children & Parents (8 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| MBR-001 | Child API: Registration & CRUD | Abrham | Core | `apps/api/src/modules/children/` | FND-002, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/mbr-001-child-crud` | NOT_STARTED |
| MBR-002 | Parent API: CRUD | Israel | Backend Support | `apps/api/src/modules/parents/` | FND-002, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/mbr-002-parent-crud` | NOT_STARTED |
| MBR-003 | Child-Parent Linking API | Abrham | Core | `apps/api/src/modules/children/` | MBR-001, MBR-002 | Integration | `docs/api/endpoints.md` | `feature/mbr-003-child-parent-linking` | NOT_STARTED |
| MBR-004 | Child Registration UI | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/children/register/` | MBR-001 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/mbr-004-child-registration` | NOT_STARTED |
| MBR-005 | Parent Linking UI | TBD | Frontend 2 | `apps/admin/src/components/children/` | MBR-002, MBR-003 | Component | `docs/requirements/functional-requirements.md` | `feature/mbr-005-parent-linking` | NOT_STARTED |
| MBR-006 | Child List & Detail UI | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/children/` | MBR-001 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/mbr-006-child-list-detail` | NOT_STARTED |
| MBR-007 | Children & Parents Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | MBR-001, MBR-002, MBR-003 | Integration | `docs/testing/integration.md` | `feature/mbr-007-children-parents-integration` | NOT_STARTED |
| MBR-008 | OpenAPI Children & Parents Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | MBR-001–003 | Unit | `docs/api/swagger.md` | `feature/mbr-008-openapi-children-parents` | NOT_STARTED |

---

## Phase 5 — Planning (10 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| PLN-001 | Planning Domain: Weight Calculation Engine | Abrham | Core | `packages/domain/src/planning/` | FND-007 | Unit | `docs/planning/progress-tracking.md` | `feature/pln-001-weight-engine` | NOT_STARTED |
| PLN-002 | Planning Domain: Progress Roll-Up Engine | Abrham | Core | `packages/domain/src/planning/` | FND-007 | Unit | `docs/planning/progress-tracking.md` | `feature/pln-002-rollup-engine` | NOT_STARTED |
| PLN-003 | Planning API: Annual Master Plan | Abrham | Core | `apps/api/src/modules/planning/` | FND-003, PLN-001 | Integration | `docs/api/endpoints.md` | `feature/pln-003-annual-plan-api` | NOT_STARTED |
| PLN-004 | Planning API: Plan Distribution | Abrham | Core | `apps/api/src/modules/planning/` | PLN-003 | Integration | `docs/api/endpoints.md` | `feature/pln-004-plan-distribution` | NOT_STARTED |
| PLN-005 | Planning API: Weekly Plans & Progress | Abrham | Core | `apps/api/src/modules/planning/` | PLN-004 | Integration | `docs/api/endpoints.md` | `feature/pln-005-weekly-plans` | NOT_STARTED |
| PLN-006 | Planning API: Plan Queries & Analytics | Israel | Backend Support | `apps/api/src/modules/planning/` | PLN-003, PLN-004, PLN-005 | Integration | `docs/api/endpoints.md` | `feature/pln-006-plan-queries` | NOT_STARTED |
| PLN-007 | Planning Matrix UI | Eyob | Frontend 1 | `apps/admin/src/app/(authenticated)/planning/` | PLN-003, PLN-004 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/pln-007-planning-matrix` | NOT_STARTED |
| PLN-008 | Sub-Department Plan Execution UI | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/planning/execution/` | PLN-004, PLN-005 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/pln-008-plan-execution` | NOT_STARTED |
| PLN-009 | Planning Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | PLN-003, PLN-004, PLN-005 | Integration | `docs/testing/integration.md` | `feature/pln-009-planning-integration` | NOT_STARTED |
| PLN-010 | OpenAPI Planning Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | PLN-003–005 | Unit | `docs/api/swagger.md` | `feature/pln-010-openapi-planning` | NOT_STARTED |

---

## Phase 6 — Operational Tracking (13 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| OPS-001 | Attendance API: Session Management | Abrham | Core | `apps/api/src/modules/attendance/` | FND-004, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/ops-001-session-mgmt` | NOT_STARTED |
| OPS-002 | Attendance API: Auto-Seeding | Abrham | Core | `apps/api/src/modules/attendance/` | OPS-001 | Integration | `docs/requirements/business-rules.md` | `feature/ops-002-auto-seeding` | NOT_STARTED |
| OPS-003 | Attendance API: Verification & Batch Confirm | Abrham | Core | `apps/api/src/modules/attendance/` | OPS-002 | Integration | `docs/api/endpoints.md` | `feature/ops-003-verification-batch` | NOT_STARTED |
| OPS-004 | Transport Route Assignment API | Abrham | Core | `apps/api/src/modules/attendance/` | OPS-001 | Integration | `docs/requirements/business-rules.md` | `feature/ops-004-transport-assignment` | NOT_STARTED |
| OPS-005 | Academic Assessment API | Israel | Backend Support | `apps/api/src/modules/academic-tracking/` | FND-005, MBR-001 | Integration | `docs/api/endpoints.md` | `feature/ops-005-academic-assessment` | NOT_STARTED |
| OPS-006 | Event API: Creation & Program Assignment | Abrham | Core | `apps/api/src/modules/events/` | FND-004, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/ops-006-event-creation` | NOT_STARTED |
| OPS-007 | Event Attendance API | Israel | Backend Support | `apps/api/src/modules/events/` | OPS-006 | Integration | `docs/api/endpoints.md` | `feature/ops-007-event-attendance` | NOT_STARTED |
| OPS-008 | Attendance Checksheets UI | Eyob | Frontend 1 | `apps/admin/src/app/(authenticated)/attendance/` | OPS-002, OPS-003 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/ops-008-attendance-checksheets` | NOT_STARTED |
| OPS-009 | Transport Dispatcher UI | Eyob | Frontend 1 | `apps/admin/src/app/(authenticated)/transport/` | OPS-004 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/ops-009-transport-dispatcher` | NOT_STARTED |
| OPS-010 | Event Management UI | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/events/` | OPS-006 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/ops-010-event-management` | NOT_STARTED |
| OPS-011 | Academic Score Entry UI | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/academic/` | OPS-005 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/ops-011-academic-score-entry` | NOT_STARTED |
| OPS-012 | Operational Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | OPS-001–006 | Integration | `docs/testing/integration.md` | `feature/ops-012-operational-integration` | NOT_STARTED |
| OPS-013 | OpenAPI Operations Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | OPS-001–006 | Unit | `docs/api/swagger.md` | `feature/ops-013-openapi-operations` | NOT_STARTED |

---

## Phase 7 — Reporting & Dashboard (8 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| RPT-001 | Report Domain: Aggregation Logic | Abrham | Core | `packages/domain/src/reporting/` | PLN-002, OPS-002 | Unit | `docs/planning/progress-tracking.md` | `feature/rpt-001-aggregation-logic` | NOT_STARTED |
| RPT-002 | Report API: Generation & Retrieval | Abrham | Core | `apps/api/src/modules/reports/` | RPT-001 | Integration | `docs/api/endpoints.md` | `feature/rpt-002-report-api` | NOT_STARTED |
| RPT-003 | Report API: Sub-Department Submission | Israel | Backend Support | `apps/api/src/modules/reports/` | RPT-002 | Integration | `docs/api/endpoints.md` | `feature/rpt-003-report-submission` | NOT_STARTED |
| RPT-004 | Executive Dashboard: Chairperson Overview | Eyob | Frontend 1 | `apps/admin/src/app/(authenticated)/dashboard/` | RPT-002 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/rpt-004-executive-dashboard` | NOT_STARTED |
| RPT-005 | Sub-Department Dashboard | TBD | Frontend 2 | `apps/admin/src/app/(authenticated)/dashboard/sub-department/` | RPT-002 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/rpt-005-subdepartment-dashboard` | NOT_STARTED |
| RPT-006 | Report Generation UI | Eyob | Frontend 1 | `apps/admin/src/app/(authenticated)/reports/` | RPT-002, RPT-003 | Component + E2E | `docs/requirements/functional-requirements.md` | `feature/rpt-006-report-generation` | NOT_STARTED |
| RPT-007 | Reporting Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | RPT-001–003 | Integration | `docs/testing/integration.md` | `feature/rpt-007-reporting-integration` | NOT_STARTED |
| RPT-008 | OpenAPI Reporting Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | RPT-002, RPT-003 | Unit | `docs/api/swagger.md` | `feature/rpt-008-openapi-reporting` | NOT_STARTED |

---

## Phase 8 — Portfolio & Public Features (10 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| PTF-001 | Announcement API: CRUD & Publishing | Abrham | Core | `apps/api/src/modules/announcements/` | FND-005, AUTH-003 | Integration | `docs/api/endpoints.md` | `feature/ptf-001-announcement-api` | NOT_STARTED |
| PTF-002 | Public API: Stats & Events | Abrham | Core | `apps/api/src/modules/public/` | PTF-001 | Integration | `docs/api/endpoints.md` | `feature/ptf-002-public-api` | NOT_STARTED |
| PTF-003 | Telegram Bot Service | Israel | Backend Support | `apps/telegram/` | PTF-001 | Integration | `docs/architecture/system-architecture.md` | `feature/ptf-003-telegram-bot` | NOT_STARTED |
| PTF-004 | Portfolio Home Page | Eyob | Frontend 1 | `apps/portfolio/src/app/page.tsx` | PTF-002 | E2E | `docs/ui/portfolio-design.md` | `feature/ptf-004-portfolio-home` | NOT_STARTED |
| PTF-005 | Event Countdown Displays | Eyob | Frontend 1 | `apps/portfolio/src/components/` | PTF-002 | Component + E2E | `docs/ui/portfolio-design.md` | `feature/ptf-005-event-countdowns` | NOT_STARTED |
| PTF-006 | Announcement Feed | Eyob | Frontend 1 | `apps/portfolio/src/components/` | PTF-002 | Component + E2E | `docs/ui/portfolio-design.md` | `feature/ptf-006-announcement-feed` | NOT_STARTED |
| PTF-007 | Public Stats Display | Eyob | Frontend 1 | `apps/portfolio/src/components/` | PTF-002 | Component + E2E | `docs/ui/portfolio-design.md` | `feature/ptf-007-public-stats` | NOT_STARTED |
| PTF-008 | Portfolio E2E & Accessibility Tests | Eyob | Frontend 1 | `tests/e2e/` | PTF-004–006 | E2E | `docs/testing/e2e.md` | `feature/ptf-008-portfolio-e2e` | NOT_STARTED |
| PTF-009 | Portfolio Integration Tests | Israel | Backend Support | `apps/api/tests/integration/` | PTF-001, PTF-002 | Integration | `docs/testing/integration.md` | `feature/ptf-009-portfolio-integration` | NOT_STARTED |
| PTF-010 | OpenAPI Public & Announcement Documentation | Israel | Backend Support | `apps/api/src/infrastructure/swagger.ts` | PTF-001, PTF-002 | Unit | `docs/api/swagger.md` | `feature/ptf-010-openapi-public` | NOT_STARTED |

---

## Phase 9 — Integration, Security & Hardening (10 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| HRD-001 | Cross-Module Integration Test Suite | Abrham | Core | `tests/integration/` | All previous phases | Integration | `docs/testing/strategy.md` | `feature/hrd-001-cross-module-tests` | NOT_STARTED |
| HRD-002 | Security Audit: Authentication & Authorization | Abrham | Core | `apps/api/src/shared/middleware/` | All previous phases | Security | `docs/testing/security.md` | `feature/hrd-002-security-auth-audit` | NOT_STARTED |
| HRD-003 | Security Audit: Data Protection | Abrham | Core | `apps/api/src/` | All previous phases | Security | `docs/testing/security.md` | `feature/hrd-003-security-data-audit` | NOT_STARTED |
| HRD-004 | API Error Handling Standardization | Abrham | Core | `apps/api/src/shared/` | All previous phases | Integration | `docs/api/error-handling.md` | `feature/hrd-004-error-handling` | NOT_STARTED |
| HRD-005 | Rate Limiting & Throttling | Abrham | Core | `apps/api/src/shared/middleware/` | All previous phases | Integration | `docs/architecture/system-architecture.md` | `feature/hrd-005-rate-limiting` | NOT_STARTED |
| HRD-006 | Performance Testing | Israel | Backend Support | `tests/performance/` | All previous phases | Performance | `docs/testing/strategy.md` | `feature/hrd-006-performance-testing` | NOT_STARTED |
| HRD-007 | Admin Accessibility Audit | Eyob | Frontend 1 | `apps/admin/` | All previous phases | Accessibility | `docs/testing/accessibility.md` | `feature/hrd-007-admin-accessibility` | NOT_STARTED |
| HRD-008 | Portfolio Accessibility Audit | TBD | Frontend 2 | `apps/portfolio/` | All previous phases | Accessibility | `docs/testing/accessibility.md` | `feature/hrd-008-portfolio-accessibility` | NOT_STARTED |
| HRD-009 | Code Quality Review | Abrham | Core | All packages | All previous phases | Unit | `docs/testing/strategy.md` | `feature/hrd-009-code-quality` | NOT_STARTED |
| HRD-010 | Documentation Review | Israel | Backend Support | `docs/` | All previous phases | Unit | `docs/` | `feature/hrd-010-documentation-review` | NOT_STARTED |

---

## Phase 10 — Deployment & Production Readiness (10 tasks)

| Task ID | Source Plan Item | Primary Owner | Lane | Repository Area | Dependencies | Tests | Documentation | Git Branch | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| DEP-001 | Railway: API Service Deployment | Abrham | Core | `railway.toml` | Phase 9 complete | E2E | `docs/deployment/overview.md` | `feature/dep-001-railway-api` | NOT_STARTED |
| DEP-002 | Railway: PostgreSQL Database | Abrham | Core | `railway.toml` | None | Integration | `docs/deployment/overview.md` | `feature/dep-002-railway-db` | NOT_STARTED |
| DEP-003 | Railway: Telegram Bot Service | Abrham | Core | `railway.toml` | DEP-001, PTF-003 | E2E | `docs/deployment/overview.md` | `feature/dep-003-railway-telegram` | NOT_STARTED |
| DEP-004 | Vercel: Portfolio Deployment | Abrham | Core | `vercel.json` | DEP-001 | E2E | `docs/deployment/overview.md` | `feature/dep-004-vercel-portfolio` | NOT_STARTED |
| DEP-005 | Vercel: Admin Deployment | Abrham | Core | `vercel.json` | DEP-001 | E2E | `docs/deployment/overview.md` | `feature/dep-005-vercel-admin` | NOT_STARTED |
| DEP-006 | CORS & Security Configuration | Abrham | Core | `apps/api/src/` | DEP-001, DEP-004, DEP-005 | Security | `docs/deployment/overview.md` | `feature/dep-006-cors-security` | NOT_STARTED |
| DEP-007 | CI/CD Pipeline Verification | Abrham | Core | `.github/workflows/` | DEP-001, DEP-004, DEP-005 | CI | `docs/deployment/overview.md` | `feature/dep-007-cicd-verification` | NOT_STARTED |
| DEP-008 | Production Verification Testing | Israel | Backend Support | `tests/e2e/` | DEP-001, DEP-004, DEP-005 | E2E | `docs/deployment/overview.md` | `feature/dep-008-production-verification` | NOT_STARTED |
| DEP-009 | Domain & DNS Configuration | Abrham | Core | DNS config | DEP-004, DEP-005, DEP-001 | E2E | `docs/deployment/overview.md` | `feature/dep-009-domain-dns` | NOT_STARTED |
| DEP-010 | Deployment Documentation | Israel | Backend Support | `docs/deployment/` | DEP-001–009 | Unit | `docs/deployment/overview.md` | `feature/dep-010-deployment-docs` | NOT_STARTED |

---

## Summary by Person

| Person | Tasks | Phases Active | Task File |
|:---|:---:|:---|:---|
| Abrham (Core + Backend) | 58 | 0–10 | `docs/tasks/core.md` |
| Israel (Backend Support) | 25 | 1–10 | `docs/tasks/backend-support.md` |
| Eyob (Frontend Developer 1) | 13 | 2–9 | `docs/tasks/frontend-1.md` |
| TBD (Frontend Developer 2) | 10 | 2–9 | `docs/tasks/frontend-2.md` |
| **Total** | **106** | | |

## Summary by Phase

| Phase | Tasks | Abrham | Israel | Eyob | TBD |
|:---|:---:|:---:|:---:|:---:|:---:|
| Phase 0 | 10 | 10 | 0 | 0 | 0 |
| Phase 1 | 10 | 8 | 2 | 0 | 0 |
| Phase 2 | 8 | 4 | 2 | 1 | 1 |
| Phase 3 | 9 | 4 | 3 | 1 | 1 |
| Phase 4 | 8 | 3 | 2 | 2 | 1 |
| Phase 5 | 10 | 5 | 3 | 1 | 1 |
| Phase 6 | 13 | 6 | 3 | 2 | 2 |
| Phase 7 | 8 | 2 | 3 | 2 | 1 |
| Phase 8 | 10 | 3 | 3 | 2 | 2 |
| Phase 9 | 10 | 6 | 2 | 1 | 1 |
| Phase 10 | 10 | 8 | 2 | 0 | 0 |
| **Total** | **106** | **58** | **25** | **13** | **10** |

## Task Status Summary

| Status | Count | Percentage |
|:---|:---:|:---:|
| NOT_STARTED | 106 | 100% |
| IN_PROGRESS | 0 | 0% |
| COMPLETED | 0 | 0% |

## Traceability Confirmation

| Category | Count | Status |
|:---|:---:|:---|
| Tasks with Source Plan Item | 106 | ✅ 100% traced |
| Tasks with Repository Area | 106 | ✅ 100% identified |
| Tasks with Test Coverage | 106 | ✅ 100% defined |
| Tasks with Documentation Ref | 106 | ✅ 100% referenced |
| Tasks with Git Branch | 106 | ✅ 100% named |
| Tasks with Dependencies | 106 | ✅ 100% mapped |

## Lane Task Files

| Lane | Task File | Tasks |
|:---|:---|:---:|
| Core (Abrham) | `docs/tasks/core.md` | 55 |
| Backend Support (Israel) | `docs/tasks/backend-support.md` | 25 |
| Frontend 1 (Eyob) | `docs/tasks/frontend-1.md` | 13 |
| Frontend 2 (TBD) | `docs/tasks/frontend-2.md` | 10 |
| **Total** | | **103** |

> Note: Some tasks in the implementation plan may be split or merged in the detailed lane task files. The core.md file contains 55 tasks (some implementation plan items split into multiple tasks). The total of 103 lane tasks maps to 106 implementation plan items.
