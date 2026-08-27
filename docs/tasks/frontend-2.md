# Frontend Developer 2 Tasks — TBD

## Role: Frontend Developer 2
**Total Tasks:** 10

---

# Phase 2 — Authentication & Authorization

---

## FE2-001 — Admin Route Guards

### 1. Phase
Phase 2 — Authentication & Authorization

### 2. Source Implementation Plan
- Implementation Plan: `docs/implementation-plan/phase-02-authentication-authorization.md`
- Original item: AUTH-006

### 3. Primary Owner
- **Name:** TBD
- **Role:** Frontend Developer 2
- **Lane:** Frontend 2

### 4. Supporting Contributors
None

### 5. Task Objective
Implement protected route wrapper that redirects unauthenticated users and enforces role-based access.

### 6. Why This Task Exists
Route guards protect admin pages from unauthorized access and enforce ADR-0007 (non-leader lockout).

### 7. Documentation References

#### Requirements
- `docs/requirements/roles-and-permissions.md` — RBAC matrix
- `docs/requirements/business-rules.md` — BR-033 (non-leader lockout)

#### ADR
- `docs/adr/ADR-0007.md` — Regular Members Restricted

### 8. Repository References

#### Files/Directories to Read
- `apps/admin/src/` — App router structure
- `packages/auth/` — Auth client

#### Files/Directories Expected to Change
- `apps/admin/src/components/auth/RouteGuard.tsx` — CREATE
- `apps/admin/src/app/(authenticated)/layout.tsx` — MODIFY

### 9. Related Code
- Existing: `apps/admin/src/app/` — App router
- Reference: `packages/permissions/` — Role constants

### 10. Expected Implementation
Create a RouteGuard component that: checks session on navigation, redirects to login if unauthenticated, denies access to non-leadership members (ADR-0007), refreshes session on navigation.

### 11. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/components/auth/RouteGuard.tsx` | CREATE | Route guard component |
| `apps/admin/src/app/(authenticated)/layout.tsx` | MODIFY | Wrap with RouteGuard |

### 12. Acceptance Criteria
- [ ] Unauthenticated users redirected to login
- [ ] Authenticated users with no leadership role denied access (ADR-0007)
- [ ] Session refresh on navigation
- [ ] E2E test verifies guard behavior

### 13. Definition of Done
- [ ] Implementation complete
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Biome passes
- [ ] TypeScript compiles
- [ ] PR created
- [ ] Review completed
- [ ] `pnpm prepare` passes

### 14. Reviewer
Core (Abrham)

### 15. Git Branch
`feature/fe2-001-route-guards`

---

# Phase 3 — Organization Structure

---

## FE2-002 — Member Registration Wizard UI

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-006

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build the 2-stage member registration wizard.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-01.1, FR-01.2
- `docs/requirements/business-rules.md` — BR-001, BR-002

### 6. Repository References
- `apps/admin/src/app/(authenticated)/members/register/` — CREATE
- `apps/admin/src/components/members/` — CREATE

### 7. Related Code
- Reference: `packages/validation/` — Zod schemas

### 8. Expected Implementation
Create a 2-stage wizard: Stage 1 modal with mandatory fields (FullName, ChristianName, Phone, YearOfStudy, Department, Campus, Gender), Stage 2 with multi-dept allocation, family assignment, photo upload. Form validation via React Hook Form + Zod.

### 9. Expected File Changes

| File | Action | Purpose |
|---|---|---|
| `apps/admin/src/app/(authenticated)/members/register/page.tsx` | CREATE | Registration page |
| `apps/admin/src/components/members/RegistrationWizard.tsx` | CREATE | 2-stage wizard |
| `apps/admin/src/components/members/Stage1Form.tsx` | CREATE | Stage 1 form |
| `apps/admin/src/components/members/Stage2Form.tsx` | CREATE | Stage 2 form |

### 10. Acceptance Criteria
- [ ] Stage 1 modal with all mandatory fields
- [ ] Form validation (Zod via React Hook Form)
- [ ] Stage 2 multi-department selection
- [ ] Family allocation dropdown
- [ ] Photo upload field
- [ ] Success/error feedback
- [ ] Mobile-responsive

### 11. Git Branch
`feature/fe2-002-member-registration-wizard`

---

## FE2-003 — Member Edit Form

### 1. Phase
Phase 3 — Organization Structure

### 2. Source Implementation Plan
- Original item: ORG-007 (partial)

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build the member edit form for authorized users.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-01.4

### 6. Repository References
- `apps/admin/src/app/(authenticated)/members/[id]/edit/` — CREATE

### 7. Acceptance Criteria
- [ ] Pre-populated form with current member data
- [ ] All editable fields per role
- [ ] Form validation
- [ ] Save/cancel buttons
- [ ] Optimistic UI update

### 8. Git Branch
`feature/fe2-003-member-edit`

---

# Phase 4 — Member Management

---

## FE2-004 — Child Registration Form

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-004

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build the child registration form with Kutr classification and collection routes.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-04.1
- `docs/requirements/business-rules.md` — BR-012, BR-013

### 6. Repository References
- `apps/admin/src/app/(authenticated)/children/register/` — CREATE

### 7. Acceptance Criteria
- [ ] Form with all child registration fields
- [ ] Kutr group radio selection (Kutr 1 / Kutr 2)
- [ ] Collection location dropdown (5 routes)
- [ ] Photo upload field
- [ ] Form validation (Zod)
- [ ] Success/error feedback
- [ ] Mobile-responsive

### 8. Git Branch
`feature/fe2-004-child-registration`

---

## FE2-005 — Parent Linking Dialog

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-005

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build parent linking dialog to link/unlink parents to children.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-05.2
- `docs/requirements/business-rules.md` — BR-010

### 6. Repository References
- `apps/admin/src/components/children/ParentLinkingDialog.tsx` — CREATE

### 7. Acceptance Criteria
- [ ] Dialog to link parent to child
- [ ] Relation type selection (Father/Mother)
- [ ] Duplicate prevention feedback
- [ ] Unlink capability
- [ ] Current parent links displayed

### 8. Git Branch
`feature/fe2-005-parent-linking`

---

## FE2-006 — Child List & Detail UI

### 1. Phase
Phase 4 — Member Management

### 2. Source Implementation Plan
- Original item: MBR-006

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build child list page and detail view with filtering.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-04.2, FR-04.3

### 6. Repository References
- `apps/admin/src/app/(authenticated)/children/` — CREATE

### 7. Acceptance Criteria
- [ ] Paginated child list
- [ ] Filter by Kutr group
- [ ] Filter by collection location
- [ ] Child detail shows profile, parents, group
- [ ] Birthday milestone indicator

### 8. Git Branch
`feature/fe2-006-child-list-detail`

---

# Phase 5 — Planning

---

## FE2-007 — Sub-Department Plan Execution UI

### 1. Phase
Phase 5 — Planning

### 2. Source Implementation Plan
- Original item: PLN-008

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build the sub-department plan execution view with weekly tasks and progress recording.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-08.4, FR-08.5
- `docs/requirements/business-rules.md` — BR-032

### 6. Repository References
- `apps/admin/src/app/(authenticated)/planning/execution/` — CREATE

### 7. Acceptance Criteria
- [ ] Shows activities distributed to user's sub-department
- [ ] Weekly task list
- [ ] Progress recording form (actual result, status, challenges)
- [ ] Roll-up progress indicator
- [ ] Scoped to user's sub-department (RBAC)

### 8. Git Branch
`feature/fe2-007-plan-execution`

---

# Phase 6 — Operational Tracking

---

## FE2-008 — Event Management UI

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-010

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build event creation and management interface.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-09.1, FR-09.2
- `docs/requirements/business-rules.md` — BR-014

### 6. Repository References
- `apps/admin/src/app/(authenticated)/events/` — CREATE

### 7. Acceptance Criteria
- [ ] Event list with filtering by type
- [ ] Event creation form
- [ ] Program assignment interface
- [ ] Multi-member selection for programs
- [ ] Published/draft status toggle

### 8. Git Branch
`feature/fe2-008-event-management`

---

## FE2-009 — Academic Score Entry UI

### 1. Phase
Phase 6 — Operational Tracking

### 2. Source Implementation Plan
- Original item: OPS-011

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build the Timihrt gradebook interface for score entry.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-07.1, FR-07.2, FR-07.3

### 6. Repository References
- `apps/admin/src/app/(authenticated)/academic/` — CREATE

### 7. Acceptance Criteria
- [ ] Assessment list
- [ ] Score entry form (student, score)
- [ ] Score summary per assessment
- [ ] Kutr 1 vs Kutr 2 breakdown
- [ ] RBAC: Timihrt leaders only

### 8. Git Branch
`feature/fe2-009-academic-score-entry`

---

# Phase 7 — Reporting & Dashboard

---

## FE2-010 — Sub-Department Dashboard

### 1. Phase
Phase 7 — Reporting & Dashboard

### 2. Source Implementation Plan
- Original item: RPT-005

### 3. Primary Owner
- **Name:** TBD
- **Lane:** Frontend 2

### 4. Task Objective
Build sub-department scoped dashboards showing only department-specific data.

### 5. Documentation References
- `docs/requirements/functional-requirements.md` — FR-03.2, FR-10.4
- `docs/requirements/business-rules.md` — RBAC scoping

### 6. Repository References
- `apps/admin/src/app/(authenticated)/dashboard/sub-department/` — CREATE

### 7. Acceptance Criteria
- [ ] Scoped to user's sub-department (RBAC)
- [ ] Department-specific KPIs
- [ ] Progress tracking for distributed activities
- [ ] Attendance summary for department
- [ ] Academic scores for Timihrt leaders

### 8. Git Branch
`feature/fe2-010-subdepartment-dashboard`
