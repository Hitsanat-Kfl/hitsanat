# ADR-0004: Canonical Gregorian Storage with Ethiopian Boundary Conversion

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
The Hitsanat Kifl Children's Ministry operates entirely on the Ethiopian Calendar (ዓመተ ምሕረት / E.C.) for academic terms, weekend ministry schedules, liturgical feasts (*Timket*, *Hosaena*), and monthly celebrations (e.g. monthly 15th birthday events). 

However, relational database engines (PostgreSQL), ORMs (Drizzle), third-party authentication systems, cloud runtime schedulers, and standard SQL date-time functions natively operate on the Gregorian calendar (UTC). Storing dates as raw string representations of Ethiopian dates (e.g. `"2016-02-15"`) would destroy native SQL indexing, date arithmetic, range filtering, and chronological sorting.

---

## Decision
1. **Canonical Database Storage:** All dates and timestamps are stored in PostgreSQL using native Gregorian `DATE` and `TIMESTAMPTZ` data types in UTC.
2. **Boundary Conversion:** The shared package `@hitsanat/calendar` (wrapping `ethiopian-calendar-new`) translates Gregorian dates to/from Ethiopian calendar representations at the application boundary (API presentation and UI layers).
3. **No Inline Date Math:** Application and UI layers must never perform custom Ethiopian date math inline; all conversions must use `@hitsanat/calendar`.

---

## Consequences
### Positive:
- Standard ANSI SQL indexing, chronological sorting, and range queries (`WHERE date >= ...`) work natively in PostgreSQL.
- Total compatibility with third-party libraries, ORMs, and date pickers.
- Centralized, fully unit-tested conversion and holiday logic in one package.

### Negative:
- Querying for recurring Ethiopian events (e.g., Ethiopian 15th birthday) requires converting the search boundary to Gregorian date ranges before querying.
