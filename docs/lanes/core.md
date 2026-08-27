# Lane 1 — Core / Overall Lead + Backend

## Hitsanat Kifl Children's Ministry Management System
**Name:** Abrham
**Role:** Core / Overall Lead + Backend Developer
**ADR Reference:** ADR-0016 (Five-Contributor Multi-Lane Team Ownership)

---

## 1. Purpose

Abrham is the primary technical owner of the overall Hitsanat Kifl system. This dual role combines overall architecture authority with hands-on backend development. Abrham owns architecture, database design, security, authentication, shared packages, cross-lane integration, and also implements core backend features.

Simple and well-defined backend work is delegated to Israel (Backend Support) where appropriate.

---

## 2. Responsibilities

### 2.1 Architecture & Design
- Overall system architecture (Modular Monolith, Clean Architecture, DDD)
- Module boundary definitions (`apps/api/src/modules/`)
- API contract design and OpenAPI specification
- Technology selection and evaluation
- Architecture Decision Records (ADRs)

### 2.2 Database
- PostgreSQL schema design and entity modeling
- Drizzle ORM schema declarations (`packages/database/src/schema/`)
- Database migrations and seed scripts
- Constraint design (unique indexes, check constraints, foreign keys)
- Data architecture decisions (Gregorian storage, audit logs)

### 2.3 Security & Authentication
- Better Auth integration and session management
- Scoped RBAC implementation (ADR-0005)
- Authorization guards (`requireAuth`, `requireScopePermission`)
- PII protection and data privacy
- Security middleware configuration (Helmet, CORS)

### 2.4 Shared Packages
- `packages/database` — Drizzle ORM client, schema, migrations
- `packages/domain` — Core business entities, value objects, calculation engines
- `packages/permissions` — Scoped RBAC matrices, constants, evaluation helpers
- `packages/validation` — Shared Zod schemas and API contracts
- `packages/schemas` — Shared API request/response schemas

### 2.5 Core Business Logic
- Planning weight calculation engine (3-factor formula)
- Progress roll-up aggregation (Weekly → Monthly → Quarterly → Annual)
- Attendance auto-seeding logic (ADR-0002)
- Multi-member assignment validation (≥2 members invariant)
- Parent cardinality constraint enforcement

### 2.6 Backend Development
- Complex API endpoint implementation
- Domain-driven use cases and services
- Repository pattern implementations
- Complex business rule enforcement
- Cross-module integration logic

### 2.7 Cross-Lane Integration
- API contract approval before frontend integration
- Cross-lane PR review
- Integration point identification and management
- Shared package breaking change approval

### 2.8 CI/CD & Deployment
- GitHub Actions CI pipeline configuration
- Turborepo task pipeline (`turbo.json`)
- Docker infrastructure (`docker-compose.yml`, Dockerfiles)
- Deployment configuration (Railway, Vercel)
- `pnpm prepare` quality gate enforcement

---

## 3. Owned Directories

| Directory | Purpose |
|:---|:---|
| `packages/database/` | Drizzle ORM schema, client, migrations |
| `packages/domain/` | Core business logic, entities, calculation engines |
| `packages/permissions/` | RBAC matrices, permission constants |
| `packages/validation/` | Shared Zod validation schemas |
| `apps/api/src/modules/*/domain/` | Domain layer of each API module |
| `apps/api/src/modules/*/application/` | Application layer (use cases) |
| `apps/api/src/modules/*/infrastructure/` | Infrastructure layer (repos, external services) |
| `apps/api/src/config/` | Server configuration, environment validation |
| `apps/api/src/infrastructure/` | Swagger, shared infrastructure |
| `docker/` | Dockerfiles for all services |
| `docker-compose.yml` | Local development infrastructure |
| `.github/workflows/` | CI/CD pipeline definitions |
| `turbo.json` | Turborepo task pipeline |
| `vitest.config.ts` | Root Vitest configuration |
| `playwright.config.ts` | Root Playwright configuration |

---

## 4. Allowed Changes (Without Approval)

- Domain layer code within `apps/api/src/modules/*/domain/`
- Application layer code within `apps/api/src/modules/*/application/`
- Infrastructure layer implementations within `apps/api/src/modules/*/infrastructure/`
- Database schema changes in `packages/database/src/schema/`
- Database migrations in `packages/database/src/migrations/`
- Shared package changes in `packages/database`, `packages/domain`, `packages/permissions`, `packages/validation`
- CI/CD pipeline modifications
- Docker configuration changes
- Server configuration changes
- Core backend API endpoints and use cases

---

## 5. Restricted Changes (Requires Explicit Approval)

None — Abrham is the final technical authority. All architectural decisions are within this role's mandate.

---

## 6. Dependencies

### Upstream Dependencies
- None (Abrham/Core is the root authority)

### Downstream Dependencies
- All lanes depend on Abrham's architectural decisions
- Israel (Backend Support) depends on Abrham's database schemas and shared packages
- Frontend developers depend on Abrham's API contracts
- All lanes depend on Abrham's CI/CD and deployment configuration

---

## 7. Review Requirements

### Abrham Must Review
- All database schema changes (from any lane)
- All shared package changes (from any lane)
- All API contract changes
- All authentication/authorization changes
- All security-related changes
- All CI/CD changes
- All Docker infrastructure changes
- All deployment configuration changes
- Cross-lane integration changes
- Israel's PRs (always)
- Frontend architectural or cross-application changes

### Abrham May Review
- Frontend-only UI changes (advisory)
- Documentation-only changes (advisory)

---

## 8. Typical Tasks

| Task Type | Examples |
|:---|:---|
| Schema design | Create `members` table, add `plan_distributions` table |
| Migration | Generate Drizzle migration, write seed scripts |
| API contract | Design `/api/v1/members` endpoint contract |
| Domain logic | Implement planning weight calculation engine |
| Auth/RBAC | Configure Better Auth, add scoped permission guard |
| CI/CD | Add Playwright E2E job to GitHub Actions |
| Backend | Implement complex API endpoints, domain services |
| Review | Review Israel's CRUD endpoint PR |
| Architecture | Write ADR for new integration pattern |

---

## 9. Collaboration Rules

1. **API contracts must be defined before frontend integration.** Abrham publishes OpenAPI specs; frontend developers consume them.
2. **Database schemas require Abrham approval before migration.** No lane may independently modify database tables.
3. **Shared package changes require Abrham approval.** Breaking changes to `packages/database`, `packages/domain`, or `packages/permissions` affect all lanes.
4. **Cross-lane PRs require Abrham review.** Any PR touching files outside the lane's owned directories requires review.
5. **Abrham sets coding standards.** Biome configuration, TypeScript strictness, and testing requirements are established by Abrham.
6. **Delegate simple backend work to Israel.** CRUD endpoints, basic validation, and tests should be delegated where appropriate.

---

## 10. Escalation Rules

1. **Architecture disagreements** — Abrham has final authority. If a lane disagrees with an architectural decision, they may raise it in PR discussion, but Abrham makes the final call.
2. **Cross-lane conflicts** — Abrham mediates. If two lanes disagree on an integration point, Abrham decides the resolution.
3. **Scope creep** — If a task grows beyond its original scope, the lane must stop and request re-scoping from Abrham.
4. **Breaking changes** — If a proposed change would break another lane's work, the proposing lane must coordinate with Abrham first.
5. **Production incidents** — Abrham leads incident response. All lanes support as directed.
