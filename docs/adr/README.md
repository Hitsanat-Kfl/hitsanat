# Architecture Decision Records (ADR) Index

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

| ADR ID | Title | Status | Scope |
| :--- | :--- | :---: | :--- |
| [**ADR-0001**](./ADR-0001-separate-assignment-attendance-tables.md) | Separate Assignment/Attendance Tables per Activity Type | Accepted | Database / Schema |
| [**ADR-0002**](./ADR-0002-member-attendance-auto-seeding.md) | Member Attendance Auto-Seeds from Activity Assignment | Accepted | Domain / Attendance |
| [**ADR-0003**](./ADR-0003-kutitr-transport-location-ownership.md) | Kutitr Owns Transport & Child Location Assignment | Accepted | Domain / Logistics |
| [**ADR-0004**](./ADR-0004-ethiopian-calendar-gregorian-storage.md) | Canonical Gregorian Storage with Ethiopian Boundary Conversion | Accepted | Database / Calendar |
| [**ADR-0005**](./ADR-0005-scoped-rbac-tables.md) | Scoped Role-Based Access Control via Dedicated Join Tables | Accepted | Security / Auth |
| [**ADR-0006**](./ADR-0006-telegram-bot-standalone-service.md) | Decoupled Telegram Bot as a Standalone Service | Accepted | Architecture / Messaging |
| [**ADR-0007**](./ADR-0007-regular-members-no-dashboard-access.md) | Regular Members Restricted to Public Portfolio Website (Zero Admin Access) | Accepted | Security / Permissions |
| [**ADR-0008**](./ADR-0008-express-js-backend-framework.md) | Express.js with TypeScript as Backend Framework | Accepted | Backend / Framework |
| [**ADR-0009**](./ADR-0009-shadcn-ui-shared-package.md) | shadcn/ui Component Foundation with Shared `@hitsanat/ui` Package | Accepted | Frontend / UI |
| [**ADR-0010**](./ADR-0010-layered-testing-strategy.md) | Layered Testing Strategy with Real PostgreSQL Integration Testing | Accepted | Quality / Testing |
| [**ADR-0011**](./ADR-0011-ethiopian-calendar-new-library.md) | Ethiopian Calendar Implementation via `ethiopian-calendar-new` | Accepted | Shared / Calendar |
| [**ADR-0012**](./ADR-0012-docker-development-testing-infrastructure.md) | Docker for Reproducible Development & Test Infrastructure | Accepted | DevOps / Testing |
| [**ADR-0013**](./ADR-0013-swagger-openapi-documentation.md) | OpenAPI 3.1 Contract Generation via Zod and Swagger UI | Accepted | API / Documentation |
| [**ADR-0014**](./ADR-0014-biome-code-quality-tooling.md) | Biome as the Single Unified Tool for Formatting and Linting | Accepted | Tooling / Quality |
| [**ADR-0015**](./ADR-0015-local-prepare-ci-quality-gate.md) | Local `pnpm prepare` Quality Gate Matching GitHub Actions | Accepted | CI/CD / Quality |
| [**ADR-0016**](./ADR-0016-five-contributor-lane-ownership-model.md) | Five-Contributor Multi-Lane Team Ownership Model | Accepted | Governance / Team |
| [**ADR-0017**](./ADR-0017-free-tier-deployment-topology.md) | Free-Tier Resilient Deployment Topology (Vercel, Render, Supabase) | Accepted | Deployment / Cloud |
