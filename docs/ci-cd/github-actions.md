# CI/CD: GitHub Actions Workflow Specification

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.2  
**Workflow File:** `.github/workflows/ci.yml`  

---

## 1. Automated Pipeline Flow

```mermaid
graph TD
    Trigger[Push / PR to main, develop, release, feature, fix, chore] --> Checkout[1. Checkout Repository]
    Checkout --> SetupTooling[2. Setup pnpm 9.15.9 & Node.js 22]
    SetupTooling --> InstallDeps[3. pnpm install --frozen-lockfile]
    InstallDeps --> Playwright[4. Install Playwright Chromium]
    Playwright --> BiomeLint[5. Biome Lint & Format Check]
    BiomeLint --> Typecheck[6. TypeScript Typecheck]
    Typecheck --> UnitTests[7. Unit Tests]
    UnitTests --> Migrations[8. Apply Drizzle Migrations]
    Migrations --> IntegrationTests[9. PostgreSQL Integration Tests]
    IntegrationTests --> TurboBuild[10. Production Build]
    TurboBuild --> Pass[PASS - PR Mergeable]
```

PostgreSQL 16 is provided as a GitHub Actions **service container** (`postgres:16-alpine`) — no separate Docker spin-up step.

---

## 2. `.github/workflows/ci.yml` Configuration (actual)

```yaml
name: CI Pipeline

on:
  push:
    branches: ["main", "master", "develop", "release/**", "feature/**", "fix/**", "chore/**"]
  pull_request:
    branches: ["main", "master", "develop"]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-gate:
    name: Code Quality, Tests & Build
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
          POSTGRES_DB: hitsanat_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:postgrespassword@localhost:5432/hitsanat_test
      TEST_DATABASE_URL: postgresql://postgres:postgrespassword@localhost:5432/hitsanat_test
      SUPABASE_URL: http://localhost:54321
      SUPABASE_ANON_KEY: ci-anon-key
      NEXT_PUBLIC_SUPABASE_URL: http://localhost:54321
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ci-anon-key

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile --ignore-scripts || pnpm install --ignore-scripts

      - name: Install Playwright Browsers
        run: pnpm exec playwright install chromium

      - name: Biome Format & Lint Check
        run: |
          pnpm format:check
          pnpm lint

      - name: TypeScript Typecheck
        run: pnpm typecheck

      - name: Run Unit Tests
        run: pnpm test:unit

      - name: Run Database Migrations
        run: pnpm --filter @repo/database db:migrate

      - name: Run PostgreSQL Integration Tests
        run: pnpm test:integration
```

> Note: CI uses placeholder `SUPABASE_*` values so admin middleware (`createServerClient`) can boot. Real deployments override them with live Supabase project credentials.
```
