# Open Decisions Registry

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 1.0
**Purpose:** Track unresolved requirements and architecture decisions that must be resolved before or during implementation

---

## 1. Previously Resolved Decisions

These decisions are carried forward from `docs/open-decisions.md` and are already resolved:

| ID | Question | Resolution | Status |
|:---|:---|:---|:---|
| OD-01 | Telegram Bot Deployment Platform | Railway Multi-Service | RESOLVED |
| OD-02 | Public Swagger Production Exposure | HTTP Basic Auth in production | PROPOSED |
| OD-03 | Media Storage Provider | Cloudinary Free Tier | PROPOSED |
| OD-04 | Weekend Cold-Start Delays | Railway Always-On | RESOLVED |

---

## 2. New Open Decisions

### DEC-001: Organizational Hierarchy Depth

- **Question:** What is the exact organizational hierarchy below sub-departments? Are there further subdivisions (e.g., teams within Timihrt, groups within Mezmur)?
- **Owner:** Core (Abrham)
- **Impact:** Affects database schema design for sub-department modules and planning distribution granularity
- **Required By:** Phase 5 (Planning)
- **Status:** OPEN — Requirements show 5 fixed sub-departments but do not define further hierarchy

### DEC-002: Who Creates Annual Plans

- **Question:** Who has authority to create the Annual Master Plan? The requirements mention "Ekd Kifl" creates plans, but is this the Ekd Leader alone, or any Ekd member?
- **Owner:** Core (Abrham)
- **Impact:** Affects RBAC configuration for planning endpoints
- **Required By:** Phase 5 (Planning)
- **Status:** OPEN — FR-08.1 defines hierarchy but not creation authority

### DEC-003: Can Sub-Departments Modify Distributed Plans

- **Question:** When Ekd distributes a plan activity to a sub-department, can the sub-department modify the activity details (targets, timeline) or must they execute exactly as distributed?
- **Owner:** Core (Abrham)
- **Impact:** Affects plan distribution API design and RBAC rules
- **Required By:** Phase 5 (Planning)
- **Status:** OPEN — BR-031 says sub-departments cannot create independent plans, but modification of distributed plans is unclear

### DEC-004: Plan Revision and Approval Workflow

- **Question:** Can annual plans be revised after approval? Is there an approval workflow (Draft → Pending Approval → Approved → Active)?
- **Owner:** Core (Abrham)
- **Impact:** Affects plan status lifecycle and API design
- **Required By:** Phase 5 (Planning)
- **Status:** OPEN — Plan status includes 'Draft' and 'Active' but approval workflow is not defined

### DEC-005: Weekly Plans Derivation

- **Question:** Are weekly plans derived automatically from the annual plan's quarterly/monthly distribution, or are they created manually by sub-department leaders?
- **Owner:** Core (Abrham)
- **Impact:** Affects weekly planning API design and automation level
- **Required By:** Phase 5 (Planning)
- **Status:** OPEN — FR-08.4 mentions weekly execution items but derivation method is unclear

### DEC-006: Progress Tracking Granularity

- **Question:** What constitutes "completion" for a plan activity? Is it binary (completed/not), percentage-based, or measured against the annual target quantity?
- **Owner:** Core (Abrham)
- **Impact:** Affects progress recording API and roll-up calculation
- **Required By:** Phase 5 (Planning)
- **Status:** OPEN — BR-032 defines roll-up hierarchy but not completion definition

### DEC-007: Better Auth vs Custom Auth

- **Question:** The architecture docs mention "Better Auth" but this package is not yet installed. Should we use Better Auth, or consider NextAuth.js / Lucia Auth / custom session management?
- **Owner:** Core (Abrham)
- **Impact:** Affects authentication implementation complexity and session management
- **Required By:** Phase 2 (Authentication)
- **Status:** OPEN — ADR references Better Auth but no implementation exists

### DEC-008: Photo Storage Implementation

- **Question:** OD-03 recommends Cloudinary Free Tier for media storage. Should this be implemented in Phase 4 (Member Management) or deferred to a later phase?
- **Owner:** Core (Abrham)
- **Impact:** Affects child and member registration workflows
- **Required By:** Phase 4 (Member Management)
- **Status:** OPEN — Recommended but not committed

### DEC-009: Ethiopian Calendar Input Handling

- **Question:** When users input dates (e.g., child date of birth, event dates), should the UI accept Ethiopian calendar dates and convert to Gregorian for storage, or accept Gregorian directly?
- **Owner:** Core (Abrham)
- **Impact:** Affects date input component design and conversion logic
- **Required By:** Phase 4 (Member Management)
- **Status:** OPEN — BR-034 defines storage/display but not input method

### DEC-010: Soft Delete Strategy

- **Question:** Should domain entities (members, children, families) use soft deletes (is_active flag) or hard deletes? The schema includes `is_active` fields but delete behavior is not defined.
- **Owner:** Core (Abrham)
- **Impact:** Affects API delete endpoints and data retention policies
- **Required By:** Phase 3 (Organization)
- **Status:** OPEN — Schema has `is_active` but no delete policy defined

---

## 3. Decision Resolution Process

1. **Raise:** Any team member can raise an open decision
2. **Discuss:** Core leads discussion with relevant stakeholders
3. **Decide:** Core makes final decision (or escalates to project owner)
4. **Document:** Decision recorded in this file and relevant ADR
5. **Communicate:** Decision communicated to all lanes before implementation

---

## 4. Blocking Decisions

The following decisions block specific phases:

| Decision | Blocks Phase | Impact if Delayed |
|:---|:---|:---|
| DEC-007 (Auth Package) | Phase 2 | Cannot implement authentication |
| DEC-001 (Org Hierarchy) | Phase 5 | Cannot design planning distribution |
| DEC-003 (Plan Modification) | Phase 5 | Cannot design distribution API |
| DEC-004 (Approval Workflow) | Phase 5 | Cannot implement plan lifecycle |
| DEC-009 (Date Input) | Phase 4 | Cannot design date input components |
