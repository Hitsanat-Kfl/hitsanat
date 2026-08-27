# Hitsanat Kifl — Children's Ministry Management System

> **Repository Foundation & System Engineering Infrastructure**

---

## 🌟 Tech Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/) + [Turborepo](https://turbo.build/) |
| **Frontend Applications** | [Next.js 15 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [TanStack Query](https://tanstack.com/query) |
| **Backend REST API** | [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [Drizzle ORM](https://orm.drizzle.team/), [OpenAPI 3.0 / Swagger UI](https://swagger.io/) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) / [Supabase PostgreSQL](https://supabase.com/) |
| **Calendar Engine** | [Ethiopian Calendar](https://www.npmjs.com/package/ethiopian-calendar-new) (`ethiopian-calendar-new`) |
| **Code Quality** | [Biome](https://biomejs.dev/) (Linter & Formatter) |
| **Testing** | [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/), [@axe-core/playwright](https://www.deque.com/axe/) |
| **Infrastructure** | Docker & Docker Compose, GitHub Actions CI |

---

## 📁 Repository Layout

```text
├── apps/
│   ├── portfolio/       # Public portal (Next.js 15, port 3000)
│   ├── admin/           # Admin console (Next.js 15, port 3002)
│   └── api/             # REST API (Express.js, port 3001)
├── packages/
│   ├── database/        # Drizzle ORM client, schemas, migrations
│   ├── schemas/         # Zod schemas & shared API contracts
│   ├── ui/              # Shared shadcn/ui components (@repo/ui)
│   ├── calendar/        # Ethiopian & Gregorian calendar conversions
│   ├── config/          # Shared constants & system configuration
│   ├── typescript-config/# Shared TSConfigs (base, nextjs, node)
│   └── biome-config/    # Biome formatting and linting rules
├── tests/
│   ├── e2e/             # Playwright E2E and accessibility tests
│   ├── integration/     # PostgreSQL integration tests
│   └── fixtures/        # Test seed data & fixtures
├── docker/              # Dockerfiles for API, Portfolio, and Admin
├── docs/                # Comprehensive technical & architecture documentation
└── .github/             # CI workflows, CODEOWNERS, and PR templates
```

For full details, see [docs/development/repository-structure.md](file:///C:/Users/hp/Desktop/Hitsanat/docs/development/repository-structure.md).

---

## 📚 Documentation Index

The complete engineering documentation suite is available under [`docs/`](file:///C:/Users/hp/Desktop/Hitsanat/docs/README.md):

| Documentation Section | Description |
| :--- | :--- |
| [**System Overview & Index**](file:///C:/Users/hp/Desktop/Hitsanat/docs/README.md) | High-level master documentation index and architecture map |
| [**Architecture Decision Records (ADRs)**](file:///C:/Users/hp/Desktop/Hitsanat/docs/adr/README.md) | Authoritative ADRs establishing technical constraints |
| [**Repository Structure Guide**](file:///C:/Users/hp/Desktop/Hitsanat/docs/development/repository-structure.md) | Monorepo layout, dependencies, and boundary rules |
| [**Roles & Scoped RBAC Matrix**](file:///C:/Users/hp/Desktop/Hitsanat/docs/requirements/roles-and-permissions.md) | Scoped access controls across Executive, Sub-Departments, and Families |
| [**REST API Specifications**](file:///C:/Users/hp/Desktop/Hitsanat/docs/api/endpoints.md) | Exhaustive REST endpoint catalog across business modules |
| [**Team Ownership & Lanes**](file:///C:/Users/hp/Desktop/Hitsanat/docs/team/ownership.md) | Multi-lane ownership architecture and review guidelines |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `>= 20.x`
- **pnpm**: `>= 9.x` (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker**: Docker Desktop (for local PostgreSQL database)

### 2. Setup
```bash
# Clone the repository and install dependencies
git clone https://github.com/Hitsanat-Kfl/hitsanat.git
cd hitsanat
pnpm install

# Copy environment template
cp .env.example .env
```

### 3. Start Database (Docker)
```bash
docker compose up -d postgres postgres_test
```

### 4. Run Development Servers
```bash
pnpm dev
```
- **Portfolio App:** `http://localhost:3000`
- **Admin App:** `http://localhost:3002`
- **API Server:** `http://localhost:3001`
- **API Health:** `http://localhost:3001/health`
- **API Swagger Docs:** `http://localhost:3001/docs`

---

## 🛠️ Monorepo Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Start development servers for all apps |
| `pnpm build` | Build all apps and packages via Turborepo |
| `pnpm lint` | Run Biome linter across the entire monorepo |
| `pnpm format` | Format code using Biome |
| `pnpm format:check` | Check code formatting without modifying files |
| `pnpm typecheck` | Run TypeScript type checks across all projects |
| `pnpm test` | Run all test suites (Vitest) |
| `pnpm test:unit` | Run unit and component tests |
| `pnpm test:integration` | Run real PostgreSQL integration tests |
| `pnpm test:e2e` | Run Playwright smoke and accessibility tests |
| **`pnpm prepare`** | **Local Quality Gate** (format, lint, typecheck, tests, build, e2e) |

> [!IMPORTANT]
> **Mandatory Quality Gate:** Contributors must run `pnpm prepare` before pushing code or submitting a Pull Request.

---

## 🛡️ Package Dependency Boundaries

- `apps/portfolio` & `apps/admin` may import `@repo/ui`, `@repo/schemas`, `@repo/calendar`, and `@repo/config`.
- Frontend apps **must not** import `@repo/database` or connect directly to PostgreSQL.
- `apps/api` handles all data interactions via `@repo/database`.
- Database schema changes require **Core Lead** code review.

---

## 📄 License
Private & Proprietary — Hitsanat Kifl Ministry
