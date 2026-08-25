# ADR-0002: Member Attendance Auto-Seeds from Activity Assignment

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Kutitr Leadership  
**Date:** August 2026  

---

## Context
In previous manual workflows, Kutitr officials had to construct attendance lists from scratch each weekend by typing names of scheduled members and children, leading to omissions, delayed headcounts, and operational friction.

---

## Decision
When a program session, Saturday collection route, or event training segment is scheduled and servants/cohorts are assigned, the domain automatically creates matching attendance records with initial status `Expected`. Kutitr leaders confirm `Present`, `Absent`, or `Excused` during or after the session.

---

## Consequences
### Positive:
- Reduces Kutitr data entry time on Saturday morning by over 80%.
- Eliminates unassigned attendance discrepancies.
- Enables immediate visibility into expected vs actual attendance ratios.

### Negative:
- Requires domain event handling or transactional seeding logic upon assignment creation.
