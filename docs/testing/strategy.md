# Testing Strategy & Quality Gates

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Architecture ADR:** Layered Testing Strategy (ADR-0010)  

---

## 1. Layered Testing Pyramid

```mermaid
graph BT
    Unit[1. Unit Tests - Vitest: Domain Logic, Weight Formulas, Calendar Adapters]
    Component[2. Component Tests - Vitest + React Testing Library: Forms, Tables, Dialogs]
    Integration[3. Integration Tests - Vitest + Real PostgreSQL in Docker: Routes, Drizzle, Transactions]
    Contract[4. API Contract Tests - Vitest + Zod: Frontend/Backend Schema Invariants]
    Security[5. Security & RBAC Tests - Vitest: Scope Isolation & Non-Leadership Denial]
    E2E[6. End-to-End Tests - Playwright: Full Multi-Step Leadership Workflows]
    A11y[7. Accessibility Tests - Playwright + axe: WCAG 2.1 AA Checks]
    Smoke[8. Smoke Tests - Post-Deployment Verification]

    Unit --> Component --> Integration --> Contract --> Security --> E2E --> A11y --> Smoke
```

---

## 2. Testing Frameworks & Coverage Standards

| Test Layer | Test Runner / Tooling | Target Environment | Coverage Target |
| :--- | :--- | :--- | :---: |
| **Unit Tests** | Vitest | In-Memory (Node.js) | $> 90\%$ on Domain / Calculation Engines |
| **Component Tests** | Vitest + React Testing Library | jsdom | $> 80\%$ on shared UI components |
| **Integration Tests** | Vitest + Supertest | Disposable PostgreSQL Docker Container | All API Endpoints & DB Constraints |
| **Contract Tests** | Vitest + Zod | In-Memory | All shared API Schemas |
| **Security / RBAC** | Vitest | Real PostgreSQL Test DB | 100% of Scoped Route Guards |
| **End-to-End** | Playwright | Headless Chromium / Firefox / WebKit | Critical Leadership Journeys |
| **Accessibility** | `@axe-core/playwright` | Headless Chromium | 0 Critical or Serious a11y violations |

---

## 3. Real Database Testing Rule (ADR-0010)
**Database Mocking Prohibited for Integration Tests:** Integration tests must never mock PostgreSQL or Drizzle queries. They must execute against a real disposable PostgreSQL instance in Docker to validate foreign keys, composite unique constraints, check constraints, and atomic transactions.
