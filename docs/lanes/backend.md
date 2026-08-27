# Lane 4 — Backend

## Hitsanat Kifl Children's Ministry Management System
**Name:** Abrham
**Role:** Core / Overall Lead + Backend Developer
**ADR Reference:** ADR-0008 (Express.js with TypeScript), ADR-0013 (OpenAPI 3.1 via Zod)

---

## 1. Purpose

Abrham owns the Express.js API application (`apps/api`) as part of the combined Core + Backend role. Abrham implements complex backend features, domain logic, and core business rules. Simple and well-defined backend work is delegated to Israel (Backend Support).

---

## 2. Responsibilities

### 2.1 Complex API Module Implementation
- Domain-driven use cases and services
- Complex business rule enforcement
- Repository pattern implementations
- Cross-module integration logic
- Event-driven architecture patterns

### 2.2 Backend Architecture
- Clean Architecture layering (Presentation → Application → Domain → Infrastructure)
- Module boundary definitions
- API contract design
- Error handling standardization (RFC 7807)

### 2.3 Core Business Logic
- Planning weight calculation engine
- Progress roll-up aggregation
- Attendance auto-seeding logic
- Multi-member assignment validation
- Parent cardinality constraint enforcement

### 2.4 API Documentation
- OpenAPI specification oversight
- Swagger configuration
- API contract approval

### 2.5 Testing
- Complex integration tests
- Cross-module integration tests
- Security testing

---

## 3. Owned Directories

| Directory | Purpose |
|:---|:---|
| `apps/api/` | Express.js REST API application |
| `apps/api/src/modules/*/domain/` | Domain layer of each API module |
| `apps/api/src/modules/*/application/` | Application layer (use cases) |
| `apps/api/src/modules/*/infrastructure/` | Infrastructure layer (repos, external services) |
| `apps/api/src/modules/*/presentation/` | Route handlers (complex endpoints) |
| `apps/api/src/config/` | Server configuration, environment validation |
| `apps/api/src/infrastructure/` | Swagger, shared infrastructure |
| `apps/api/src/shared/` | Shared backend utilities |
| `apps/api/tests/` | API integration tests |

---

## 4. Allowed Changes (Without Approval)

- All files within `apps/api/` (as the architecture owner)
- All module layers (domain, application, infrastructure, presentation)
- API contract definitions
- Error handling patterns
- Integration test patterns

---

## 5. Restricted Changes (Requires Explicit Approval)

None for backend code — Abrham is the backend architecture authority. However, Abrham follows the same self-discipline of reviewing Israel's work and maintaining architectural consistency.

---

## 6. Dependencies

### Upstream Dependencies
- **Abrham (Core)** — Self (same person, same role)
- Database schemas (Abrham owns)
- Shared packages (Abrham owns)

### Downstream Dependencies
- **Israel (Backend Support)** — Consumes API contracts and patterns established by Abrham
- **Eyob (Frontend Developer 1)** — Consumes API endpoints
- **TBD (Frontend Developer 2)** — Consumes API endpoints

---

## 7. Review Requirements

### Abrham Must Review
- **Israel's PRs** — All of Israel's backend PRs require Abrham's review
- API contract changes
- Cross-module integration changes

### Abrham Receives Review From
- N/A — Abrham is the final backend authority

---

## 8. Typical Tasks

| Task Type | Examples |
|:---|:---|
| Complex endpoint | Implement attendance auto-seeding endpoint |
| Domain service | Build planning weight calculation engine |
| Integration | Cross-module data flow (member → family → attendance) |
| Auth/RBAC | Implement scoped permission guards |
| Architecture | Define Clean Architecture patterns for new module |
| Review | Review Israel's CRUD endpoint PR |

---

## 9. Collaboration Rules

1. **Define patterns for Israel.** Establish the module structure, naming conventions, and testing patterns that Israel follows.
2. **Delegate simple work.** CRUD endpoints, basic validation, and straightforward tests should be delegated to Israel.
3. **Review all of Israel's PRs.** Every backend PR from Israel requires Abrham's review before merge.
4. **Maintain architectural consistency.** Ensure all backend code follows Clean Architecture principles.

---

## 10. Escalation Rules

1. **Self-escalation** — If a task grows in complexity, reclassify it from Israel's scope to Abrham's scope.
2. **Israel blockers** — If Israel is blocked, Abrham provides guidance or takes over the task.
