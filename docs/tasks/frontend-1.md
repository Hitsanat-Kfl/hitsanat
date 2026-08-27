# Frontend Developer 1 Tasks — Eyob

## Role: Frontend Developer 1
**Total Tasks:** 12

---

# Phase 2 — Authentication & Authorization

---

## FE1-001 — Auth Layout & Navigation Shell

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-02-authentication-authorization.md`
- Original item: AUTH-005 (partial), AUTH-006 (partial)

### 3. Primary Owner
- **Name:** Eyob
- **Role:** Frontend Developer 1
- **Lane:** Frontend 1

### 4. Supporting Contributors
None

### 5. Task Objective
Build the admin app's navigation shell, sidebar, header, and route structure.

### 6. Why This Task Exists
The navigation shell provides consistent navigation across all admin pages and establishes the layout foundation.

### 7. Documentation References

#### Requirements
- `docs/requirements/roles-and-permissions.md` — Role-based navigation
- `docs/architecture/system-architecture.md` — Admin app architecture

#### ADR
- `docs/adr/ADR-0007.md` — Regular Members Restricted (non-leaders see limited nav)

### 8. Repository References

#### Files/Directories to Read
- `apps/admin/src/` — Admin app structure
- `packages/ui/src/` — Existing UI components
- `docs/ui/layout.md` — Layout specification

#### Files/Directories Expected to Change
- `apps/admin/src/app/(authenticated)/layout.tsx` — CREATE or MODIFY
- `apps/admin/src/components/navigation/` — CREATE

### 9. Related Code
- Existing: `apps/admin/src/app/` — App router structure
- Reference: `packages/ui/src/` — UI component patterns

### 10. Expected Implementation
Create a responsive layout shell with: sidebar navigation (role-aware), header with user info, main content area, mobile hamburger menu. Navigation items filtered by user role (Chairperson sees all, leaders see own sub-dept).

### 11. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/layout.tsx` | CREATE | Authenticated layout |
| `apps/admin/src/components/navigation/Sidebar.tsx` | CREATE | Sidebar navigation |
| `apps/admin/src/components/navigation/Header.tsx` | CREATE | Header with user info |
| `apps/admin/src/components/navigation/NavItems.tsx` | CREATE | Role-based nav items |

### 12. Documentation Updates
N/A

### 13. Testing Requirements
- Component test: Navigation renders correctly
- Component test: Role-based filtering works
- Visual test: Responsive layout

### 14. Acceptance Criteria
- [ ] Sidebar navigation renders with correct items
- [ ] Navigation filtered by user role
- [ ] Header shows user name and role
- [ ] Mobile responsive (hamburger menu)
- [ ] Accessible (WCAG 2.1 AA)

### 15. Definition of Done
- [ ] Implementation complete
- [ ] Component tests pass
- [ ] Biome passes
- [ ] TypeScript compiles
- [ ] PR created
- [ ] Review completed
- [ ] `pnpm prepare` passes

### 16. Reviewer
Core (Abrham)

### 17. Git Branch
`feature/fe1-001-auth-layout-navigation`

---

## FE1-002 — Admin Login Page

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Original item: AUTH-005

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the admin login page with email/password form.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — Auth requirements
- `docs/api/endpoints.md` — Auth endpoints

### 6. Repository References
- `apps/admin/src/app/(unauthenticated)/login/` — CREATE
- `apps/admin/src/lib/auth.ts` — Auth client helpers

### 7. Acceptance Criteria
- [ ] Login form with email and password fields
- [ ] Error message display on invalid credentials
- [ ] Redirect to dashboard on successful login
- [ ] Loading state during authentication
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Mobile-responsive

### 8. Git Branch
`feature/fe1-002-admin-login`

---

# Phase 3 — Organization Structure

---

## FE1-003 — Member List Page

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-007 (partial)

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the paginated member list page with search and filtering.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-01.3, FR-01.4
- `docs/api/endpoints.md` — Members endpoint

### 6. Repository References
- `apps/admin/src/app/(authenticated)/members/` — CREATE
- `apps/admin/src/components/members/` — CREATE

### 7. Related Code
- Existing: `packages/ui/src/` — Table, Pagination components

### 8. Expected Implementation
Create a data table with: columns (Name, Phone, Sub-Departments, Status), search by name/phone, filter by sub-department, pagination, row click navigates to detail.

### 9. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/members/page.tsx` | CREATE | Member list page |
| `apps/admin/src/components/members/MemberTable.tsx` | CREATE | Data table |
| `apps/admin/src/components/members/MemberFilters.tsx` | CREATE | Search & filters |

### 10. Acceptance Criteria
- [ ] Paginated member list
- [ ] Search by name or phone
- [ ] Filter by sub-department
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Mobile-responsive

### 11. Git Branch
`feature/fe1-003-member-list`

---

## FE1-004 — Member Detail Page

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-007 (partial)

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the member detail view with profile, sub-departments, and family.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-01.4
- `docs/api/endpoints.md` — Member detail endpoint

### 6. Repository References
- `apps/admin/src/app/(authenticated)/members/[id]/` — CREATE

### 7. Acceptance Criteria
- [ ] Member profile display (name, phone, photo, etc.)
- [ ] Sub-department assignments listed
- [ ] Family members listed
- [ ] Edit button for authorized users
- [ ] Back navigation to list

### 8. Git Branch
`feature/fe1-004-member-detail`

---

## FE1-005 — Sub-Department Roster View

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-005 (partial)

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the sub-department roster view showing members per department.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-03.2
- `docs/api/endpoints.md` — Sub-departments endpoint

### 6. Repository References
- `apps/admin/src/app/(authenticated)/sub-departments/` — CREATE

### 7. Acceptance Criteria
- [ ] List of 5 sub-departments
- [ ] Click to view roster
- [ ] Roster shows members with scoped roles
- [ ] RBAC enforced (leaders see only own)

### 8. Git Branch
`feature/fe1-005-subdepartment-roster`

---

# Phase 5 — Planning

---

## FE1-006 — Planning Matrix UI

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-007

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the interactive planning matrix displaying 25 activities with weights and quarterly distribution.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-08.2, FR-08.3
- `docs/planning/progress-tracking.md`

### 6. Repository References
- `apps/admin/src/app/(authenticated)/planning/` — CREATE
- `apps/admin/src/components/planning/` — CREATE

### 7. Related Code
- Reference: `packages/domain/src/planning/` — Weight calculation

### 8. Expected Implementation
Create an interactive table with: 25 activities from Action PLN.xlsx, weight percentage with visual bars, quarterly distribution columns (Q1-Q4), Budget/People/Time columns, inline editing for Ekd users.

### 9. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/planning/page.tsx` | CREATE | Planning matrix page |
| `apps/admin/src/components/planning/PlanningMatrix.tsx` | CREATE | Interactive matrix |
| `apps/admin/src/components/planning/WeightBar.tsx` | CREATE | Weight visualization |
| `apps/admin/src/components/planning/QuarterlyDistribution.tsx` | CREATE | Q1-Q4 columns |

### 10. Acceptance Criteria
- [ ] Interactive table with 25 activities
- [ ] Weight percentage displayed with visual bars
- [ ] Quarterly distribution columns (Q1-Q4)
- [ ] Budget, People, Time columns
- [ ] Edit capability for authorized users (Ekd)
- [ ] Responsive layout
- [ ] Weight sum verification (100.00%)

### 11. Git Branch
`feature/fe1-006-planning-matrix`

---

# Phase 6 — Operational Tracking

---

## FE1-007 — Attendance Checksheets UI

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-008

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build mobile-optimized attendance checksheets for Saturday morning attendance confirmation.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-06.3
- `docs/requirements/business-rules.md` — BR-020

### 6. Repository References
- `apps/admin/src/app/(authenticated)/attendance/` — CREATE
- `apps/admin/src/components/attendance/` — CREATE

### 7. Related Code
- Reference: `packages/ui/src/` — Touch-friendly components

### 8. Expected Implementation
Create a mobile-first checksheet with: session selector, member/child list with status toggles (Present/Absent/Excused), batch save, loading states, works on Saturday 7:30 AM.

### 9. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/attendance/page.tsx` | CREATE | Attendance page |
| `apps/admin/src/components/attendance/Checksheet.tsx` | CREATE | Mobile checksheet |
| `apps/admin/src/components/attendance/StatusToggle.tsx` | CREATE | Present/Absent/Excused |

### 10. Acceptance Criteria
- [ ] Session selection dropdown
- [ ] Member/child list with status toggles
- [ ] Batch save capability
- [ ] Mobile-optimized (touch-friendly)
- [ ] Loading/saving states
- [ ] Works on Saturday morning (7:30 AM)

### 11. Git Branch
`feature/fe1-007-attendance-checksheets`

---

## FE1-008 — Transport Dispatcher UI

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-009

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the Saturday transport route dispatcher with 5 collection locations.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-06.2
- `docs/requirements/business-rules.md` — BR-014, BR-022

### 6. Repository References
- `apps/admin/src/app/(authenticated)/transport/` — CREATE
- `apps/admin/src/components/transport/` — CREATE

### 7. Expected Implementation
Create a dispatcher with: 5 route columns (Apartama, Gende Boy, Gende Je, Cobalt, Bate), drag-and-drop or multi-select member assignment, minimum 2 members per route indicator, mobile-responsive.

### 8. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/transport/page.tsx` | CREATE | Transport page |
| `apps/admin/src/components/transport/RouteColumn.tsx` | CREATE | Route column |
| `apps/admin/src/components/transport/MemberAssigner.tsx` | CREATE | Member assignment |

### 9. Acceptance Criteria
- [ ] 5 route columns (Apartama, Gende Boy, Gende Je, Cobalt, Bate)
- [ ] Drag-and-drop or multi-select member assignment
- [ ] Minimum 2 members per route indicator
- [ ] Mobile-responsive
- [ ] RBAC: Kutitr exclusive authority

### 10. Git Branch
`feature/fe1-008-transport-dispatcher`

---

# Phase 7 — Reporting & Dashboard

---

## FE1-009 — Executive Dashboard (Chairperson)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-004

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the Chairperson executive dashboard with cross-departmental visibility.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-10.3, FR-10.4
- `docs/api/endpoints.md` — Reports endpoint

### 6. Repository References
- `apps/admin/src/app/(authenticated)/dashboard/` — CREATE
- `apps/admin/src/components/dashboard/` — CREATE

### 7. Related Code
- Reference: `packages/ui/src/` — Card, Chart components

### 8. Expected Implementation
Create an executive dashboard with: overall progress summary, sub-department status cards, planning completion percentage, attendance summary, key KPI widgets, charts for trends.

### 9. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/dashboard/page.tsx` | CREATE | Executive dashboard |
| `apps/admin/src/components/dashboard/ProgressSummary.tsx` | CREATE | Overall progress |
| `apps/admin/src/components/dashboard/SubDeptCard.tsx` | CREATE | Department status cards |
| `apps/admin/src/components/dashboard/KPIWidget.tsx` | CREATE | KPI widgets |

### 10. Acceptance Criteria
- [ ] Overall progress summary
- [ ] Sub-department status cards
- [ ] Planning completion percentage
- [ ] Attendance summary
- [ ] Key KPI widgets
- [ ] Cross-departmental visibility (RBAC: Chairperson)
- [ ] Responsive layout

### 11. Git Branch
`feature/fe1-009-executive-dashboard`

---

## FE1-010 — Report Generation UI

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-006

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build report generation and viewing interface with period selection.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-10.2

### 6. Repository References
- `apps/admin/src/app/(authenticated)/reports/` — CREATE

### 7. Acceptance Criteria
- [ ] Report period selector (Weekly/Monthly/Quarterly/Annual)
- [ ] Report generation trigger
- [ ] Report display with tables and charts
- [ ] Export capability (PDF or print)
- [ ] RBAC enforced

### 8. Git Branch
`feature/fe1-010-report-generation`

---

# Phase 8 — Portfolio & Public Features

---

## FE1-011 — Portfolio Public Site

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-001

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Build the public portfolio site for `hitsanatkifl.org`.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-11.1 through FR-11.4
- `docs/architecture/system-architecture.md` — Portfolio app

### 6. Repository References
- `apps/portfolio/src/` — Portfolio app
- `docs/ui/portfolio-design.md` — Design specification

### 7. Related Code
- Reference: `apps/portfolio/` — Existing app structure

### 8. Expected Implementation
Create a public site with: hero section, mission statement, stats counters, sub-department cards, latest events, event countdowns, recent announcements, mobile-responsive.

### 9. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/portfolio/src/app/page.tsx` | MODIFY | Home page |
| `apps/portfolio/src/components/Hero.tsx` | CREATE | Hero section |
| `apps/portfolio/src/components/StatsCounters.tsx` | CREATE | Stats display |
| `apps/portfolio/src/components/EventCountdown.tsx` | CREATE | Event countdowns |
| `apps/portfolio/src/components/Announcements.tsx` | CREATE | Recent announcements |

### 10. Acceptance Criteria
- [ ] Hero section with mission statement
- [ ] Stats counters (animated)
- [ ] Sub-department cards
- [ ] Latest events with countdowns
- [ ] Recent announcements
- [ ] Mobile-responsive
- [ ] SEO optimized

### 11. Git Branch
`feature/fe1-011-portfolio-public`

---

## FE1-012 — Portfolio E2E Tests

### 1. Phase
Phase 8 — Portfolio & Public Features

### 2. Source Implementation Plan
- Original item: PTF-011

### 3. Primary Owner
- **Name:** Eyob
- **Lane:** Frontend 1

### 4. Task Objective
Write Playwright E2E tests for public portfolio pages.

### 5. Documentation References
- `docs/testing/e2e.md`

### 6. Repository References
- `tests/e2e/` — E2E test directory

### 7. Acceptance Criteria
- [ ] Home page loads
- [ ] Stats display correctly
- [ ] Events section renders
- [ ] Announcements section renders
- [ ] Mobile viewport works
- [ ] Performance benchmarks met

### 8. Git Branch
`feature/fe1-012-portfolio-e2e`
