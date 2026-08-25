# ADR-0010: Layered Testing Strategy with Real PostgreSQL Integration Testing

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
The Hitsanat Kifl system handles complex mathematical calculations (3-factor Action Plan weights), multi-level hierarchical progress roll-ups, strict parent-child cardinality constraints, and scoped multi-role permissions. Relying solely on unit tests or in-memory database mocks (e.g. SQLite / mock libraries) frequently fails to catch real PostgreSQL foreign key violations, transaction race conditions, and composite unique constraint edge cases.

---

## Decision
Adopt a comprehensive, layered testing strategy:
1. **Unit Tests (Vitest):** Domain models, calculation engines, calendar adapters, validation rules.
2. **Component Tests (Vitest + React Testing Library):** UI forms, tables, dialogs, Ethiopian date picker.
3. **Integration Tests (Vitest + Supertest + Real PostgreSQL):** Express routes and Drizzle queries execute against a real disposable PostgreSQL database running in Docker. Database mocking is strictly prohibited for integration tests.
4. **End-to-End Tests (Playwright):** Full leadership journeys across Chrome and Mobile viewports.
5. **Accessibility Audits (`@axe-core/playwright`):** Automated WCAG 2.1 Level AA compliance tests.
6. **Security / RBAC Tests (Vitest):** Positive and negative permission verification for all leadership scopes.

---

## Consequences
### Positive:
- High confidence in real database constraints, migrations, and atomic transactions.
- Fast local and CI feedback via Vitest parallel execution.
- Guaranteed catch of permission regressions and non-leadership access attempts.

### Negative:
- Running integration tests locally requires a running Docker environment.
