# ADR-0009: shadcn/ui Component Foundation with Shared `@hitsanat/ui` Package

**Status:** Accepted  
**Deciders:** Frontend Team, Abrham (Core Lead)  
**Date:** August 2026  

---

## Context
The project requires an accessible, responsive, modern component library for the Next.js leadership portal (`apps/admin`) and public website (`apps/portfolio`). Custom design presets and Ethiopian localization must be shared across both applications without code duplication.

---

## Decision
1. Use **shadcn/ui** initialized with the project preset `b1D0f7S7` and the Next.js template:
   ```bash
   pnpm dlx shadcn@latest init --preset b1D0f7S7 --template next
   ```
2. Maintain all shared UI components, design tokens, and custom composite components inside `packages/ui`.
3. Applications import UI primitives from `@hitsanat/ui` rather than duplicating component code.

---

## Consequences
### Positive:
- Consistent design tokens, typography, and theme styling across both applications.
- Full access to Radix UI accessibility primitives (keyboard navigation, ARIA).
- Complete code ownership over UI components without heavy external runtime dependencies.
