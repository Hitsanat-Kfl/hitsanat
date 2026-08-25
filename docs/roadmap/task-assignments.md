# Implementation Task Matrix & Assignments

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Team Lane Allocation:** Core Lead (Abrham), Supporting Backend (Israel), Frontend Lane (2 Devs)  

---

## 1. Granular Task Inventory

| Task ID | Task Description | Module | Priority | Owner | Reviewer | Dependencies | Acceptance Criteria | Test Requirements |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **TSK-01** | Database Schema & Drizzle Setup | `packages/database` | **P0** | **Core Lead** | Self / PM | None | Drizzle schemas & initial migration generated | Migration integration test |
| **TSK-02** | Better Auth & Scoped RBAC Engine | `packages/auth`, `packages/permissions` | **P0** | **Core Lead** | Self / PM | TSK-01 | Session cookies working; scoped middleware denies non-leaders | Scoped RBAC security test suite |
| **TSK-03** | Ethiopian Calendar Package Adapter | `packages/calendar` | **P0** | **Core Lead** | Self / PM | None | Bidirectional Gregorian/Ethiopian conversion; birthday month queries | 100% unit test coverage |
| **TSK-04** | Planning 3-Factor Weight Engine | `packages/domain` | **P0** | **Core Lead** | Self / PM | None | Mathematical weight formula matching Action PLN ($\sum = 100\%$) | Unit test suite for 25 activities |
| **TSK-05** | Member Stage 1 & 2 Use Cases & API | `apps/api/src/modules/members` | **P1** | **Israel** | Core Lead | TSK-01, TSK-02 | Secretary can create draft and enrich member profiles | Route integration test |
| **TSK-06** | Family Unit Management Endpoints | `apps/api/src/modules/families` | **P1** | **Israel** | Core Lead | TSK-05 | Father/Mother assignment and member allocation CRUD | Integration tests |
| **TSK-07** | Children & Parent Linking Endpoints | `apps/api/src/modules/children`, `parents` | **P1** | **Israel** | Core Lead | TSK-01, TSK-03 | Child registration; composite unique constraint on parent relation | Cardinality constraint test |
| **TSK-08** | Attendance Seeding & Confirmation API | `apps/api/src/modules/attendance` | **P1** | **Core Lead** | Self / PM | TSK-01, TSK-07 | Session scheduling auto-seeds `Expected` attendance rows | Auto-seeding integration test |
| **TSK-09** | Academic Assessment & Scoring API | `apps/api/src/modules/academic-tracking`| **P2** | **Israel** | Core Lead | TSK-01, TSK-07 | Timihrt leaders can record Mid/Final exam scores | Score validation test |
| **TSK-10** | Planning Master Matrix & Distribution API| `apps/api/src/modules/planning` | **P0** | **Core Lead** | Self / PM | TSK-04 | Ekd creates plan; distributes to sub-depts; weekly roll-up | Roll-up calculation test |
| **TSK-11** | Events & Extra Training Rehearsals API| `apps/api/src/modules/events` | **P2** | **Israel** | Core Lead | TSK-08 | Special feast creation; program assignment with $\ge 2$ members | Multi-member rule test |
| **TSK-12** | Reports Aggregator & PDF Generator | `apps/api/src/modules/reports` | **P2** | **Israel** | Core Lead | TSK-10 | Consolidated periodic reports generated from sub-dept logs | Report integration test |
| **TSK-13** | Announcements & Telegram Worker | `apps/api`, `apps/telegram` | **P2** | **Israel** | Core Lead | TSK-01 | Web & Telegram broadcast triggers on published announcements | Telegram mock worker test |
| **TSK-14** | Shared UI Design System & Preset Setup | `packages/ui` | **P0** | **Frontend Lane**| Core Lead | None | shadcn/ui preset `b1D0f7S7` configured with design tokens | Component test suite |
| **TSK-15** | Admin Layout, Sidebar & Auth Routing | `apps/admin` | **P0** | **Frontend Lane**| Core Lead | TSK-02, TSK-14 | Dynamic role-based navigation and protected route guards | Playwright Auth E2E |
| **TSK-16** | Secretary Registration Wizard UI | `apps/admin` | **P1** | **Frontend Lane**| Core Lead | TSK-05, TSK-06 | Stage 1 fast add modal; Stage 2 multi-dept allocation | Component form test |
| **TSK-17** | Kutitr Attendance & Transport UI | `apps/admin` | **P1** | **Frontend Lane**| Core Lead | TSK-08 | Mobile attendance checksheets for 5 collection routes | Playwright mobile viewport test |
| **TSK-18** | Action Plan Master Matrix UI | `apps/admin` | **P0** | **Frontend Lane**| Core Lead | TSK-10 | Interactive 25-activity planning spreadsheet with progress bars | Table component test |
| **TSK-19** | Timihrt, Mezmur & Kinetibeb Dashboards| `apps/admin` | **P2** | **Frontend Lane**| Core Lead | TSK-09, TSK-11 | Scoped department dashboards with teacher/song/film rosters | Playwright scoped E2E |
| **TSK-20** | Public Portfolio Website & Live Countdowns| `apps/portfolio` | **P2** | **Frontend Lane**| Core Lead | TSK-11, TSK-13 | Public showcase, stats cards, and active feast countdowns | Playwright a11y & visual test |
