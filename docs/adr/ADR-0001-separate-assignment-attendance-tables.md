# ADR-0001: Separate Assignment/Attendance Tables per Activity Type

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Hitsanat Kifl tracks attendance across diverse activity types:
1. Regular weekend sessions (Saturday 8:00–11:30 AM, Sunday 8:00–10:00 AM)
2. Special liturgical feast events (e.g. *Timket*, *Hosaena*)
3. Extra choir and spiritual drama training sessions

A naive implementation might use a single polymorphic `attendances` table with nullable foreign keys (`session_id`, `event_id`) or a `target_type` string column. However, polymorphic associations sacrifice relational database integrity, prevent foreign key cascade guarantees, and complicate index tuning.

---

## Decision
Create distinct, normalized database tables for regular sessions and special events:
- `program_sessions`, `program_session_assignments`, `program_session_attendance`
- `events`, `event_program_assignments`, `event_attendance`

---

## Consequences
### Positive:
- Strict foreign key constraints and `ON DELETE CASCADE` enforced by PostgreSQL.
- Specialized indexes for high query performance.
- Clear domain boundaries between regular operational routines and irregular event schedules.

### Negative:
- Minor schema duplication across regular and event attendance tables.

---

## Alternatives Considered
- Single polymorphic `attendance` table: Rejected due to loss of foreign key referential integrity in PostgreSQL.
