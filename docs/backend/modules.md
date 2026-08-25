# Backend Modules Organization & Boundaries

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

## 1. Feature Modules Inventory

```text
apps/api/src/modules/
├── members/                 # M-01: Student Servant Lifecycle & Profiles
├── families/                # M-02: Family (Khnet) Groups, Fathers & Mothers
├── sub-departments/         # M-03: Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb
├── children/                # M-04: Children Profiles, Groups & Birthdays
├── parents/                 # M-05: Parent Contacts & Cardinality Links
├── attendance/              # M-06: Session & Event Headcounts & Transport
├── academic-tracking/       # M-07: Syllabus, Exams & Student Scores
├── planning/                # M-08: Annual Master Plan, Weights & Roll-ups
├── events/                  # M-09: Feasts, Countdowns & Rehearsals
├── reports/                 # M-10: Periodic Reports & PDF Consolidation
└── announcements/           # M-11: Web & Telegram Broadcasts
```

---

## 2. Module Decoupling Guidelines

1. **Explicit Public Interface:** A module exposes only its `index.ts` export containing public Use Cases and DTOs. Internal entity implementations and Drizzle repositories remain private to the module.
2. **Database Schema Colocation in `packages/database`:** While table definitions are authored in `@hitsanat/database`, each backend module owns queries and mutations strictly pertaining to its domain entities.
