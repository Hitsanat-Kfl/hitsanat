# ADR-0011: Ethiopian Calendar Implementation via `ethiopian-calendar-new`

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Ethiopian calendar conversion requires accurate date math, handling 13 months (Meskerem to Pagume), 4-year leap year cycles, and Amharic month naming. Implementing custom conversion math from scratch introduces high defect risks around month transitions and leap days.

---

## Decision
1. Standardize on the audited npm package `ethiopian-calendar-new`:
   ```bash
   pnpm add ethiopian-calendar-new
   ```
2. Encapsulate all library imports and domain extensions within the shared package `@hitsanat/calendar`.
3. No application or module may import date conversion utilities directly; all calendar conversions must pass through `@hitsanat/calendar`.

---

## Consequences
### Positive:
- Battle-tested leap year and month arithmetic.
- Single shared package providing conversion, birthday calculation, and feast date determination.
