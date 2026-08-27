# Phase 4 — Member Management (Children & Parents)

## Objective

Implement the children and parent management system: child registration, parent linking with cardinality constraints, sibling association, and the Kutitr transport assignment system.

## Scope

### Included
- Child entity CRUD
- Parent entity CRUD
- Child-parent linking with cardinality constraint (BR-010)
- Sibling association
- Kutr group classification (Kutr 1 / Kutr 2)
- Collection route mapping (5 locations)
- Birthday milestone queries
- API endpoints for children, parents, child-parents

### Out of Scope
- Attendance tracking (Phase 6)
- Academic tracking (Phase 6)
- Planning (Phase 5)
- Member registration (Phase 3)

---

## Dependencies

- Phase 3 complete (organization structure in place)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Schema verification, constraint enforcement, child-parent linking API |
| Israel | Backend Support | SUPPORT — Parent CRUD, validation, tests |
| Eyob | Frontend Developer | PRIMARY — Child registration UI, parent linking UI |
| TBD | Frontend Developer | PRIMARY — Child list, detail pages |

---

## Tasks

### MBR-001
**Child API: Registration & CRUD**

- **Description:** Implement child endpoints: `POST /api/v1/children`, `GET /api/v1/children`, `GET /api/v1/children/:id`, `PUT /api/v1/children/:id`, `PUT /api/v1/children/:id/reclassify`. Enforce BR-012 (Kutr classification) and BR-013 (collection routes).
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** FND-002, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Child registration with all fields (BR-004.1)
  - Kutr group constrained to 'Kutr 1' or 'Kutr 2' (BR-012)
  - Collection location constrained to 5 routes (BR-013)
  - Birthday month query available
  - Reclassification endpoint works
  - Integration tests verify constraints
- **Reviewer:** Core

### MBR-002
**Parent API: CRUD**

- **Description:** Implement parent endpoints: `POST /api/v1/parents`, `GET /api/v1/parents`, `GET /api/v1/parents/:id`, `PUT /api/v1/parents/:id`.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** FND-002, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Parent creation with contact details
  - Parent list and detail retrieval
  - Parent update
  - Validation on required fields (BR-011)
- **Reviewer:** Core, Backend

### MBR-003
**Child-Parent Linking API**

- **Description:** Implement `POST /api/v1/children/:id/parents`, `DELETE /api/v1/children/:id/parents/:relation`. Enforce BR-010 (max 1 Father, 1 Mother per child).
- **Lane:** Backend
- **Priority:** Critical
- **Dependencies:** MBR-001, MBR-002
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Link parent to child with relation type (Father/Mother)
  - Composite unique constraint enforced (BR-010)
  - Cannot add duplicate Father or Mother
  - Sibling association works (same parent, multiple children)
  - Unlink parent from child
  - Integration tests verify cardinality constraint
- **Reviewer:** Core

### MBR-004
**Child Registration UI**

- **Description:** Build child registration form in `apps/admin`. Include all fields from FR-04.1, Kutr group selection, collection location dropdown.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** MBR-001
- **Deliverable:** Child registration form + component tests
- **Acceptance Criteria:**
  - Form with all child registration fields
  - Kutr group radio selection (Kutr 1 / Kutr 2)
  - Collection location dropdown (5 routes)
  - Photo upload field
  - Form validation (Zod)
  - Success/error feedback
  - Mobile-responsive
- **Reviewer:** Core, Frontend 2

### MBR-005
**Parent Linking UI**

- **Description:** Build parent linking dialog in `apps/admin`. Link/unlink parents to children with relation type selection.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** MBR-002, MBR-003
- **Deliverable:** Parent linking dialog + component tests
- **Acceptance Criteria:**
  - Dialog to link parent to child
  - Relation type selection (Father/Mother)
  - Duplicate prevention feedback
  - Unlink capability
  - Current parent links displayed
- **Reviewer:** Core, Frontend 2

### MBR-006
**Child List & Detail UI**

- **Description:** Build child list page and detail view in `apps/admin`. Include filtering by Kutr group and collection location.
- **Lane:** Frontend 2
- **Priority:** High
- **Dependencies:** MBR-001
- **Deliverable:** List page + detail page
- **Acceptance Criteria:**
  - Paginated child list
  - Filter by Kutr group
  - Filter by collection location
  - Child detail shows profile, parents, group
  - Birthday milestone indicator
- **Reviewer:** Core, Frontend 2

### MBR-007
**Children & Parents Integration Tests**

- **Description:** Write integration tests covering child registration, parent linking, cardinality constraints, sibling association, and reclassification.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** MBR-001, MBR-002, MBR-003
- **Deliverable:** Integration test suite
- **Acceptance Criteria:**
  - Child registration tested
  - Parent linking tested
  - BR-010 cardinality constraint tested (cannot add duplicate Father/Mother)
  - BR-011 parent contact requirement tested
  - BR-012 Kutr classification tested
  - BR-013 collection routes tested
  - Sibling association tested
- **Reviewer:** Core

### MBR-008
**OpenAPI Children & Parents Documentation**

- **Description:** Update Swagger/OpenAPI specification with children, parents, and child-parents endpoint documentation.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** MBR-001, MBR-002, MBR-003
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - All children endpoints documented
  - All parents endpoints documented
  - Child-parents linking documented
  - Error responses documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- MBR-001 and MBR-002 (independent child and parent endpoints)
- MBR-004 and MBR-006 (independent UI pages)
- MBR-008 (documentation)

**Must happen sequentially:**
- MBR-003 depends on MBR-001 and MBR-002
- MBR-005 depends on MBR-002 and MBR-003

---

## Deliverables

1. Child registration and CRUD API
2. Parent CRUD API
3. Child-parent linking API with cardinality enforcement
4. Child registration UI
5. Parent linking UI
6. Child list and detail UI
7. Integration test suite
8. OpenAPI documentation

---

## Exit Criteria

- [ ] Child registration works end-to-end
- [ ] Parent CRUD works
- [ ] Child-parent linking enforces BR-010 (max 1 Father, 1 Mother)
- [ ] Kutr group classification enforced (BR-012)
- [ ] Collection routes constrained to 5 locations (BR-013)
- [ ] Sibling association works
- [ ] Child registration UI functional
- [ ] Parent linking UI functional
- [ ] All integration tests pass
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
