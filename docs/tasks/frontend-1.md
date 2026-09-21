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
Create a responsive layout shell with: sidebar navigation (role-aware), header with user info, main content area, mobile hamburger menu. Navigation items filtered by user role (Chairperson sees all, leaders see own sub-dept). The sidebar includes 5 sections: Main, Ministry, Programs, Administration (Super Admin only), Operations.

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
- [ ] Administration section (User Accounts, Audit Logs, Permissions) visible only to Super Admin

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
- [ ] RBAC: Chairperson, Sub-Chairperson, and Secretary can create meetings

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
- [ ] RBAC: Chairperson, Sub-Chairperson, and Secretary can create meetings

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
Create an executive dashboard with: overall progress summary, sub-department status cards, planning completion percentage, attendance summary, key KPI widgets, charts for trends. Note: The `DashboardRouter` component routes users to role-specific dashboards (Super Admin, Chairperson, Vice-Chairperson, Secretary, Mezmur).

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
- [ ] Dashboard routes to correct role-specific page
- [ ] RBAC: Chairperson, Sub-Chairperson, and Secretary can create meetings

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
- [ ] RBAC: Chairperson, Sub-Chairperson, and Secretary can create meetings

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

---

## FE1-013 — Leadership Meeting Scheduler

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Meeting Scheduler

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build the Meeting Scheduler feature for the Chairperson, Sub-Chairperson, and Secretary dashboards to schedule leadership meetings with automated reminders, attendance tracking, and minutes storage.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-13.1.1 to FR-13.1.6
- `docs/requirements/business-rules.md` — BR-019
- `docs/api/endpoints.md` — Meetings endpoints
- `docs/database/entities.md` — Meeting tables

### 6. Repository References
- `apps/admin/src/app/(authenticated)/chairperson/meetings/` — CREATE
- `apps/admin/src/components/meetings/` — CREATE

### 7. Related Code
- Reference: `packages/ui/src/` — Calendar, Modal, Table components

### 8. Expected Implementation
Create a meeting scheduler with: calendar view, meeting creation form, attendance tracking, minutes recording, recurring meetings support, automated reminders via Telegram integration. Accessible to Chairperson, Sub-Chairperson, and Secretary roles.

### 9. Acceptance Criteria
- [ ] Calendar view displays all scheduled meetings
- [ ] Chairperson, Sub-Chairperson, and Secretary can create new meetings with title, date/time, location, agenda, and invitees
- [ ] Automated reminders sent 24h and 1h before meeting
- [ ] Attendance marking functionality (Present, Absent, Excused)
- [ ] Meeting minutes recording with action items
- [ ] Recurring meetings support (Weekly, Bi-Weekly, Monthly)
- [ ] Meeting status management (Scheduled, In Progress, Completed, Cancelled)
- [ ] Mobile responsive design

### 10. Git Branch
`feature/fe1-013-meeting-scheduler`

---

## FE1-014 — Bulk Import/Export (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build bulk import/export functionality for the Secretary dashboard to import members, children, and parents via CSV/Excel files and export data as CSV.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.1
- `docs/api/endpoints.md` — Bulk Import endpoints
- `docs/database/entities.md` — bulk_import_jobs table

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/bulk-import-export.tsx` — CREATE

### 7. Expected Implementation
Create a bulk import/export component with: file upload (CSV/Excel), import progress tracking, error reporting, CSV export buttons for members, children, parents.

### 8. Acceptance Criteria
- [ ] CSV/Excel file upload with drag-and-drop
- [ ] Import progress indicator
- [ ] Error reporting for invalid rows/duplicates
- [ ] CSV export for members, children, parents
- [ ] Import job history display

### 9. Git Branch
`feature/fe1-014-bulk-import-export`

---

## FE1-015 — Birthday & Anniversary Tracker (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a birthday and anniversary tracker for the Secretary dashboard showing children's birthdays by month and member service anniversaries.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.2
- `docs/api/endpoints.md` — Existing children/members endpoints

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/birthday-anniversary.tsx` — CREATE
- `apps/admin/features/secretary-dashboard/hooks/use-birthday-anniversary.ts` — CREATE

### 7. Expected Implementation
Create a birthday/anniversary tracker with: month selector, children birthdays list with age, member anniversaries list with years served, milestone recognition (1, 5, 10, 15, 20+ years).

### 8. Acceptance Criteria
- [ ] Month selector for filtering
- [ ] Children birthdays display with age calculation
- [ ] Member anniversaries display with years served
- [ ] Milestone badges for significant years
- [ ] Empty state when no celebrations

### 9. Git Branch
`feature/fe1-015-birthday-anniversary`

---

## FE1-016 — Member Transfer System (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a member transfer system for the Secretary dashboard to transfer members between sub-departments with documented reason and audit trail.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.3
- `docs/api/endpoints.md` — Member Transfers endpoints
- `docs/database/entities.md` — member_transfers table

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/member-transfer.tsx` — CREATE
- `apps/admin/features/secretary-dashboard/hooks/use-member-transfer.ts` — CREATE

### 7. Expected Implementation
Create a member transfer component with: member search/selection, sub-department dropdowns, reason text field, transfer history list, confirmation dialog.

### 8. Acceptance Criteria
- [ ] Member search and selection
- [ ] From/To sub-department dropdowns
- [ ] Reason text field (required)
- [ ] Transfer confirmation dialog
- [ ] Transfer history list with filters

### 9. Git Branch
`feature/fe1-016-member-transfer`

---

## FE1-017 — Registration Analytics (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build registration analytics for the Secretary dashboard showing trends, demographics, and growth metrics with interactive charts.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.4
- `docs/api/endpoints.md` — Registration Analytics endpoints

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/registration-analytics.tsx` — CREATE
- `apps/admin/features/secretary-dashboard/hooks/use-registration-analytics.ts` — CREATE

### 7. Expected Implementation
Create registration analytics with: line chart for trends over time, pie charts for gender/campus breakdown, bar chart for sub-department distribution, growth metrics cards.

### 8. Acceptance Criteria
- [ ] Line chart showing registration trends
- [ ] Pie charts for demographics (gender, campus, year)
- [ ] Bar chart for sub-department distribution
- [ ] Growth metrics (new vs inactive members)
- [ ] Date range selector for filtering

### 9. Git Branch
`feature/fe1-017-registration-analytics`

---

## FE1-018 — Batch Operations (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build batch operations for the Secretary dashboard to perform bulk updates on members (activate/deactivate, assign to sub-departments).

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.5
- `docs/api/endpoints.md` — Batch Operations endpoints

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/batch-operations.tsx` — CREATE

### 7. Expected Implementation
Create batch operations with: member multi-select, bulk action dropdown (activate, deactivate, assign), confirmation dialog, progress tracking.

### 8. Acceptance Criteria
- [ ] Multi-select member list
- [ ] Bulk action dropdown (activate, deactivate, assign)
- [ ] Confirmation dialog before execution
- [ ] Progress indicator for batch operation
- [ ] Success/error summary after completion

### 9. Git Branch
`feature/fe1-018-batch-operations`

---

## FE1-019 — Data Quality Dashboard (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a data quality dashboard for the Secretary to identify incomplete records, duplicates, and data issues with guided fix workflows.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.6
- `docs/api/endpoints.md` — Data Quality endpoints
- `docs/database/entities.md` — data_quality_checks table

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/data-quality.tsx` — CREATE
- `apps/admin/features/secretary-dashboard/hooks/use-data-quality.ts` — CREATE

### 7. Expected Implementation
Create a data quality dashboard with: issue list (missing fields, duplicates), severity indicators, data completeness scores, resolve button for each issue.

### 8. Acceptance Criteria
- [ ] Issue list with entity type and issue description
- [ ] Severity indicators (warning, error)
- [ ] Data completeness score per field
- [ ] Resolve button to mark issues as fixed
- [ ] Refresh button to re-run quality check

### 9. Git Branch
`feature/fe1-019-data-quality`

---

## FE1-020 — Parent Contact Directory (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a parent contact directory for the Secretary dashboard with search, click-to-call, and linked children view.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.7
- `docs/api/endpoints.md` — Parent Directory endpoints

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/parent-contact-directory.tsx` — CREATE
- `apps/admin/features/secretary-dashboard/hooks/use-parent-directory.ts` — CREATE

### 7. Expected Implementation
Create a parent contact directory with: searchable list, click-to-call button, copy phone number, view linked children, CSV export.

### 8. Acceptance Criteria
- [ ] Searchable parent list
- [ ] Click-to-call functionality
- [ ] Copy phone number button
- [ ] View linked children modal
- [ ] CSV export button

### 9. Git Branch
`feature/fe1-020-parent-directory`

---

## FE1-021 — Family Tree Visualization (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a family tree visualization for the Secretary dashboard showing interactive family connection diagrams.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.8
- `docs/api/endpoints.md` — Family Tree endpoints

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/family-tree.tsx` — CREATE
- `apps/admin/features/secretary-dashboard/hooks/use-family-tree.ts` — CREATE

### 7. Expected Implementation
Create a family tree visualization with: interactive diagram, expand/collapse nodes, click-to-view details, print functionality.

### 8. Acceptance Criteria
- [ ] Interactive family tree diagram
- [ ] Expand/collapse family branches
- [ ] Click to view member/child details
- [ ] Print family tree button
- [ ] Empty state for families without data

### 9. Git Branch
`feature/fe1-021-family-tree`

---

## FE1-022 — Audit Trail Viewer (Secretary)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Secretary Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build an audit trail viewer for the Secretary dashboard showing chronological change log with filters.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-14.9
- `docs/api/endpoints.md` — Secretary Audit Trail endpoints

### 6. Repository References
- `apps/admin/features/secretary-dashboard/components/audit-trail-viewer.tsx` — CREATE

### 7. Expected Implementation
Create an audit trail viewer with: chronological list, filters (action type, date range, actor), expandable rows showing before/after values, pagination.

### 8. Acceptance Criteria
- [ ] Chronological audit log list
- [ ] Filter by action type
- [ ] Filter by date range
- [ ] Filter by actor
- [ ] Expandable rows with before/after values
- [ ] Pagination for large datasets

### 9. Git Branch
`feature/fe1-022-audit-trail-viewer`

---

## FE1-023 — Report Card Generator (Timihrt Leader)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Timihrt Leader Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a report card generator for the Timihrt Leader dashboard to generate individual PDF report cards or batch Excel sheets with student grades, attendance, rank, and average using ministry-branded template and Ethiopian calendar format.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-15.1 to FR-15.5
- `docs/api/endpoints.md` — Report Card Generator endpoints
- `docs/database/entities.md` — report_card_templates, generated_report_cards, report_card_grades, report_card_summary tables

### 6. Repository References
- `apps/admin/features/timihrt-dashboard/components/report-card-generator.tsx` — CREATE
- `apps/admin/features/timihrt-dashboard/hooks/use-report-cards.ts` — CREATE

### 7. Related Code
- Existing: `apps/api/src/modules/academic/` — Grade data
- Existing: `apps/api/src/modules/child/` — Student data
- Reference: `packages/ui/src/` — Button, Card, Select, Table, Dialog components

### 8. Expected Implementation
Create a report card generator with: student/Kutr group selection, academic period selector (Ethiopian calendar), single student PDF generation, batch Excel generation for entire class, report card preview, download/print buttons, ministry-branded template.

### 9. Acceptance Criteria
- [ ] Student selection with search
- [ ] Kutr group selector for batch generation
- [ ] Academic period selector (Mid_Term, Final, Annual)
- [ ] Ethiopian year selector (e.g., 2016/2017 E.C.)
- [ ] Single student PDF report card generation
- [ ] Batch Excel generation for entire class
- [ ] Report card preview before download
- [ ] PDF download and print buttons
- [ ] Ministry-branded template with logo
- [ ] Grades, attendance, rank, and average calculation
- [ ] Teacher comments section

### 10. Git Branch
`feature/fe1-023-report-card-generator`

---

## FE1-024 — Route Performance Dashboard (Kutitr Leader)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Kutitr Leader Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a route performance dashboard for the Kutitr Leader to view statistics per transport route including attendance rates, pickup times, and issues logged.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-16.1
- `docs/api/endpoints.md` — Kutitr Route Performance endpoints
- `docs/database/entities.md` — route_performance_stats, route_issues tables

### 6. Repository References
- `apps/admin/features/kutitr-dashboard/components/route-performance-dashboard.tsx` — CREATE
- `apps/admin/features/kutitr-dashboard/hooks/use-route-performance.ts` — CREATE

### 7. Expected Implementation
Create a route performance dashboard with: route selector, date range filter, attendance rate chart, pickup times display, issues list with severity indicators.

### 8. Acceptance Criteria
- [ ] Route selector (5 collection points)
- [ ] Date range filter
- [ ] Attendance rate display per route
- [ ] Average pickup time display
- [ ] Issues logged count and list
- [ ] Visual charts comparing routes

### 9. Git Branch
`feature/fe1-024-route-performance-dashboard`

---

## FE1-025 — Parent Contact Quick View (Kutitr Leader)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Kutitr Leader Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a parent contact quick view for the Kutitr Leader to access parent phone numbers for children on each route for emergency situations.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-16.2
- `docs/api/endpoints.md` — Parent Contact Quick View endpoints

### 6. Repository References
- `apps/admin/features/kutitr-dashboard/components/parent-contact-quick-view.tsx` — CREATE

### 7. Expected Implementation
Create a parent contact quick view with: route-based parent list, click-to-call buttons, search by child/parent name, emergency highlight.

### 8. Acceptance Criteria
- [ ] Parent list grouped by route
- [ ] Click-to-call functionality
- [ ] Search by child or parent name
- [ ] Phone number display with copy button
- [ ] Emergency highlight for urgent contacts

### 9. Git Branch
`feature/fe1-025-parent-contact-quick-view`

---

## FE1-026 — Emergency Contact Database (Kutitr Leader)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Kutitr Leader Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build an emergency contact database for the Kutitr Leader to view comprehensive emergency contacts for all children including medical conditions and allergies.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-16.3
- `docs/api/endpoints.md` — Emergency Contact Database endpoints

### 6. Repository References
- `apps/admin/features/kutitr-dashboard/components/emergency-contact-database.tsx` — CREATE

### 7. Expected Implementation
Create an emergency contact database with: searchable list, route/collection point filters, child details with parent contacts, medical info display, CSV export.

### 8. Acceptance Criteria
- [ ] Searchable list of all children
- [ ] Filter by route or collection point
- [ ] Parent names and phone numbers display
- [ ] Medical conditions/allergies display
- [ ] Address display
- [ ] CSV export button

### 9. Git Branch
`feature/fe1-026-emergency-contact-database`

---

## FE1-027 — Plan Approval Workflow (Ekd Leader)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Ekd Leader Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a plan approval workflow for the Ekd Leader to submit plan changes for Chairperson approval with status tracking.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-17.1
- `docs/api/endpoints.md` — Ekd Plan Approval Workflow endpoints
- `docs/database/entities.md` — plan_approvals table

### 6. Repository References
- `apps/admin/features/ekd-dashboard/components/plan-approval-workflow.tsx` — CREATE
- `apps/admin/features/ekd-dashboard/hooks/use-plan-approvals.ts` — CREATE

### 7. Expected Implementation
Create a plan approval workflow with: approval request form, status tracking, Chairperson review interface, revision workflow.

### 8. Acceptance Criteria
- [ ] Submit plan change for approval
- [ ] Track approval status (pending, approved, rejected, revision_needed)
- [ ] Chairperson review interface with approve/reject/revision options
- [ ] Review comments display
- [ ] Revision workflow for rejected changes
- [ ] Notification indicators

### 9. Git Branch
`feature/fe1-027-plan-approval-workflow`

---

## FE1-028 — Sub-Department Progress Heatmap (Ekd Leader)

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- New feature: Ekd Leader Dashboard Extensions

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 1

### 4. Task Objective
Build a sub-department progress heatmap for the Ekd Leader to visualize progress across all sub-departments with color-coded indicators.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-17.2
- `docs/api/endpoints.md` — Ekd Progress Heatmap endpoints
- `docs/database/entities.md` — dept_progress_heatmap table

### 6. Repository References
- `apps/admin/features/ekd-dashboard/components/progress-heatmap.tsx` — CREATE
- `apps/admin/features/ekd-dashboard/hooks/use-progress-heatmap.ts` — CREATE

### 7. Expected Implementation
Create a progress heatmap with: color-coded matrix, sub-department rows, goal/activity columns, click-to-view details, progress summary.

### 8. Acceptance Criteria
- [ ] Color-coded matrix (red, orange, yellow, green)
- [ ] Sub-department rows (Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb)
- [ ] Goal/activity columns
- [ ] Click-to-view detailed progress breakdown
- [ ] Progress summary statistics
- [ ] Filter by year and quarter

### 9. Git Branch
`feature/fe1-028-progress-heatmap`
