# Phase 6 — Operational Tracking

## Objective

Implement the operational tracking system: attendance management, Saturday transport logistics, academic tracking (Timihrt), and event scheduling. This phase covers the day-to-day ministry operations.

## Scope

### Included
- Program session management (Saturday, Sunday, Special, Extra Training)
- Attendance auto-seeding (ADR-0002)
- Attendance verification (Present/Absent/Excused)
- Saturday chaperone route roster (5 locations)
- Academic assessments and scoring (Timihrt)
- Event creation and program assignment
- Multi-member assignment rule (≥2 members, BR-014)

### Out of Scope
- Reports and analytics (Phase 7)
- Planning (Phase 5 — already complete)
- Telegram notifications (Phase 8)

---

## Dependencies

- Phase 3 complete (organization structure)
- Phase 4 complete (children, parents)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Auto-seeding logic, multi-member validation, session API, event API |
| Israel | Backend Support | SUPPORT — Academic assessment API, event attendance, tests |
| Eyob | Frontend Developer | PRIMARY — Attendance checksheets UI, transport dispatcher UI |
| TBD | Frontend Developer | PRIMARY — Event management UI, academic score entry UI |

---

## Tasks

### OPS-001
**Attendance API: Session Management**

- **Description:** Implement `POST /api/v1/attendance/sessions`, `GET /api/v1/attendance/sessions`. Create and list program sessions (Saturday Regular, Sunday Regular, Special Event, Extra Training).
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** FND-004, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Session creation with type, date, time
  - Session list with filtering
  - Session types constrained per FR-06.1
  - RBAC enforced
- **Reviewer:** Core

### OPS-002
**Attendance API: Auto-Seeding**

- **Description:** Implement `POST /api/v1/attendance/sessions/:id/seed`. When members/children are assigned to a session, automatically create attendance rows with status `Expected` per ADR-0002 and BR-020.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** OPS-001
- **Deliverable:** Auto-seeding logic + integration test
- **Acceptance Criteria:**
  - Auto-creates `Expected` attendance rows for all assigned members/children
  - Handles both member and child attendance (person_type)
  - Idempotent (running twice doesn't duplicate)
  - Integration test verifies auto-seeding
- **Reviewer:** Core

### OPS-003
**Attendance API: Verification & Batch Confirm**

- **Description:** Implement `PUT /api/v1/attendance/sessions/:id/records`, `PUT /api/v1/attendance/records/:id`. Kutitr officials update attendance status to Present/Absent/Excused.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** OPS-002
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Single record update (status, recorded_by, confirmed_at)
  - Batch update for entire session
  - Status constrained to Present/Absent/Excused
  - RBAC: Kutitr leaders can update all, others limited
- **Reviewer:** Core

### OPS-004
**Transport Route Assignment API**

- **Description:** Implement `POST /api/v1/attendance/transport-assignment`. Kutitr assigns at least 2 members per collection location per BR-014 and BR-022.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** OPS-001
- **Deliverable:** Endpoint + integration tests
- **Acceptance Criteria:**
  - Assign members to 5 collection routes
  - Enforce ≥2 members per route (BR-014)
  - RBAC: Kutitr exclusive authority (BR-022)
  - Integration test verifies multi-member constraint
- **Reviewer:** Core

### OPS-005
**Academic Assessment API**

- **Description:** Implement academic endpoints: `POST /api/v1/academic/assessments`, `POST /api/v1/academic/scores`, `GET /api/v1/academic/scores`. Timihrt records Mid/Final exam scores per FR-07.1.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** FND-005, MBR-001
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Assessment creation (type, subject, max_score, period)
  - Score recording (child, score, recorded_by)
  - Score query by assessment or child
  - RBAC: Timihrt leaders manage assessments
- **Reviewer:** Core, Backend

### OPS-006
**Event API: Creation & Program Assignment**

- **Description:** Implement event endpoints: `POST /api/v1/events`, `GET /api/v1/events`, `POST /api/v1/events/:id/assign-program`. Event creation with sub-department program assignment per FR-09.1.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** FND-004, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Event creation (name, type, date, published status)
  - Program assignment to sub-departments
  - ≥2 members per program (BR-014)
  - Event types: Special, Extra_Training, Awdemerit, Adar
  - Integration tests verify multi-member rule
- **Reviewer:** Core

### OPS-007
**Event Attendance API**

- **Description:** Implement `POST /api/v1/events/:id/attendance`, `PUT /api/v1/events/:id/attendance/:id`. Event attendance recording per ADR-0001 (separate from regular attendance).
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** OPS-006
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Event attendance creation
  - Attendance status update
  - Separate from regular session attendance (ADR-0001)
  - RBAC enforced
- **Reviewer:** Core, Backend

### OPS-008
**Attendance Checksheets UI**

- **Description:** Build attendance checksheets in `apps/admin` for Kutitr officials. Mobile-optimized interface for Saturday morning attendance confirmation per FR-06.3.
- **Lane:** Frontend 2
- **Priority:** Critical
- **Dependencies:** OPS-002, OPS-003
- **Deliverable:** Attendance checksheet + Playwright mobile test
- **Acceptance Criteria:**
  - Session selection dropdown
  - Member/child list with status toggles (Present/Absent/Excused)
  - Batch save capability
  - Mobile-optimized (touch-friendly)
  - Loading/saving states
  - Works on Saturday morning (7:30 AM)
- **Reviewer:** Core, Frontend 2

### OPS-009
**Transport Dispatcher UI**

- **Description:** Build the Saturday transport route dispatcher in `apps/admin`. Assign members to 5 collection locations with ≥2 members per route.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** OPS-004
- **Deliverable:** Transport dispatcher + component tests
- **Acceptance Criteria:**
  - 5 route columns (Apartama, Gende Boy, Gende Je, Cobalt, Bate)
  - Drag-and-drop or multi-select member assignment
  - Minimum 2 members per route indicator
  - Mobile-responsive
- **Reviewer:** Core, Frontend 2

### OPS-010
**Event Management UI**

- **Description:** Build event creation and management interface in `apps/admin`. Event list, creation form, program assignment.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** OPS-006
- **Deliverable:** Event management pages + component tests
- **Acceptance Criteria:**
  - Event list with filtering by type
  - Event creation form
  - Program assignment interface
  - Multi-member selection for programs
  - Published/draft status toggle
- **Reviewer:** Core, Frontend 2

### OPS-011
**Academic Score Entry UI**

- **Description:** Build the Timihrt gradebook interface in `apps/admin`. Score entry for assessments, student score view.
- **Lane:** Frontend 2
- **Priority:** Medium
- **Dependencies:** OPS-005
- **Deliverable:** Gradebook page + component tests
- **Acceptance Criteria:**
  - Assessment list
  - Score entry form (student, score)
  - Score summary per assessment
  - Kutr 1 vs Kutr 2 breakdown
  - RBAC: Timihrt leaders only
- **Reviewer:** Core, Frontend 2

### OPS-012
**Operational Integration Tests**

- **Description:** Write integration tests covering attendance lifecycle: session creation → auto-seeding → verification → batch confirm. Also test transport assignment and event creation.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** OPS-001 through OPS-006
- **Deliverable:** Integration test suite
- **Acceptance Criteria:**
  - Attendance lifecycle tested
  - BR-020 auto-seeding verified
  - BR-014 multi-member constraint verified
  - BR-022 Kutitr authority verified
  - ADR-0001 separate tables verified
  - Event creation and assignment tested
- **Reviewer:** Core

### OPS-013
**OpenAPI Operations Documentation**

- **Description:** Update Swagger/OpenAPI specification with attendance, transport, academic, and event endpoint documentation.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** OPS-001 through OPS-006
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - All operational endpoints documented
  - Auto-seeding behavior documented
  - Multi-member constraint documented
  - Error responses documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- OPS-001 and OPS-005 (independent session and academic endpoints)
- OPS-006 (event creation) alongside OPS-001
- OPS-008 and OPS-010 (independent UI pages)

**Must happen sequentially:**
- OPS-002 depends on OPS-001
- OPS-003 depends on OPS-002
- OPS-004 depends on OPS-001
- OPS-008 depends on OPS-002, OPS-003

---

## Deliverables

1. Session management API
2. Attendance auto-seeding logic
3. Attendance verification API
4. Transport route assignment API
5. Academic assessment and scoring API
6. Event creation and program assignment API
7. Event attendance API
8. Attendance checksheets UI
9. Transport dispatcher UI
10. Event management UI
11. Academic score entry UI
12. Integration test suite
13. OpenAPI documentation

---

## Exit Criteria

- [ ] Attendance auto-seeding works (ADR-0002, BR-020)
- [ ] Attendance verification works (Present/Absent/Excused)
- [ ] Transport routes enforce ≥2 members (BR-014)
- [ ] Kutitr has exclusive transport authority (BR-022)
- [ ] Academic scoring works for Timihrt
- [ ] Event creation and program assignment works
- [ ] Separate attendance tables per ADR-0001
- [ ] Attendance checksheets work on mobile
- [ ] Transport dispatcher works
- [ ] Event management UI works
- [ ] All integration tests pass
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
