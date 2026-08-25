# ADR-0008: Express.js with TypeScript as Backend Framework

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
The project requires a mature, robust, and universally understood HTTP backend framework in TypeScript that seamlessly integrates with Better Auth, Drizzle ORM, Zod validation, and Swagger OpenAPI documentation, while supporting Clean Architecture and Modular Monolith structuring. Earlier drafts suggested Fastify, but the team's familiarity and existing tooling aligned strongly with Express.js.

---

## Decision
Adopt **Express.js** with TypeScript as the primary HTTP framework for `apps/api`.
Express is restricted to the Presentation layer (Routing, Middleware, Controllers, Error Serialization). Domain logic and Application use cases remain strictly framework-independent.

---

## Consequences
### Positive:
- High team familiarity and zero learning curve for supporting backend contributors.
- Direct ecosystem compatibility with Better Auth, Swagger UI Express, Pino HTTP, and CORS/Helmet.
- Clean Architecture ensures that migrating HTTP transport in the future would require changing only the presentation adapter.

### Negative:
- Slightly higher memory footprint than Fastify, easily mitigated on Render standard instances.
