# Hitsanat Kifl Monorepo — Repository Structure & Engineering Guide

This document outlines the foundation architecture, application layout, package boundaries, testing strategy, Docker infrastructure, and developer workflow for the Hitsanat Kifl Children's Ministry Management System.

---

## 1. Repository Structure Overview

```text
Hitsanat/
├── .github/
│   ├── workflows/
│   │   └── ci.yml               # GitHub Actions CI pipeline
│   ├── CODEOWNERS               # Repository code ownership rules
│   └── pull_request_template.md # Team pull request checklist
├── apps/
│   ├── portfolio/               # Public-facing Next.js portal
│   │   ├── app/                 # App router pages & layouts
│   │   ├── public/              # Static assets
│   │   ├── next.config.ts
│   │   ├── package.json         # @repo/portfolio
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   ├── admin/                   # Administrative Next.js management console
│   │   ├── app/                 # Admin shell, dashboard placeholders
│   │   ├── public/
│   │   ├── components.json      # shadcn configuration
│   │   ├── next.config.ts
│   │   ├── package.json         # @repo/admin
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── api/                     # Express.js REST API
│       ├── src/
│       │   ├── config/          # Environment configuration
│       │   ├── infrastructure/  # OpenAPI/Swagger & technical integrations
│       │   ├── modules/         # Modular DDD domain modules (upcoming)
│       │   ├── presentation/    # Express routers & controllers
│       │   ├── shared/          # Cross-module shared utilities
│       │   ├── app.ts           # Express app setup
│       │   └── server.ts        # HTTP server entrypoint
│       ├── tests/               # API endpoint tests
│       ├── package.json         # @repo/api
│       └── tsconfig.json
├── packages/
│   ├── database/                # Drizzle ORM client, schemas, migrations
│   │   ├── src/
│   │   │   ├── client/          # Postgres connection pool client
│   │   │   ├── schema/          # Drizzle table definitions
│   │   │   ├── migrations/      # SQL migration files
│   │   │   └── index.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json         # @repo/database
│   ├── schemas/                 # Zod validation schemas & shared types
│   │   ├── src/
│   │   │   ├── health.ts
│   │   │   └── index.ts
│   │   └── package.json         # @repo/schemas
│   ├── ui/                      # Shared shadcn/ui React components
│   │   ├── src/
│   │   │   ├── components/      # Button, Card, Badge, etc.
│   │   │   ├── lib/             # cn() utility
│   │   │   └── index.ts
│   │   └── package.json         # @repo/ui
│   ├── calendar/                # Ethiopian & Gregorian calendar conversions
│   │   ├── src/
│   │   │   └── index.ts         # ethiopian-calendar-new wrapper
│   │   └── package.json         # @repo/calendar
│   ├── config/                  # Shared system constants & metadata
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json         # @repo/config
│   ├── typescript-config/       # Base, Next.js, and Node tsconfig presets
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── node.json
│   │   └── package.json         # @repo/typescript-config
│   └── biome-config/            # Biome linting and formatting configuration
│       ├── biome.json
│       └── package.json         # @repo/biome-config
├── tests/
│   ├── e2e/                     # Playwright smoke tests & axe-core a11y
│   ├── integration/             # Real PostgreSQL integration tests
│   └── fixtures/                # Static test datasets
├── docker/
│   ├── Dockerfile.api           # Production container for Express API
│   ├── Dockerfile.portfolio     # Production container for Portfolio app
│   └── Dockerfile.admin         # Production container for Admin app
├── docs/
│   └── development/
│       └── repository-structure.md
├── .env.example                 # Environment variables blueprint
├── .gitignore
├── biome.json                   # Root Biome config
├── docker-compose.yml           # Local multi-container development environment
├── package.json                 # Monorepo root scripts & dev dependencies
├── playwright.config.ts         # Playwright E2E configuration
├── pnpm-workspace.yaml
├── README.md
├── turbo.json                   # Turborepo task pipeline
└── vitest.config.ts             # Vitest configuration
```

---

## 2. Package Dependency Boundaries

To ensure clean architecture and prevent coupling:

```text
apps/portfolio  ───►  @repo/ui, @repo/schemas, @repo/calendar, @repo/config
apps/admin      ───►  @repo/ui, @repo/schemas, @repo/calendar, @repo/config
apps/api        ───►  @repo/database, @repo/schemas, @repo/config
@repo/database  ───►  PostgreSQL (Local / Supabase)
```

### Strict Architectural Boundaries:
1. **Frontend applications (`apps/portfolio`, `apps/admin`) MUST NOT import `@repo/database`** or communicate with PostgreSQL directly.
2. **All data access passes through `apps/api`**.
3. **Domain logic does not depend on Express framework specifics**.
4. **Calendar logic is centralized in `@repo/calendar`** and must not be duplicated.

---

## 3. Applications

| Application | Path | Tech Stack | Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Portfolio** | `apps/portfolio` | Next.js, React, Tailwind CSS, shadcn/ui | `3000` | Public ministry website, announcements, events |
| **Admin** | `apps/admin` | Next.js, React, Tailwind CSS, shadcn/ui | `3002` | Administrative management console & ministry tools |
| **API** | `apps/api` | Express.js, TypeScript, Drizzle ORM, Swagger | `3001` | Backend REST API services & domain operations |

---

## 4. Shared Packages

| Package | Path | Purpose |
| :--- | :--- | :--- |
| `@repo/database` | `packages/database` | Drizzle ORM schema, migrations, connection pool client |
| `@repo/schemas` | `packages/schemas` | Zod contracts, request/response validation schemas |
| `@repo/ui` | `packages/ui` | Shared shadcn/ui components (Button, Card, Badge, cn) |
| `@repo/calendar` | `packages/calendar` | Ethiopian ↔ Gregorian calendar conversions (`ethiopian-calendar-new`) |
| `@repo/config` | `packages/config` | Global configuration constants |
| `@repo/typescript-config` | `packages/typescript-config` | Shared TypeScript configurations (`base.json`, `nextjs.json`, `node.json`) |
| `@repo/biome-config` | `packages/biome-config` | Shared Biome linting and formatting configuration |

---

## 5. Development Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Start all applications in development mode |
| `pnpm build` | Build all applications and packages via Turborepo |
| `pnpm lint` | Run Biome linter across the entire monorepo |
| `pnpm format` | Auto-format all files using Biome |
| `pnpm format:check` | Check code formatting compliance |
| `pnpm typecheck` | Typecheck all workspaces with TypeScript |
| `pnpm test` | Run all test suites with Vitest |
| `pnpm test:unit` | Run unit and component tests |
| `pnpm test:integration` | Run real PostgreSQL integration tests |
| `pnpm test:e2e` | Run Playwright smoke and accessibility tests |
| `pnpm prepare` | **Team Quality Gate**: runs format check, lint, typecheck, unit tests, integration tests, build, and e2e |

---

## 6. Testing Strategy

1. **Unit & Component Testing (Vitest + React Testing Library):**
   - Unit tests for `@repo/calendar`, `@repo/schemas`, `@repo/database`.
   - Endpoint tests for `@repo/api` using `supertest`.
   - React component tests for `apps/portfolio` and `apps/admin`.
2. **Database Integration Testing (PostgreSQL):**
   - Real database integration tests against PostgreSQL (`TEST_DATABASE_URL`).
   - Verifies connection lifecycle, transaction isolation, and schema operations.
3. **E2E & Accessibility Testing (Playwright + `@axe-core/playwright`):**
   - Smoke tests verify page rendering and navigation for all frontend apps.
   - Automated WCAG accessibility scans verify zero violations.

---

## 7. Docker Infrastructure

- `docker-compose.yml` provides:
  - `postgres`: Primary development PostgreSQL database on port `5432`
  - `postgres_test`: Dedicated integration test database on port `5433`
  - `api`: Containerized Express backend on port `3001`
  - `portfolio`: Containerized public Next.js app on port `3000`
  - `admin`: Containerized admin Next.js app on port `3002`

---

## 8. Git Workflow & Governance

1. **No direct pushes to `main` or `develop`**.
2. **Every task gets a dedicated branch**:
   - `feature/<task-name>`
   - `fix/<task-name>`
   - `refactor/<task-name>`
   - `test/<task-name>`
   - `docs/<task-name>`
   - `chore/<task-name>`
3. **Run local quality gate before pushing**:
   ```bash
   pnpm prepare
   ```
4. **Open a Pull Request** using the standard template in `.github/pull_request_template.md`.
5. **Code review & CI requirements**:
   - CI pipeline must pass completely.
   - Core Lead approval is required for database changes, architecture, shared packages, or CI modifications.
