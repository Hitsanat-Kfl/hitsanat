# Lane 5 — Backend Support

## Hitsanat Kifl Children's Ministry Management System
**Name:** Israel
**Role:** Backend Support
**ADR Reference:** ADR-0008 (Express.js with TypeScript), ADR-0014 (Biome), ADR-0015 (Local `pnpm prepare` Quality Gate)

---

## 1. Purpose

Israel handles simpler, well-defined backend tasks under the architecture established by Abrham (Core + Backend). This role reduces Abrham's workload by handling straightforward CRUD endpoints, basic validation, tests, API documentation, and non-critical maintenance.

"Backend Support" describes the scope of responsibility, not seniority. Israel is not treated as a junior developer.

---

## 2. Responsibilities

### 2.1 CRUD Endpoints
- Straightforward create/read/update/delete endpoints
- Simple list endpoints with basic filtering
- Detail view endpoints
- Basic search endpoints

### 2.2 Validation
- Zod validation schema implementation for assigned endpoints
- Request/response schema documentation
- Input sanitization

### 2.3 Testing
- Unit tests for validation schemas
- Integration tests for CRUD endpoints
- Edge case testing for constraints
- Test data fixtures and seed scripts

### 2.4 Documentation
- Swagger/OpenAPI documentation for assigned endpoints
- README updates for module documentation
- Seed script documentation

### 2.5 Maintenance
- Bug fixes for existing endpoints
- Performance improvements for simple queries
- Code cleanup and refactoring within assigned modules

---

## 3. Owned Directories

Israel does not own independent directories. Work is performed within Abrham-owned directories under direction:

| Working Area | Purpose |
|:---|:---|
| `apps/api/src/modules/*/presentation/` | CRUD route handlers (assigned modules only) |
| `apps/api/src/modules/*/application/` | Simple use cases (assigned modules only) |
| `apps/api/src/modules/*/infrastructure/` | Repository implementations (assigned modules only) |
| `apps/api/tests/` | Tests for assigned endpoints |

---

## 4. Allowed Changes (Without Approval)

- CRUD endpoint implementations within assigned modules
- Validation schemas in `packages/validation` (for assigned endpoints)
- Tests for assigned endpoints
- Swagger documentation updates
- Seed script updates
- README and documentation updates

---

## 5. Restricted Changes (Requires Abrham's Approval)

- **Database schemas** — Never modify `packages/database/src/schema/`
- **Database migrations** — Never create or modify migrations
- **Authentication logic** — Never modify `packages/auth/` or auth middleware
- **Authorization/RBAC logic** — Never modify `packages/permissions/`
- **Shared package contracts** — Never modify `packages/domain/`, `packages/database/`, `packages/permissions/`
- **Architecture decisions** — Never change module structure or Clean Architecture boundaries
- **CI/CD configuration** — Never modify `.github/workflows/`
- **Docker configuration** — Never modify `docker/` or `docker-compose.yml`
- **Cross-lane integration** — Must coordinate with Abrham
- **PR self-merge** — Israel may not self-merge any PR

---

## 6. Dependencies

### Upstream Dependencies
- **Abrham (Core + Backend)** — Database schemas, shared packages, architecture decisions, approval for all non-trivial changes

### Downstream Dependencies
- **Eyob (Frontend Developer 1)** — Consumes CRUD endpoints
- **TBD (Frontend Developer 2)** — Consumes CRUD endpoints

---

## 7. Review Requirements

### Israel Receives Review From
- **Abrham (Core + Backend)** — All PRs must be reviewed by Abrham before merge

### Israel Does NOT Review
- Abrham's PRs
- Frontend PRs

---

## 8. Typical Tasks

| Task Type | Examples |
|:---|:---|
| CRUD endpoint | Create `GET /api/v1/parents` list endpoint |
| Validation | Implement Zod schema for child registration |
| Testing | Write integration test for parent creation |
| Documentation | Update Swagger for `/api/v1/children/:id` endpoint |
| Bug fix | Fix pagination bug in member list endpoint |
| Seed script | Create seed data for sub_departments table |
| Maintenance | Refactor error handling in attendance endpoint |

---

## 9. Collaboration Rules

1. **Work within assigned scope.** Do not expand work beyond the assigned module or task.
2. **Follow Abrham's architecture.** All code must follow the established Clean Architecture patterns.
3. **Use shared packages.** Do not duplicate logic. Use `packages/validation`, `packages/domain`, etc.
4. **Run `pnpm prepare` before pushing.** All code must pass the local quality gate.
5. **Request review explicitly.** Tag Abrham for review on every PR.
6. **Ask before changing shared resources.** If a task requires modifying a shared package, ask Abrham first.

---

## 10. Escalation Rules

1. **Schema questions** — If a CRUD endpoint needs a schema change, escalate to Abrham. Do not propose schema changes.
2. **Auth/RBAC questions** — If an endpoint needs permission checks, escalate to Abrham.
3. **Architecture questions** — If unsure about Clean Architecture boundaries, ask Abrham before proceeding.
4. **Scope creep** — If a task grows beyond CRUD complexity, escalate to Abrham for reassignment.
5. **Blocking dependencies** — If blocked by an Abrham task, notify immediately.
