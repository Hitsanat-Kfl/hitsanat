# Phase 7 — Reporting & Dashboard

## Objective

Implement the reporting and dashboard system: periodic report generation, executive dashboards, KPI visualization, and consolidated analytics across all modules.

## Scope

### Included
- Periodic report generation (Weekly, Monthly, Quarterly, Half-Year, Annual)
- Sub-department report submission workflow
- Executive dashboards (Chairperson, Sub-Chairperson)
- Sub-department scoped dashboards
- KPI visualization (progress bars, charts)
- Performance metrics calculation

### Out of Scope
- Public portfolio (Phase 8)
- Telegram notifications (Phase 8)
- Planning (Phase 5 — already complete)

---

## Dependencies

- Phase 5 complete (planning system)
- Phase 6 complete (operational tracking)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Report aggregation logic, KPI calculation, report API |
| Israel | Backend Support | SUPPORT — Sub-department submission API, tests |
| Eyob | Frontend Developer | PRIMARY — Executive dashboard (Chairperson), report generation UI |
| TBD | Frontend Developer | PRIMARY — Sub-department dashboards |

---

## Tasks

### RPT-001
**Report Domain: Aggregation Logic**

- **Description:** Implement report aggregation logic in `packages/domain`. Consolidate data from attendance, academic, and planning modules into periodic reports per FR-10.1.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** PLN-002, OPS-002
- **Deliverable:** Report aggregation engine + unit tests
- **Acceptance Criteria:**
  - Weekly report aggregation
  - Monthly report aggregation
  - Quarterly report aggregation
  - Annual report aggregation
  - Performance metrics calculation (planned vs actual)
  - Unit tests verify aggregation accuracy
- **Reviewer:** Core

### RPT-002
**Report API: Generation & Retrieval**

- **Description:** Implement report endpoints: `POST /api/v1/reports/generate`, `GET /api/v1/reports`, `GET /api/v1/reports/:id`. Sub-departments submit data; Ekd generates consolidated reports per FR-10.2.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** RPT-001
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Report generation from sub-department data
  - Report list with filtering by period and sub-department
  - Report detail with full metrics
  - RBAC: Ekd generates consolidated, others see own
- **Reviewer:** Core

### RPT-003
**Report API: Sub-Department Submission**

- **Description:** Implement `POST /api/v1/reports/submissions`. Sub-departments submit periodic performance data to Ekd per FR-10.2.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** RPT-002
- **Deliverable:** Endpoint + integration tests
- **Acceptance Criteria:**
  - Sub-department submission with period, metrics, challenges
  - Submission status tracking
  - RBAC: Sub-department leaders submit own data
  - Ekd reviews all submissions
- **Reviewer:** Core, Backend

### RPT-004
**Executive Dashboard: Chairperson Overview**

- **Description:** Build the Chairperson executive dashboard in `apps/admin`. Overview of all sub-departments, overall progress, key KPIs.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** RPT-002
- **Deliverable:** Dashboard page + component tests
- **Acceptance Criteria:**
  - Overall progress summary
  - Sub-department status cards
  - Planning completion percentage
  - Attendance summary
  - Key KPI widgets
  - Cross-departmental visibility (RBAC: Chairperson)
- **Reviewer:** Core, Frontend 2

### RPT-005
**Sub-Department Dashboard**

- **Description:** Build sub-department scoped dashboards in `apps/admin`. Each leader sees only their department's data per FR-03.2.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** RPT-002
- **Deliverable:** Dashboard pages + component tests
- **Acceptance Criteria:**
  - Scoped to user's sub-department (RBAC)
  - Department-specific KPIs
  - Progress tracking for distributed activities
  - Attendance summary for department
  - Academic scores for Timihrt leaders
- **Reviewer:** Core, Frontend 2

### RPT-006
**Report Generation UI**

- **Description:** Build report generation and viewing interface in `apps/admin`. Report period selection, generation trigger, report display.
- **Lane:** Frontend 2
- **Priority:** Medium
- **Dependencies:** RPT-002, RPT-003
- **Deliverable:** Report pages + component tests
- **Acceptance Criteria:**
  - Report period selector (Weekly/Monthly/Quarterly/Annual)
  - Report generation trigger
  - Report display with tables and charts
  - Export capability (PDF or print)
  - RBAC enforced
- **Reviewer:** Core, Frontend 2

### RPT-007
**Reporting Integration Tests**

- **Description:** Write integration tests covering report generation, submission, and retrieval workflows.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** RPT-001, RPT-002, RPT-003
- **Deliverable:** Integration test suite
- **Acceptance Criteria:**
  - Report generation tested
  - Sub-department submission tested
  - Report retrieval tested
  - RBAC enforced on all endpoints
  - Aggregation accuracy verified
- **Reviewer:** Core

### RPT-008
**OpenAPI Reporting Documentation**

- **Description:** Update Swagger/OpenAPI specification with reporting endpoint documentation.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** RPT-002, RPT-003
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - All reporting endpoints documented
  - Report schema defined
  - Error responses documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- RPT-002 and RPT-003 (independent endpoints)
- RPT-004 and RPT-005 (independent dashboards)
- RPT-008 (documentation)

**Must happen sequentially:**
- RPT-002 depends on RPT-001
- RPT-003 depends on RPT-002
- RPT-004 and RPT-005 depend on RPT-002

---

## Deliverables

1. Report aggregation engine
2. Report generation and retrieval API
3. Sub-department submission API
4. Executive dashboard (Chairperson)
5. Sub-department dashboards
6. Report generation and viewing UI
7. Integration test suite
8. OpenAPI documentation

---

## Exit Criteria

- [ ] Weekly, Monthly, Quarterly, Annual reports generate correctly
- [ ] Sub-department submissions work
- [ ] Executive dashboard displays cross-departmental overview
- [ ] Sub-department dashboards scoped correctly (RBAC)
- [ ] Performance metrics calculated accurately
- [ ] Report generation UI functional
- [ ] All integration tests pass
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
