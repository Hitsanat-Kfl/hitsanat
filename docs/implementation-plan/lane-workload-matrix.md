# Lane Workload Matrix

## Hitsanat Kifl Children's Ministry Management System
**Legend:** PRIMARY | SUPPORT | REVIEW | NONE

---

## 1. Phase Participation Matrix

| Phase | Abrham (Core+Backend) | Israel (Backend Support) | Eyob (Frontend) | TBD (Frontend) |
|:---|:---:|:---:|:---:|:---:|
| **Phase 0: Architecture & Planning** | PRIMARY | NONE | REVIEW | REVIEW |
| **Phase 1: Engineering Foundation** | PRIMARY | SUPPORT | NONE | NONE |
| **Phase 2: Authentication & Authorization** | PRIMARY | SUPPORT | SUPPORT | SUPPORT |
| **Phase 3: Organization Structure** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 4: Children & Parents** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 5: Planning** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 6: Operational Tracking** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 7: Reporting & Dashboard** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 8: Portfolio & Public** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 9: Hardening** | PRIMARY | SUPPORT | PRIMARY | PRIMARY |
| **Phase 10: Deployment** | PRIMARY | SUPPORT | SUPPORT | SUPPORT |

---

## 2. Task Count by Person per Phase

| Phase | Abrham | Israel | Eyob | TBD |
|:---|:---:|:---:|:---:|:---:|
| Phase 0 | 10 | 0 | 0 | 0 |
| Phase 1 | 8 | 2 | 0 | 0 |
| Phase 2 | 4 | 2 | 1 | 1 |
| Phase 3 | 4 | 3 | 1 | 1 |
| Phase 4 | 3 | 2 | 2 | 1 |
| Phase 5 | 5 | 3 | 1 | 1 |
| Phase 6 | 6 | 3 | 2 | 2 |
| Phase 7 | 2 | 3 | 2 | 1 |
| Phase 8 | 3 | 3 | 2 | 2 |
| Phase 9 | 6 | 2 | 1 | 1 |
| Phase 10 | 8 | 2 | 0 | 0 |
| **Total** | **58** | **25** | **12** | **10** |

---

## 3. Frontend Workload Distribution

### Eyob (12 tasks)

| Phase | Task | Application | Complexity |
|:---|:---|:---|:---|
| Phase 2 | Admin Login Page | Admin | Medium |
| Phase 3 | Member Registration Wizard UI | Admin | High |
| Phase 4 | Parent Linking UI | Admin | Medium |
| Phase 4 | Child List & Detail UI | Admin | Medium |
| Phase 5 | Planning Matrix UI | Admin | High |
| Phase 6 | Attendance Checksheets UI | Admin | High |
| Phase 6 | Academic Score Entry UI | Admin | Medium |
| Phase 7 | Executive Dashboard | Admin | High |
| Phase 7 | Report Generation UI | Admin | Medium |
| Phase 8 | Portfolio Home Page | Portfolio | Medium |
| Phase 8 | Public Stats Display | Portfolio | Low |
| Phase 8 | Portfolio E2E & Accessibility Tests | Portfolio | Medium |

### TBD (10 tasks)

| Phase | Task | Application | Complexity |
|:---|:---|:---|:---|
| Phase 2 | Admin Route Guards | Admin | Medium |
| Phase 3 | Member List & Detail UI | Admin | Medium |
| Phase 4 | Child Registration UI | Admin | Medium |
| Phase 5 | Sub-Dept Plan Execution UI | Admin | High |
| Phase 6 | Transport Dispatcher UI | Admin | Medium |
| Phase 6 | Event Management UI | Admin | High |
| Phase 7 | Sub-Department Dashboards | Admin | High |
| Phase 8 | Event Countdown Displays | Portfolio | Medium |
| Phase 8 | Announcement Feed | Portfolio | Medium |
| Phase 9 | Portfolio Accessibility Audit | Portfolio | Medium |

### Frontend Balance Analysis

- **Eyob:** 12 tasks — 8 Admin, 4 Portfolio
- **TBD:** 10 tasks — 7 Admin, 3 Portfolio
- **Balance:** Approximately equal workload. Eyob has 2 more tasks but several are lower complexity. TBD's tasks include some high-complexity items (planning execution, event management, dashboards).

---

## 4. Backend Workload Distribution

### Abrham (58 tasks)

Abrham handles all core architecture, complex business logic, and critical-path backend work:
- All database schema contracts and migrations (Phase 0–1)
- All shared packages (Phase 1)
- Authentication and RBAC (Phase 2)
- Complex API endpoints (Phases 3–8)
- Domain logic engines (weight calculation, progress roll-up, auto-seeding)
- Security audits and hardening (Phase 9)
- All deployment infrastructure (Phase 10)

### Israel (25 tasks)

Israel handles simpler, well-defined backend tasks:
- Seed scripts and simple validation packages (Phase 1)
- Auth tests and documentation (Phase 2)
- CRUD endpoints for members, sub-departments (Phase 3)
- Parent CRUD, tests (Phase 4)
- Plan queries, tests (Phase 5)
- Academic API, event attendance (Phase 6)
- Report submissions, tests (Phase 7)
- Telegram worker, tests (Phase 8)
- Performance testing, documentation (Phase 9–10)

---

## 5. Cross-Person Collaboration Points

| Collaboration | People | Phase | Nature |
|:---|:---|:---|:---|
| Schema contract review | Abrham ↔ Israel | Phase 0 | Israel reviews for feasibility |
| Auth implementation | Abrham ↔ Eyob/TBD | Phase 2 | Abrham implements API, Eyob/TBD builds login UI |
| Member registration | Abrham ↔ Eyob/TBD | Phase 3 | Abrham provides API, Eyob builds wizard, TBD builds list |
| Attendance system | Abrham ↔ Eyob/TBD | Phase 6 | Abrham implements auto-seeding, Eyob builds checksheets |
| Planning system | Abrham ↔ Eyob/TBD | Phase 5 | Abrham implements engines, Eyob builds matrix |
| Portfolio launch | Abrham ↔ Eyob/TBD | Phase 8 | Abrham provides public API, Eyob/TBD build portfolio pages |
| Production deployment | Abrham ↔ All | Phase 10 | Abrham leads deployment, all verify their areas |
| Peer review | Eyob ↔ TBD | Phases 2–9 | Frontend developers review each other's PRs |

---

## 6. Peak Workload Analysis

### Abrham (58 tasks)
- **Peak phases:** Phase 0 (10), Phase 10 (8), Phase 9 (6), Phase 6 (6)
- **Bottleneck risk:** High — Abrham is on critical path for every phase
- **Mitigation:** Delegate CRUD tasks to Israel, focus on architecture and critical-path items

### Israel (25 tasks)
- **Peak phases:** Phase 3 (3), Phase 5 (3), Phase 6 (3), Phase 7 (3)
- **Bottleneck risk:** Low — Work is distributed evenly
- **Note:** Israel has the most tasks but they are simpler; well-suited for parallel execution

### Eyob (12 tasks)
- **Peak phases:** Phase 6 (2), Phase 7 (2), Phase 8 (3)
- **Bottleneck risk:** Low — Focused frontend scope
- **Note:** Eyob is idle during Phases 0–1; can support shared UI component development

### TBD (10 tasks)
- **Peak phases:** Phase 6 (2), Phase 8 (2)
- **Bottleneck risk:** Low — Focused frontend scope
- **Note:** Position not yet assigned; tasks remain unassigned until person is confirmed
