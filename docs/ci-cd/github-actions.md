# CI/CD: GitHub Actions Workflow Specification

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Workflow File:** `.github/workflows/ci.yml`  

---

## 1. Automated Pipeline Flow

```mermaid
graph TD
    Trigger[Push / Pull Request to main] --> Checkout[1. Checkout Repository]
    Checkout --> SetupNode[2. Setup Node.js 24 & pnpm 9]
    SetupNode --> InstallDeps[3. pnpm install --frozen-lockfile]
    InstallDeps --> BiomeLint[4. Biome Lint & Format Check]
    BiomeLint --> Typecheck[5. TypeScript Typecheck turbo run typecheck]
    Typecheck --> UnitTests[6. Unit Tests Vitest]
    UnitTests --> ComponentTests[7. Component Tests React Testing Library]
    ComponentTests --> SpinDB[8. Docker Spin-Up PostgreSQL Test DB]
    SpinDB --> Migrations[9. Apply Drizzle Migrations]
    Migrations --> IntegrationTests[10. Integration & Contract Tests]
    IntegrationTests --> SecurityTests[11. RBAC & Security Tests]
    SecurityTests --> TurboBuild[12. Production Build turbo run build]
    TurboBuild --> PlaywrightE2E[13. Playwright E2E & a11y Tests]
    PlaywrightE2E --> Pass[PASS - PR Mergeable]
```

---

## 2. `.github/workflows/ci.yml` Configuration

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: Lint, Typecheck & Test Suite
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: hitsanat_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 24
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Biome Lint & Format Check
        run: pnpm lint

      - name: TypeScript Typecheck
        run: pnpm typecheck

      - name: Unit & Calculation Engine Tests
        run: pnpm test:unit

      - name: Component Tests
        run: pnpm test:component

      - name: Run Database Migrations
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/hitsanat_test
        run: pnpm db:migrate

      - name: Integration & RBAC Security Tests
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/hitsanat_test
        run: pnpm test:integration

      - name: Production Build
        run: pnpm build

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Playwright E2E & Accessibility Tests
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/hitsanat_test
        run: pnpm test:e2e
```
