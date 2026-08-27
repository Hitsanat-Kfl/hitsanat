# Phase 5 — Planning

## Objective

Implement the strategic planning system: annual master plan creation, 3-factor weight calculation engine, plan distribution to sub-departments, weekly execution planning, and bottom-up progress roll-up.

## Scope

### Included
- Annual master plan CRUD (6 goals, 25 activities)
- 3-factor weight calculation engine (BR-030)
- Plan distribution to sub-departments (BR-031)
- Weekly execution planning
- Progress recording and roll-up (BR-032)
- Planning admin UI (matrix view)
- Sub-department plan execution view

### Out of Scope
- Reports and analytics (Phase 7)
- Event scheduling (Phase 6)
- Attendance tracking (Phase 6)

---

## Dependencies

- Phase 3 complete (organization structure, sub-departments)
- Phase 4 complete (children, parents — for attendance context)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Weight engine, progress roll-up, plan API, distribution API |
| Israel | Backend Support | SUPPORT — Plan queries, validation, tests |
| Eyob | Frontend Developer | PRIMARY — Planning matrix UI |
| TBD | Frontend Developer | PRIMARY — Sub-department plan execution UI |

---

## Tasks

### PLN-001
**Planning Domain: Weight Calculation Engine**

- **Description:** Implement the 3-factor weight calculation engine in `packages/domain`. Formula: `Weight_i = 1/3 * [(Budget_i / Sum_Budget * 100) + (People_i / Sum_People * 100) + (Time_i / Sum_Time * 100)]`. Verify sum = 100.00%.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** FND-007
- **Deliverable:** Weight engine + unit tests (25 activities)
- **Acceptance Criteria:**
  - Weight formula implemented exactly per FR-08.3
  - Sum of all weights = 100.00%
  - Handles edge cases (zero budget, zero people, zero time)
  - Unit tests cover all 25 master activities from Action PLN.xlsx
  - Matches baseline totals (Budget: 3500, People: 112, Time: 45)
- **Reviewer:** Core

### PLN-002
**Planning Domain: Progress Roll-Up Engine**

- **Description:** Implement the bottom-up progress roll-up engine in `packages/domain`. Weekly → Monthly → Quarterly → Annual aggregation per BR-032.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** FND-007
- **Deliverable:** Roll-up engine + unit tests
- **Acceptance Criteria:**
  - Weekly progress aggregates to monthly
  - Monthly aggregates to quarterly
  - Quarterly aggregates to annual
  - Weighted contribution calculated correctly
  - Unit tests verify aggregation math
- **Reviewer:** Core

### PLN-003
**Planning API: Annual Master Plan**

- **Description:** Implement `POST /api/v1/annual-plans`, `GET /api/v1/annual-plans`, `GET /api/v1/annual-plans/:id`, `PUT /api/v1/annual-plans/:id`. Include goal and activity management.
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** FND-003, PLN-001
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Annual plan creation with goals and activities
  - Activity weight auto-calculated via engine
  - Plan status lifecycle (Draft → Distributed → Active → Completed → Archived)
  - RBAC: Ekd creates, Chairperson approves
  - Integration tests verify weight calculation
- **Reviewer:** Core

### PLN-004
**Planning API: Plan Distribution**

- **Description:** Implement `POST /api/v1/annual-plans/:id/distribute`. Ekd assigns activities to responsible sub-departments per BR-031.
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** PLN-003
- **Deliverable:** Endpoint + integration tests
- **Acceptance Criteria:**
  - Activity distributed to one or more sub-departments
  - Distribution creates `plan_distributions` records
  - Sub-departments cannot create independent plans (BR-031)
  - Status tracking (Assigned → In_Progress → Completed)
- **Reviewer:** Core

### PLN-005
**Planning API: Weekly Plans & Progress**

- **Description:** Implement `POST /api/v1/annual-plans/weekly-plans`, `POST /api/v1/annual-plans/progress`. Weekly execution items and progress recording.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** PLN-004
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Weekly plan creation from distribution
  - Progress recording with actual results
  - Roll-up triggered on progress submission
  - Status updates flow upward (BR-032)
- **Reviewer:** Core

### PLN-006
**Planning API: Plan Queries & Analytics**

- **Description:** Implement query endpoints for plan data: `GET /api/v1/annual-plans/:id/progress`, `GET /api/v1/annual-plans/:id/distributions`. Support for progress dashboards.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** PLN-003, PLN-004, PLN-005
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Progress summary by goal
  - Distribution status by sub-department
  - Weight-adjusted completion metrics
  - Quarterly breakdown available
- **Reviewer:** Core, Backend

### PLN-007
**Planning Matrix UI**

- **Description:** Build the interactive planning matrix in `apps/admin`. Display 25 activities with weight bars, quarterly distribution, and progress indicators per FR-08.2.
- **Lane:** Frontend 2
- **Priority:** Critical
- **Dependencies:** PLN-003, PLN-004
- **Deliverable:** Planning matrix page + component tests
- **Acceptance Criteria:**
  - Interactive table with 25 activities
  - Weight percentage displayed with visual bars
  - Quarterly distribution columns (Q1-Q4)
  - Budget, People, Time columns
  - Edit capability for authorized users (Ekd)
  - Responsive layout
- **Reviewer:** Core, Frontend 2

### PLN-008
**Sub-Department Plan Execution UI**

- **Description:** Build the sub-department plan execution view in `apps/admin`. Shows distributed activities, weekly tasks, and progress recording form.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** PLN-004, PLN-005
- **Deliverable:** Execution view page + component tests
- **Acceptance Criteria:**
  - Shows activities distributed to user's sub-department
  - Weekly task list
  - Progress recording form (actual result, status, challenges)
  - Roll-up progress indicator
  - Scoped to user's sub-department (RBAC)
- **Reviewer:** Core, Frontend 2

### PLN-009
**Planning Integration Tests**

- **Description:** Write integration tests covering the full planning lifecycle: plan creation → weight calculation → distribution → weekly execution → progress roll-up.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** PLN-003, PLN-004, PLN-005
- **Deliverable:** Integration test suite
- **Acceptance Criteria:**
  - Full planning lifecycle tested
  - BR-030 weight formula verified
  - BR-031 distribution constraint verified
  - BR-032 roll-up aggregation verified
  - Weight sum = 100.00% verified
- **Reviewer:** Core

### PLN-010
**OpenAPI Planning Documentation**

- **Description:** Update Swagger/OpenAPI specification with planning endpoint documentation.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** PLN-003, PLN-004, PLN-005
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - All planning endpoints documented
  - Weight formula documented
  - Roll-up logic documented
  - Error responses documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- PLN-001 and PLN-002 (independent engines)
- PLN-003 and PLN-004 (sequential but can start PLN-004 as PLN-003 nears completion)
- PLN-007 and PLN-008 (independent UI pages)

**Must happen sequentially:**
- PLN-003 depends on PLN-001
- PLN-004 depends on PLN-003
- PLN-005 depends on PLN-004
- PLN-006 depends on PLN-003, PLN-004, PLN-005

---

## Deliverables

1. Weight calculation engine
2. Progress roll-up engine
3. Annual plan API
4. Plan distribution API
5. Weekly plans and progress API
6. Planning matrix UI
7. Sub-department execution UI
8. Planning integration tests
9. OpenAPI documentation

---

## Exit Criteria

- [ ] Weight formula produces sum = 100.00% for 25 activities
- [ ] Annual plan creation works end-to-end
- [ ] Plan distribution to sub-departments works
- [ ] Weekly execution planning works
- [ ] Progress roll-up aggregation works
- [ ] Planning matrix UI displays correctly
- [ ] Sub-department execution view works
- [ ] RBAC enforced on all planning endpoints
- [ ] All integration tests pass
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
