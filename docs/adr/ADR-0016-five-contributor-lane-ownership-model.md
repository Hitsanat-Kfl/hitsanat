# ADR-0016: Five-Contributor Multi-Lane Team Ownership Model

**Status:** Accepted  
**Deciders:** Project Manager, Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
The development team consists of 5 contributors with varied experience levels:
- 1 Core/Overall Lead (Abrham)
- 1 Supporting Backend Contributor (Israel)
- 2 Frontend Contributors

Uncoordinated modifications across domain architecture, authentication, database migrations, and UI contracts cause merge conflicts and structural degradation.

---

## Decision
Formalize strict lane boundaries:
1. **Core Lead (Abrham):** Owns overall system architecture, database schema, Better Auth, scoped RBAC, core domain calculation engines, CI/CD, and all backend code reviews.
2. **Supporting Backend (Israel):** Implements well-defined CRUD endpoints, Zod schemas, seed scripts, focused integration tests, and documentation under mandatory Core Lead review. Cannot self-merge.
3. **Frontend Lane (2 Contributors):** Owns Next.js admin portal, portfolio site, shadcn/ui components, and TanStack Query integration against approved API contracts.

---

## Consequences
### Positive:
- Protects critical security, database, and domain architecture from accidental regressions.
- Provides a clear, productive contribution path for every team member according to their skill level.
