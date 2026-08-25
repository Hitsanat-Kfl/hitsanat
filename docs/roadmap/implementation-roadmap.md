# Implementation Roadmap & Release Phases

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Phased Engineering Strategy**  

---

## 1. Release Timeline Overview

```mermaid
gantt
    title Hitsanat Kifl Implementation Phases
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation
    Member Auth & RBAC          :p1_1, 2026-09-01, 14d
    Family & Sub-Dept System    :p1_2, after p1_1, 10d
    Executive Dashboards        :p1_3, after p1_2, 10d
    section Phase 2: Beneficiaries
    Children & Parent Registry  :p2_1, after p1_3, 12d
    Attendance & Transport      :p2_2, after p2_1, 14d
    section Phase 3: Workflows
    Timihrt Education & Exams   :p3_1, after p2_2, 12d
    Mezmur & Kinetibeb Modules  :p3_2, after p3_1, 12d
    section Phase 4: Strategy
    Action Plan Master Matrix   :p4_1, after p3_2, 16d
    Distribution & Roll-Up      :p4_2, after p4_1, 14d
    section Phase 5: Outreach
    Reports & Announcements     :p5_1, after p4_2, 12d
    Portfolio & Telegram Sync   :p5_2, after p5_1, 10d
```

---

## 2. Phase Breakdown & Acceptance Criteria

### Phase 1: Ministry Foundation & Governance
- **Modules:** `members`, `families`, `sub-departments`, `packages/auth`, `packages/permissions`.
- **Database:** Member profiles, sub-dept scoped memberships, family Father/Mother assignments.
- **API:** Authentication (`/api/v1/auth/*`), member 2-stage creation, family CRUD.
- **Frontend:** Login page, Chairperson overview, Secretary member registration wizard.
- **Acceptance Criteria:** Leaders can authenticate; regular members are denied access; Secretary can register student servants and assign them to families and sub-departments.

### Phase 2: Children, Parents & Attendance Logistics
- **Modules:** `children`, `parents`, `attendance`, `packages/calendar`.
- **Database:** Child profiles, Parent contacts, composite unique parent cardinality, session attendance rosters.
- **API:** Child registration, parent linking, auto-seeded attendance verification, Saturday transport assignment.
- **Frontend:** Kutitr attendance checksheets, child directory, 5-route transport dispatcher.
- **Acceptance Criteria:** Strict parent cardinality enforced; attendance records auto-seed upon session scheduling; Kutitr can confirm attendance on mobile.

### Phase 3: Sub-Department Educational & Cultural Workflows
- **Modules:** `academic-tracking`, `mezmur`, `kinetibeb`.
- **Database:** Timihrt curriculum, exam scores, Mezmur songbook, Kinetibeb films & storytelling roster.
- **API:** Syllabus endpoints, gradebook scoring, choir rehearsal schedules.
- **Frontend:** Timihrt teacher roster and gradebook, Mezmur hymn viewer, Kinetibeb schedule manager.
- **Acceptance Criteria:** Timihrt teachers enter scores; Mezmur leaders schedule Astegni choir conductors.

### Phase 4: Strategic Action Plan & Hierarchical Execution
- **Modules:** `planning`, `events`.
- **Database:** Annual master plan (2016 E.C.), 6 goals, 25 activities, weight metrics, weekly plans, progress records.
- **API:** Master plan creation, 3-factor weight engine, plan distribution to sub-departments, weekly task logging, bottom-up progress roll-up.
- **Frontend:** Interactive Master Plan spreadsheet matrix, sub-department plan execution view, progress KPI charts.
- **Acceptance Criteria:** Weight calculation matches Action PLN formula ($\sum = 100.0\%$); weekly task completion rolls up to annual progress.

### Phase 5: Reporting, Outreach & Integrations
- **Modules:** `reports`, `announcements`, `apps/portfolio`, `apps/telegram`.
- **API:** Periodic report consolidation, public stats feed, announcement webhooks.
- **Frontend / Worker:** Public portfolio website with live feast countdowns, Telegram broadcast worker.
- **Acceptance Criteria:** Ekd generates consolidated quarterly reports; announcements publish to public website and Telegram group simultaneously.
