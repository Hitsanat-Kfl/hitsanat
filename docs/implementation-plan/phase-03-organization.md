# Phase 3 — Organization Structure

## Objective

Implement the organizational hierarchy: members, families, and sub-departments. This phase establishes the core data model that all operational features depend on.

## Scope

### Included
- Member entity CRUD (Stage 1 & Stage 2 registration)
- Family entity CRUD (Father/Mother assignment)
- Sub-department entity CRUD (listing, rosters)
- Sub-department member join table management
- Family member allocation
- API endpoints for all organization entities
- Admin UI for member management

### Out of Scope
- Attendance tracking (Phase 6)
- Planning (Phase 5)
- Children/Parents (Phase 4)
- Academic tracking (Phase 6)

---

## Dependencies

- Phase 2 complete (authentication and RBAC in place)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Architecture, complex API endpoints, use cases, repositories |
| Israel | Backend Support | SUPPORT — CRUD endpoints, validation, tests |
| Eyob | Frontend Developer | PRIMARY — Member management UI, registration wizard |
| TBD | Frontend Developer | PRIMARY — Member list, detail pages, sub-department rosters |

---

## Tasks

### ORG-001
**Member API: Stage 1 Registration**

- **Description:** Implement `POST /api/v1/members/stage-1` endpoint. Secretary creates member with mandatory fields: FullName, ChristianName, Phone, YearOfStudy, Department, Campus, Gender.
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** FND-001, AUTH-003
- **Deliverable:** Endpoint + integration test
- **Acceptance Criteria:**
  - Endpoint creates member with Stage 1 fields only
  - Phone number uniqueness enforced
  - Zod validation on all required fields
  - Returns created member with UUID
  - Integration test verifies creation
- **Reviewer:** Core

### ORG-002
**Member API: Stage 2 Enrichment**

- **Description:** Implement `PUT /api/v1/members/:id/stage-2` endpoint. Assigns member to sub-departments, allocates to family, uploads photo, assigns Telegram username.
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** ORG-001
- **Deliverable:** Endpoint + integration test
- **Acceptance Criteria:**
  - Endpoint updates member with Stage 2 fields
  - Sub-department assignment creates `sub_department_members` records
  - Family allocation creates `family_members` record
  - Photo URL stored
  - Telegram username stored
- **Reviewer:** Core

### ORG-003
**Member API: List, Detail, Update**

- **Description:** Implement `GET /api/v1/members` (list with filtering), `GET /api/v1/members/:id` (detail), `PUT /api/v1/members/:id` (update).
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** ORG-001
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - List endpoint supports pagination, search, filtering
  - Detail endpoint returns member with sub-departments and family
  - Update endpoint modifies member fields
  - RBAC enforced (Secretary can update all, leaders see own scope)
- **Reviewer:** Core, Backend

### ORG-004
**Family API: CRUD & Parent Assignment**

- **Description:** Implement family endpoints: `POST /api/v1/families`, `GET /api/v1/families`, `GET /api/v1/families/:id`, `PUT /api/v1/families/:id/parents`. Enforce BR-004 (one Father, one Mother).
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** FND-001, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Family creation with name and academic year
  - Father assignment (male member, max 1)
  - Mother assignment (female member, max 1)
  - Member allocation to family
  - Family roster retrieval
  - Integration tests verify BR-004 constraint
- **Reviewer:** Core

### ORG-005
**Sub-Department API: List & Rosters**

- **Description:** Implement `GET /api/v1/sub-departments` (list), `GET /api/v1/sub-departments/:id/roster` (member roster). Scoped access per RBAC.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** FND-001, FND-006, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - List returns all 5 sub-departments
  - Roster returns members with scoped roles
  - Sub-department leaders see only own roster
  - Chairperson sees all rosters
- **Reviewer:** Core, Backend

### ORG-006
**Member Registration Wizard UI**

- **Description:** Build the 2-stage member registration wizard in `apps/admin`. Stage 1: fast-add modal with mandatory fields. Stage 2: multi-dept allocation, family assignment, photo upload.
- **Lane:** Frontend 2
- **Priority:** Critical
- **Dependencies:** ORG-001, ORG-002, ORG-004
- **Deliverable:** Registration wizard + component tests
- **Acceptance Criteria:**
  - Stage 1 modal with all mandatory fields
  - Form validation (Zod via React Hook Form)
  - Stage 2 multi-department selection
  - Family allocation dropdown
  - Photo upload field
  - Success/error feedback
  - Mobile-responsive
- **Reviewer:** Core, Frontend 2

### ORG-007
**Member List & Detail UI**

- **Description:** Build the member list page and detail view in `apps/admin`. Include search, filtering by sub-department, and member profile display.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** ORG-003, ORG-005
- **Deliverable:** List page + detail page + component tests
- **Acceptance Criteria:**
  - Paginated member list
  - Search by name or phone
  - Filter by sub-department
  - Member detail shows profile, sub-departments, family
  - Edit capability for authorized users
- **Reviewer:** Core, Frontend 2

### ORG-008
**Organization Integration Tests**

- **Description:** Write end-to-end integration tests covering the full member lifecycle: Stage 1 creation → Stage 2 enrichment → sub-department assignment → family allocation.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** ORG-001, ORG-002, ORG-004
- **Deliverable:** Integration test suite
- **Acceptance Criteria:**
  - Full lifecycle tested
  - BR-001 (2-stage registration) verified
  - BR-002 (multi-department) verified
  - BR-004 (family constraints) verified
  - BR-005 (dual family roles) verified
- **Reviewer:** Core

### ORG-009
**OpenAPI Organization Documentation**

- **Description:** Update Swagger/OpenAPI specification with member, family, and sub-department endpoint documentation.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** ORG-001 through ORG-005
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - All organization endpoints documented
  - Request/response schemas defined
  - Error responses documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- ORG-001 and ORG-004 (independent member and family endpoints)
- ORG-003, ORG-005 (list endpoints)
- ORG-006 and ORG-007 (independent UI pages)

**Must happen sequentially:**
- ORG-002 depends on ORG-001 (Stage 2 requires Stage 1)
- ORG-006 depends on ORG-001, ORG-002, ORG-004
- ORG-007 depends on ORG-003, ORG-005

---

## Deliverables

1. Member registration API (Stage 1 & 2)
2. Family CRUD API with parent assignment
3. Sub-department list and roster API
4. Member registration wizard UI
5. Member list and detail UI
6. Organization integration tests
7. OpenAPI documentation

---

## Exit Criteria

- [ ] Member Stage 1 & 2 registration works end-to-end
- [ ] Family Father/Mother assignment enforced (BR-004)
- [ ] Multi-department membership works (BR-002)
- [ ] Sub-department rosters display correctly
- [ ] Registration wizard functional in admin UI
- [ ] Member list and detail pages work
- [ ] All integration tests pass
- [ ] RBAC enforced on all endpoints
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
