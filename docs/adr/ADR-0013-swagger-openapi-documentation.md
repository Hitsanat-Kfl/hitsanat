# ADR-0013: OpenAPI 3.1 Contract Generation via Zod and Swagger UI

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Manually writing separate Swagger/OpenAPI YAML specifications alongside TypeScript controllers leads to documentation drift, outdated schemas, and integration bugs between frontend and backend contributors.

---

## Decision
1. **Single Source of Truth:** All API request/response contracts are defined as Zod schemas in `packages/validation`.
2. **Automated OpenAPI Generation:** OpenAPI 3.1 metadata is registered using `@asteasolutions/zod-to-openapi` directly from the Zod schemas.
3. **Swagger UI Hosting:** The Express backend serves interactive API documentation at `/api/docs` and exposes raw JSON at `/api/docs/openapi.json`.

---

## Consequences
### Positive:
- API documentation is guaranteed to match runtime validation and TypeScript types.
- Frontend developers have an interactive sandbox at `/api/docs` to test endpoints during development.

### Negative:
- Requires minor boilerplate to attach OpenAPI metadata to Zod schemas.
