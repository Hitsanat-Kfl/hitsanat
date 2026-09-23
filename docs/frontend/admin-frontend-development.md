# Admin Frontend Development Guide

## Hitsanat Kifl Children's Ministry Management System

**Document Version:** 1.1  
**Application:** `apps/admin` (`@repo/admin`)  
**Port:** `3002`  
**Design system:** Hitsanat Kifl Design System v1.0 (`@repo/ui` — Burgundy `#5F0113` / Gold `#F3C913`)  
**Audience:** Frontend contributors (Frontend 1 / Frontend 2 lanes)  
**Source of Truth:** Functional requirements, RBAC matrix, dashboards/navigation specs, design tokens in `packages/ui`, and live `apps/admin` code

---

## 1. Overview

The Admin portal is a **private Next.js 15 management console** for Hitsanat Kifl leadership only. Regular members (`MEMBER_REGULAR`) have **no admin access** (ADR-0007) — they use the public portfolio and Telegram instead.

| Concern | Choice |
| :--- | :--- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| State / data | TanStack Query v5 |
| UI kit | shadcn/ui via `@repo/ui` — Design System v1.0 (ADR-0009) |
| Auth | Supabase Auth (`@supabase/ssr` middleware + client session) |
| Styling | Tailwind CSS + CSS variable tokens (`packages/ui/src/globals.css`) |
| API | Express API at `http://localhost:3001` (`API_PREFIX` `/api/v1`) |
| Lint / format | Biome (root) |
| Tests | Vitest + RTL (unit/component), Playwright (E2E) |
| Monorepo | pnpm workspaces + Turborepo |

**Hard boundaries:**

1. Frontend **must not** import `@repo/database` or talk to PostgreSQL directly.
2. All data goes through `apps/api`.
3. Client-side role UI hiding is **cosmetic only** — the API enforces RBAC (NFR-02.3).
4. Calendar math lives in `@repo/calendar` (Ethiopian display, Gregorian storage).

---

## 2. Monorepo, Turborepo & Frontend Packages

### 2.1 Workspace layout

```text
Hitsanat/
├── apps/
│   ├── admin/          # This guide — management console (port 3002)
│   ├── portfolio/      # Public website (port 3000)
│   └── api/            # Express REST API (port 3001)
├── packages/
│   ├── ui/             # @repo/ui — shared shadcn components + dashboard widgets
│   ├── calendar/       # @repo/calendar — Ethiopian ↔ Gregorian
│   ├── schemas/        # @repo/schemas — Zod contracts
│   ├── permissions/    # @repo/permissions — RBAC types/matrix (shared taxonomy)
│   ├── auth/           # @repo/auth — API JWT/RBAC (not used by browser directly)
│   ├── typescript-config/
│   └── biome-config/
├── turbo.json          # Turborepo task graph
├── pnpm-workspace.yaml # packages: apps/*, packages/*
└── package.json        # Root scripts
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2.2 Frontend package dependency map

```text
apps/admin      ───►  @repo/ui, @repo/schemas, @repo/calendar, @repo/config
apps/portfolio  ───►  @repo/ui, @repo/schemas, @repo/calendar, @repo/config
apps/api        ───►  @repo/database, @repo/auth, @repo/permissions, ...
```

Admin must **not** import `@repo/database`. Prefer:

| Need | Package |
| :--- | :--- |
| Buttons, cards, tables, dialogs, dashboard widgets | `@repo/ui` |
| Ethiopian date display / conversion | `@repo/calendar` |
| Shared response/request types | `@repo/schemas` |
| Role name constants (if needed client-side) | derive from session; API is authority |

### 2.3 Turborepo tasks (`turbo.json`)

| Task | Depends on | Outputs / notes |
| :--- | :--- | :--- |
| `build` | `^build` | `.next/**`, `dist/**`; inputs include `.env*` |
| `lint` | `^lint` | (root Biome also runs `biome lint .`) |
| `typecheck` | `^typecheck` | |
| `test` | `^build` | |
| `test:unit` | — | |
| `dev` | — | `cache: false`, `persistent: true` |

### 2.4 Root scripts relevant to frontend

| Command | What it runs |
| :--- | :--- |
| `pnpm dev` | `turbo run dev` (all apps, incl. admin on 3002) |
| `pnpm build` | `turbo run build` (topological package builds) |
| `pnpm typecheck` | `turbo run typecheck` |
| `pnpm lint` / `pnpm format` | Biome across monorepo |
| `pnpm test:unit` | Vitest unit/component (excludes integration/e2e) |
| `pnpm test:e2e` | Playwright |
| `pnpm prepare` | Full quality gate before push |

Admin-only examples:

```bash
pnpm --filter @repo/admin dev
pnpm --filter @repo/admin build
pnpm --filter @repo/admin typecheck
```

### 2.5 Why Turborepo for frontend work

- **Topological builds:** `@repo/ui` builds before apps that depend on it (`dependsOn: ["^build"]`).
- **Remote/local cache:** repeated `build`/`typecheck` skip unchanged packages.
- **Single entrypoints:** one `pnpm build` validates UI package + admin + portfolio together.
- **CI alignment:** GitHub Actions runs the same turbo/biome/vitest/playwright scripts.

---

## 3. Admin Folder Structure

```text
apps/admin/
├── app/
│   ├── layout.tsx
│   ├── (unauthenticated)/
│   │   └── login/page.tsx          # Public login
│   └── (authenticated)/            # Behind middleware session
│       ├── page.tsx                # DashboardRouter (role home)
│       ├── dashboard/page.tsx
│       ├── members/                # Directory + [id] detail
│       ├── children/               # Directory + [id] + parents
│       ├── sub-departments/        # List + [code] + [code]/dashboard
│       ├── attendance/
│       ├── academic/
│       ├── events/
│       ├── transport/
│       ├── planning/               # List + [id] + [id]/execute
│       ├── reports/
│       ├── users/                  # List + [id] (BR-008)
│       ├── audit-logs/
│       ├── permissions/            # Static matrix (FR-13.3)
│       ├── secretary/
│       ├── sub-chairperson/
│       ├── super-admin/
│       ├── mezmur/
│       └── settings/
├── src/                            # All application code (path alias @/* → ./src/*)
│   ├── config/
│   │   ├── roles.ts                # AdminRole union + ADMIN_ROLES
│   │   ├── dashboard.ts            # Role-aware dashboard layouts
│   │   └── navigation.ts           # Centralized nav (sidebar + role filter)
│   ├── authorization/              # ADR-0007 portal-access helpers
│   ├── domains/                    # Shared types (+ definitions.ts facade)
│   ├── infrastructure/
│   │   ├── api/client.ts           # Typed fetch to apps/api (/api/v1)
│   │   └── auth/supabase-client.ts # Browser Supabase client
│   ├── features/                   # Feature slices (primary code home)
│   │   ├── authentication/         # Session user, RouteGuard helpers
│   │   ├── member-management/      # Table, wizard, filters, profile
│   │   ├── user-management/        # CRUD, reset, handover, member picker
│   │   ├── child-management/
│   │   ├── department-management/  # Roster, KPI, progress tracker
│   │   ├── attendance-management/
│   │   ├── event-management/
│   │   ├── report-generation/
│   │   ├── audit-management/
│   │   ├── planning/
│   │   ├── academic/
│   │   ├── transport/
│   │   ├── permissions/
│   │   └── settings/
│   ├── widgets/
│   │   ├── shell/                  # AppShell, sidebar, header, search, i18n
│   │   │   └── (nav re-exports from @/config/navigation)
│   │   └── dashboard/              # DashboardRouter + per-role dashboards
│   │       └── components/
│   │           ├── dashboard-router.tsx
│   │           ├── super-admin-dashboard.tsx
│   │           ├── chairperson-dashboard-page.tsx
│   │           ├── sub-chairperson-dashboard.tsx
│   │           ├── secretary-dashboard.tsx
│   │           └── mezmur-dashboard.tsx
│   ├── shared/                     # Cross-cutting UI (when needed)
│   └── providers/                  # App-level providers (when needed)
├── middleware.ts                   # Session refresh + login redirect
├── public/
├── tests/                          # Vitest component tests (import ../src/…)
├── components.json                 # shadcn config
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── package.json                    # name: @repo/admin
```

### 3.1 Feature-slice conventions

Each feature directory typically has:

```text
src/features/<name>/
├── index.ts                 # Public exports
├── components/              # Presentational + container components
├── hooks/                   # Data hooks (use-members, use-plans, …)
└── (optional) config/       # Feature-local constants
```

**Rules:**

- Pages under `app/(authenticated)/…` stay thin: compose feature components.
- Data fetching lives in `src/features/*/hooks` via `@/infrastructure/api/client`.
- Shared chrome (sidebar/header) lives in `src/widgets/shell`; nav data lives in `src/config/navigation.ts`.
- Portal-access checks live in `src/authorization` (ADR-0007) — do not fork them.
- Role dashboard widgets should prefer `@repo/ui` dashboard primitives when possible.
- Path alias: `@/*` → `apps/admin/src/*` (tsconfig + vitest).

---

## 4. Runtime Architecture

### 4.1 Request / auth flow

```text
Browser
  │
  ├─ Next middleware (middleware.ts)
  │    └─ createServerClient → supabase.auth.getUser()
  │    ├─ no session + non-public path → redirect /login
  │    └─ session on /login → redirect app default
  │
  ├─ RouteGuard / useAuthUser (features/auth)
  │    └─ leadership-only access (ADR-0007)
  │
  ├─ DashboardRouter (app page /)
  │    └─ maps globalRoles → role dashboard or sub-dept redirect
  │
  └─ Feature hooks (TanStack Query)
       └─ lib/api-client → GET/POST http://api:3001/api/v1/...
            └─ API requireAuth + requireScopePermission (authoritative RBAC)
```

### 4.2 Middleware (`apps/admin/middleware.ts`)

- Uses `@supabase/ssr` `createServerClient` with request/response cookies.
- Refreshes session (`getUser()`).
- Public paths: `/login`, `/api`, `/_next`, `/favicon.ico`.
- Unauthenticated → `/login?redirect=<path>`.
- Authenticated on `/login` → redirect to `redirect` or `/`.

### 4.3 Role home routing (`DashboardRouter`)

Presentation-level only (API still enforces access):

| Session roles | Result |
| :--- | :--- |
| `SUPER_ADMIN` | Super Admin dashboard |
| `CHAIRPERSON` | Chairperson dashboard |
| `SUB_CHAIRPERSON` | Vice-Chairperson dashboard |
| `SECRETARY` | Secretary dashboard |
| `MEZMUR_LEADER` | Mezmur dashboard |
| Sub-dept officer (`Leader` / `Sub-Leader` / `Secretary` in a scope) | `/sub-departments/<code>/dashboard` |
| Unauthenticated / loading | Spinner pane |

### 4.4 Data layer patterns

- **Query keys:** hierarchical arrays, e.g. `['members', { search, subDept }]`, `['annual-plans', year]`.
- **Mutations:** invalidate related keys; optimistic UI for attendance/status toggles.
- **Errors:** Sonner toasts + empty/error states from `@repo/ui`.
- **Base URL:** from `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).

---

## 5. RBAC Model (Frontend View)

### 5.1 Global roles vs scoped roles

| Layer | Values | Scope |
| :--- | :--- | :--- |
| Global / executive | `SUPER_ADMIN`, `CHAIRPERSON`, `SUB_CHAIRPERSON`, `SECRETARY` | Whole system (or admin core for Secretary) |
| Sub-department scoped | Leader / Sub-Leader / Secretary / Member per dept | One of: Timihrt, Mezmur, Kutitr, Ekd, Kinetibeb |
| No portal access | `MEMBER_REGULAR` without leadership post | Portfolio + Telegram only |

Session `globalRoles` use UPPER_SNAKE (`SUPER_ADMIN`); nav config maps them to hyphenated UI roles (`super-admin`) via `SESSION_ROLE_MAP` in `src/config/navigation.ts`.

Admin UI role union (`src/config/roles.ts`):

```ts
export const ADMIN_ROLES = [
  "chairperson",
  "sub-chairperson",
  "secretary",
  "timihrt-leader",
  "mezmur-leader",
  "kutitr-leader",
  "ekd-leader",
  "kinetibeb-leader",
  "super-admin",
] as const;
```

### 5.2 Business rules the UI must respect

| Rule | Frontend implication |
| :--- | :--- |
| **ADR-0007 / BR-021** | Non-leadership users never see admin shell; guard rejects them |
| **BR-007** | Leadership accounts must link to an active member (use member picker) |
| **BR-008** | Only Super Admin + Chairperson manage user accounts (`/users`) |
| **BR-009** | One leadership post per member — surface API validation errors on role assign |
| **BR-010** | At most one Father + one Mother per child |
| **BR-019** | Meetings: Chair / Sub-Chair / Secretary only |
| **ADR-0018** | Sub-Chairperson can approve plans/reports/events; **not** user accounts |
| **NFR-02.3** | Hiding nav items is not security — handle 403 from API |

### 5.3 Permission matrix (summary)

Full matrix: `docs/requirements/roles-and-permissions.md` §3. Frontend highlights:

| Area | Super Admin | Chair | Sub-Chair | Secretary | Sub-dept Leader |
| :--- | :---: | :---: | :---: | :---: | :---: |
| User accounts | CRUD | CRUD | — | — | — |
| Audit logs | R | R | R (via oversight UI) | R (record changes) | — |
| Members / families | CRUD | CRUD | R/CRUD oversight | CRUD | Read (scoped) |
| Children / parents | CRUD | CRUD | R | CRUD | Kutitr CRUD; others R |
| Attendance | CRUD | CRUD | R | R | Kutitr CRUD; others R |
| Academic scores | CRUD | CRUD | R | R | Timihrt CRUD |
| Annual plan | CRUD | CRUDA | CRUDA (deputy) | R | Ekd CRUD; others own R |
| Plan distribution | CRUD | CRUDA | CRUDA (deputy) | — | Ekd CRUD |
| Weekly progress | CRUD | CRUD | CRUD | — | Own dept CRU |
| Events | CRUD | CRUDA | CRUDA (deputy) | R | Ekd CRUD; others assigned R |
| Announcements | CRUD | CRUDA | CRUDA | CRU | Ekd CRUD |
| Meetings | CRUD | CRUD | CRUD | CRUD | R (invitee) |
| Permissions page | R | — | — | — | — |

---

## 6. Roles — Dashboards, Navigation, Features

### 6.1 Super Admin (`super-admin`) — `/super-admin` & `/`

**Purpose:** System administration, account provisioning, audit, reference RBAC.

| Area | Details |
| :--- | :--- |
| Nav | Overview, Members, Children, Sub-departments, **User Accounts**, **Permissions**, **Audit Logs**, Settings |
| Dashboard KPIs | User accounts (active/deactivated), leadership roster matrix, system health/API status, role distribution, recent accounts, activity feed |
| Features | Create/edit/reactivate users, password reset, session revoke, leadership handover, audit filters + CSV, break-glass awareness (BYPASS_ACTION), static permission matrix |
| Key FRs | FR-13.1–FR-13.13 |
| Code | `src/widgets/dashboard/.../super-admin-dashboard.tsx`, `src/features/user-management/*`, `app/(authenticated)/super-admin`, `/users`, `/audit-logs`, `/permissions` |

### 6.2 Chairperson (`chairperson`) — `/chairperson` / role home

**Purpose:** Full operational visibility, approvals, executive oversight.

| Area | Details |
| :--- | :--- |
| Nav | Members, Children, Sub-departments, Attendance, Events, Planning, Reports, User Accounts, Audit Logs |
| Dashboard | Org-wide metrics, department comparison, **Approvals inbox** (plans, reports, events), meeting scheduler, audit viewer |
| Features | Approve/reject plan changes, report sign-offs, event publish; user management with Sub-Chair excluded from BR-008; announcements |
| Key FRs | FR-08, FR-09, FR-10, FR-11, FR-13.1–2, FR-17.1 |
| ADR | ADR-0018 notifications shared with Sub-Chair |

### 6.3 Sub-Chairperson / Vice-Chair (`sub-chairperson`) — `/sub-chairperson`

**Purpose:** Delegated cross-department oversight + standing deputy approvals.

| Area | Details |
| :--- | :--- |
| Nav | Same operational reads as Chair; **no** User Accounts nav |
| Dashboard | Read-only department status board, progress snapshot, mirrored approvals inbox |
| Features | Deputy actions: plan-change review, report approve, event approve (ADR-0018). **Cannot** create/edit users |
| Meetings | Create/manage leadership meetings (BR-019) |

### 6.4 Secretary (`secretary`) — `/secretary`

**Purpose:** Registration, rosters, pastoral admin, data quality.

| Area | Details |
| :--- | :--- |
| Nav | Members, Children, Sub-departments, Attendance, Events, Planning, Reports |
| Dashboard | Stage-1 fast add, child/parent link shortcuts, family hub, freshman onboarding, meetings, bulk import/export, birthdays/anniversaries, transfers, registration analytics, batch ops, data quality, parent directory, family tree, audit trail (record changes) |
| Features | Two-stage member registration (BR-001), family Father/Mother (BR-004), transfers (BR-021), batch ≤50 (BR-022) |
| Key FRs | FR-01, FR-02, FR-14.1–FR-14.9, FR-13.1.1–6 |

### 6.5 Timihrt Leader — `/timihrt` / sub-dept dashboard

**Purpose:** Education, curriculum, academic scores, report cards.

| Area | Details |
| :--- | :--- |
| Nav | Academic (`/academic`), scoped dashboard |
| Features | Curriculum roadmap, teacher roster, Mid/Final/Assignment score entry (FR-07), report card PDF/Excel (FR-15.1–5), cohort analytics Kutr 1 vs 2 |
| Permissions | Academic scores CRUD; curriculum CRUD; report cards CRUD |

### 6.6 Mezmur Leader — `/mezmur` + Mezmur home dashboard

**Purpose:** Hymns, conductors, monthly Awdemerit.

| Area | Details |
| :--- | :--- |
| Dashboard | Mezmur-specific role home when session has `MEZMUR_LEADER` |
| Features | Hymn repertoire, Astegni roster, Awdemerit prep status |
| Permissions | Hymn playlist CRUD own dept |

### 6.7 Kutitr Leader — `/kutitr`, `/attendance`, `/transport`

**Purpose:** Attendance verification and Saturday transport routes.

| Area | Details |
| :--- | :--- |
| Nav | Attendance, Transport |
| Features | Session checksheets (Sat/Sun/Special/Extra — FR-06), auto-seed statuses, Kutr 1/2 reclass, 5 collection routes (Apartama, Gende Boy, Gende Je, Cobalt, Bate), chaperone roster ≥2 per route (FR-06.4), route performance (FR-16.1), parent quick call (FR-16.2), emergency contacts CSV (FR-16.3) |
| Session types | `Saturday Regular`, `Sunday Regular`, `Special Event`, `Extra Training` |

### 6.8 Ekd Leader — `/ekd`, `/planning`, `/events`, `/reports`, announcements

**Purpose:** Master plan, distribution, consolidated reports, announcements.

| Area | Details |
| :--- | :--- |
| Nav | Planning, Events, Reports (plus announcements hub) |
| Features | 6-goal / 25-activity Action Plan matrix with weights (FR-08.2–3), distribute to sub-depts (FR-08.4), weekly execution roll-up (FR-08.5), plan approval submit (FR-17.1), progress heatmap (FR-17.2), event registry (FR-09), announcements to website + Telegram toggle (FR-11) |
| Multi-owner rule | Every activity/event program ≥2 members (FR-09.3 / BR-013) |

### 6.9 Kinetibeb Leader — `/kinetibeb`

**Purpose:** Media library, Yeteret Abat, drama/puppets.

| Area | Details |
| :--- | :--- |
| Nav | Children (allowed in nav config), scoped dashboard |
| Features | Film library tags/runtime, Yeteret Abat schedule + moral topics, rehearsal milestones |
| Permissions | Film/Yeteret CRUD own dept; children read (Kutitr owns child CRUD in matrix) |

### 6.10 Regular Member

**No admin portal.** RouteGuard + middleware keep them out; no dashboard, no personal admin content.

---

## 7. Feature Catalog by Module

| Module | Primary UI surfaces | Typical roles | FR / BR anchors |
| :--- | :--- | :--- | :--- |
| Members | `/members`, wizard, filters, profile | Exec + Kutitr read-all | FR-01, BR-001–003 |
| Families | Family cards/assignment | Exec, Secretary | FR-02, BR-004–005 |
| Sub-departments | `/sub-departments`, `[code]`, `[code]/dashboard` | Exec + scoped officers | FR-03 |
| Children | `/children`, `[id]`, parents link | Exec, Secretary, Kutitr CRUD | FR-04, BR-010–012 |
| Parents | Parent directory / linking | Exec, Secretary, Kutitr | FR-05 |
| Attendance | `/attendance` + session detail | Kutitr CRUD, Exec | FR-06, BR-020 |
| Academic | `/academic` + score entry | Timihrt CRUD, Chair | FR-07, FR-15 |
| Planning | `/planning`, matrix, execute | Ekd CRUD, Chair approve | FR-08, FR-17, BR-023 |
| Events | `/events`, new | Ekd CRUD, Chair approve | FR-09 |
| Reports | `/reports` | Ekd/Chair sign-off | FR-10 |
| Announcements | Ekd/Chair hub | Ekd, Chair, Secretary | FR-11, FR-12 |
| Meetings | Secretary/Chair/Sub-Chair surfaces | Chair, Sub-Chair, Secretary | FR-13.1, BR-019 |
| Transport | `/transport` | Kutitr, Chair | FR-04.3, FR-16 |
| Users | `/users`, `[id]` | Super Admin, Chair | FR-13.1, BR-007–009 |
| Audit | `/audit-logs` | Super Admin, Chair | FR-13.2, FR-13.10 |
| Permissions | `/permissions` | Super Admin | FR-13.3 |
| Settings | `/settings` | Super Admin (nav) | Preferences / password |

### 7.1 Navigation registry (live `nav-config.ts`)

Sections: **Main**, **Ministry**, **Programs**, **Administration**, **Operations**.

| Item | href | allowedRoles (UI) |
| :--- | :--- | :--- |
| Dashboard | `/` | all leadership |
| Members | `/members` | chair, sub-chair, secretary, super-admin |
| Children | `/children` | + kinetibeb-leader |
| Sub-Departments | `/sub-departments` | chair, sub-chair, secretary, super-admin |
| Attendance | `/attendance` | + kutitr-leader |
| Academic | `/academic` | chair, timihrt-leader, super-admin |
| Events | `/events` | chair, sub-chair, secretary, super-admin |
| Transport | `/transport` | chair, kutitr-leader, super-admin |
| User Accounts | `/users` | super-admin, chair |
| Audit Logs | `/audit-logs` | super-admin, chair |
| Permissions | `/permissions` | super-admin |
| Planning | `/planning` | chair, sub-chair, secretary, ekd-leader, super-admin |
| Reports | `/reports` | chair, sub-chair, secretary, super-admin |

`getNavigationForRoles(roles)` filters by `allowedRoles` and drops empty sections.

---

## 8. Dashboards (Spec Summary)

Full spec: `docs/frontend/dashboards.md`.

| Role | Route | Signature widgets |
| :--- | :--- | :--- |
| Chairperson | role home | Metrics, approvals inbox, dept comparison, meetings, audit |
| Sub-Chairperson | `/sub-chairperson` | Oversight board, deputy approvals, meetings |
| Secretary | `/secretary` | Registration shortcuts, families, freshmen, bulk tools, analytics, quality |
| Super Admin | `/super-admin` | Accounts, roster matrix, health, activity |
| Timihrt | `/timihrt` or sub-dept | Curriculum, teachers, gradebook, report cards |
| Mezmur | `/mezmur` | Hymns, Astegni, Awdemerit |
| Kutitr | `/kutitr` | Attendance checksheets, routes, emergencies |
| Ekd | `/ekd` | Master plan matrix, distribution, heatmap, announcements |
| Kinetibeb | `/kinetibeb` | Media, Yeteret Abat, rehearsals |

Reusable widgets from `@repo/ui`: KPI, progress, attendance, approval queue, planning, list, activity, announcement, quick actions, status summary, upcoming events — composed via `DashboardContainer` / `DashboardGrid` / `DashboardSection`.

---

## 9. Design System, Shell & Non-Functional Rules

### 9.1 Overview

| Concern | Choice |
| :--- | :--- |
| System name | **Hitsanat Kifl Design System v1.0** |
| Implementation | CSS variables + Tailwind + **shadcn/ui** (ADR-0009, preset `b1D0f7S7`) |
| Shared package | **`@repo/ui`** — single source for tokens and components |
| Token file | `packages/ui/src/globals.css` |
| Tailwind base | `packages/ui/tailwind.config.ts` (re-exported as `@repo/ui/tailwind.config`) |
| Admin shell tokens | `apps/admin/app/globals.css` (imports `@repo/ui/globals.css`) |
| Variants helper | `class-variance-authority` (cva) |
| Icons | `lucide-react` |
| Class merge | `cn()` = `clsx` + `tailwind-merge` (`@repo/ui/lib/utils`) |

**Brand palette (v1.0):** Burgundy `#5F0113` (primary) · Gold `#F3C913` (accent) · neutral white/gray surfaces. Controlled brand accents only — do not invent new hex colors outside tokens.

> **Note:** Older prose in `docs/frontend/ui-system.md` still describes “Church Deep Gold / Deep Navy” as primary/secondary. **Live code is authoritative:** primary = Burgundy, accent = Gold. Prefer CSS variables over hardcoded hex in feature code.

### 9.2 Design tokens

All tokens live as HSL channels on `:root` in `packages/ui/src/globals.css` and are wired to Tailwind colors (`hsl(var(--token))`).

#### Color — brand

| Token | HSL | Hex / role | Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--primary` | `348 98% 19%` | `#5F0113` Burgundy | `bg-primary text-primary-foreground` | Primary buttons, active nav, brand chrome |
| `--primary-hover` | `348 100% 15%` | darker burgundy | `bg-primary-hover` | Hover |
| `--primary-active` | `348 100% 10%` | darkest burgundy | `bg-primary-active` | Active/pressed |
| `--primary-muted` | `348 51% 94%` | pale burgundy wash | `bg-primary-muted` | Soft brand fills, chips |
| `--accent` | `49 90% 51%` | `#F3C913` Gold | `bg-accent text-accent-foreground` | Highlights, sidebar active, hover wash |
| `--accent-hover` | `48 86% 46%` | deeper gold | `bg-accent-hover` | Accent hover |
| `--accent-muted` | `47 89% 93%` | pale gold | `bg-accent-muted` | Soft accent backgrounds |
| `--ring` | `348 98% 19%` | burgundy | `ring-ring` | Focus ring (brand-matched) |

#### Color — surfaces & chrome

| Token | HSL | Tailwind | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `210 20% 98%` | `bg-background` | App page background |
| `--foreground` | `218 40% 15%` | `text-foreground` | Default body text |
| `--surface` | `0 0% 100%` | `bg-surface` | Raised neutral surface |
| `--surface-muted` | `210 20% 96%` | `bg-surface-muted` | Subtle panels |
| `--surface-elevated` | `0 0% 100%` | `bg-surface-elevated` | Overlays |
| `--card` / `--card-foreground` | white / dark | `bg-card text-card-foreground` | Cards |
| `--popover` / `--popover-foreground` | white / dark | `bg-popover` | Popovers, dropdowns |
| `--secondary` | `210 20% 96%` | `bg-secondary` | Secondary buttons / neutral fills |
| `--muted` / `--muted-foreground` | `210 20% 96%` / `217 12% 44%` | `bg-muted text-muted-foreground` | Disabled, placeholders, captions |
| `--border` / `--border-strong` | `220 14% 91%` / `213 21% 84%` | `border-border` | Default vs strong dividers |
| `--input` | `213 21% 87%` | `border-input` | Form control borders |

#### Color — semantic (feedback)

| Token | HSL | Tailwind | Usage |
| :--- | :--- | :--- | :--- |
| `--success` / fg | `151 73% 30%` | `bg-success` | Present, completed milestones |
| `--warning` / fg | `40 72% 42%` | `bg-warning` | Pending, excused, delays |
| `--info` / fg | `221 83% 53%` | `bg-info` | Expected, assigned, info |
| `--destructive` / fg | `4 89% 40%` | `bg-destructive` | Delete, absent, cancel |

Tinted badges use opacity, e.g. `bg-success/15 text-success`.

#### Dark mode (`.dark`)

Class strategy (`darkMode: ["class"]`). Overrides include lighter burgundy primary (`348 80% 32%`), gold ring/accent, deep navy surfaces (`218 40% 6%` background), and adjusted semantic colors — all still defined only in `globals.css`.

### 9.3 Typography

| Layer | Spec |
| :--- | :--- |
| Latin | **Inter** (variable, `@font-face` in `globals.css`) |
| Ge'ez / Amharic | **Noto Sans Ethiopic** (variable); `[lang="am"]` forces Ethiopic-first stack |
| Fallback | `system-ui, sans-serif` |
| Features | `rlig` 1, `calt` 1 |

**Type scale** (Tailwind `fontSize` + utility classes):

| Class / token | Size | Use |
| :--- | :--- | :--- |
| `text-display` | 32px bold | Rare hero metrics |
| `text-page-title` | 24–26px bold | Page H1 |
| `text-section-title` | 18–20px semibold | Section heads |
| `text-h1` … `text-h4` | 24 / 20 / 18 / 16 | In-page hierarchy |
| `text-body-lg` / `text-body` / `text-body-small` | 16 / 14 / 13 | Prose & tables |
| `text-caption` | 12px muted | Metadata |
| `text-label` | 11px medium uppercase tracking | Field labels |
| `text-button` | 14px medium | Buttons |
| `text-metric` / `text-kpi` | 26px (up to 30–32px) semibold | Stat cards / KPI widgets |

### 9.4 Spacing, radius, elevation, breakpoints

| System | Values |
| :--- | :--- |
| **Spacing scale** | 4px base; Tailwind spacing table extended (`1` = 4px … `24` = 96px); utility gaps `.spacing-0` … `.spacing-20` |
| **Radius** | `--radius` **0.5rem (8px)** default; `sm` 6px · `md` 8px · `lg` 10px · `xl` 12px · `full` pill |
| **Elevation** | Prefer **borders over shadows**; `.elevation-sm/md/lg` + `shadow-elevation-*` (cards → popover → dialog) |
| **Breakpoints** | `xs` **320** · `sm` **360** · `md` **768** · `lg` **1024** · `xl` **1280** · `2xl` **1440** · `3xl` **1600** |

### 9.5 Utility classes (from `globals.css`)

| Class | Purpose |
| :--- | :--- |
| `.touch-target` | min 44×44px hit area |
| `.focus-ring` | 2px brand focus ring + offset |
| `.motion-base` | 150ms color/shadow transition; disabled under `prefers-reduced-motion` |
| `.safe-area-top/bottom/left/right` | `env(safe-area-inset-*)` for notches |
| `.spacing-*` | Gap scale helpers |
| Admin shell (app CSS) | `.admin-sidebar`, `.admin-header`, `.admin-drawer`, `.login-cross-pattern` |

Focus/selection/scrollbars in admin are themed to `--primary` (burgundy) in `apps/admin/app/globals.css`.

### 9.6 Component library (`@repo/ui`)

Consume from the package root:

```ts
import { Button, Card, StatusBadge, DashboardGrid, KPIWidget } from "@repo/ui";
```

**Foundations**

| Component | Variants / notes |
| :--- | :--- |
| `Button` | `primary` (default), `secondary`, `tertiary`, `outline`, `ghost`, `destructive`, `link`, `icon`; sizes `xs`–`lg` + `icon`; `loading` spinner; **≥44px min height** on `sm`+ |
| `Card` | `default`, `outlined`, `elevated`, `interactive`; header/title/description/action/footer parts |
| `Badge`, `StatusBadge` | Status chips with icon+color map (see below) |
| `StatCard` | Metric tiles for executive KPIs |
| `Input`, `Textarea`, `Label`, `FormField`, `Select`, `Checkbox`, `Radio`, `Switch`, `Combobox`, `FileUpload`, `Calendar` | Forms |
| `Table`, `Pagination`, `Breadcrumb`, `Tabs`, `Accordion`, `List` | Layout/data |
| `Dialog`, `Drawer`, `AlertDialog`, `Popover`, `Tooltip`, `ScrollArea`, `Sonner` | Overlays (mobile dialogs → Drawer bottom sheet) |
| `Alert`, `Banner`, `Spinner`, `Skeleton`, `Separator`, `EmptyState`, `ErrorState`, `Progress`, `Avatar`, `Chart` | Feedback & media |

**`StatusBadge` status map** (shared vocabulary):

| Status | Tone | Typical use |
| :--- | :--- | :--- |
| `present` / `active` / `completed` / `published` | success | Attendance, done work |
| `pending` / `excused` / `delayed` | warning | Awaiting approval / late |
| `expected` / `assigned` | info | Roster / distribution |
| `absent` / `cancelled` | destructive | No-show / abort |
| `draft` / `inactive` / `archived` | muted | Inactive lifecycle |
| `in-progress` | primary | Active execution |

**Dashboard kit** (`@repo/ui` → `components/ui/dashboard`):

- Layout: `DashboardContainer`, `DashboardHeader`, `DashboardGrid`, `DashboardSection`
- Foundation: `DashboardWidget` + `WidgetHeader/Content/Footer` with built-in **`loading` / `empty` / `error` / `disabled`** states and Amharic title support (`titleAm` + locale context)
- Widgets: `KPIWidget`, `QuickActionsWidget`, `ListWidget`, `ActivityWidget`, `UpcomingEventsWidget`, `ProgressWidget`, `StatusSummaryWidget`, `ApprovalQueueWidget`, `AssignmentWidget`, `AttendanceWidget`, `AnnouncementWidget`, `PlanningWidget`

Tests for these live under `packages/ui/tests/`.

**shadcn CLI config:** `packages/ui/components.json` (style `default`, RSC on, baseColor slate, CSS variables, lucide icons). Regenerate components into `packages/ui`, not into apps.

### 9.7 Admin shell theming (`features/shell` + app CSS)

- Shell modules: `app-shell`, `app-sidebar`, `app-header`, `mobile-nav`, `global-search`, `notification-center`, `user-menu`, `i18n`
- Bilingual nav: `label` + `labelAm`; role filter via `getNavigationForRoles`
- **Sidebar / mobile drawer:** burgundy `--admin-sidebar` (`#5F0113`), white text, **gold** active item (`--admin-sidebar-active` = accent)
- **Desktop header:** neutral white chrome (brand lives in nav, not header)
- **Mobile header (`max-width: 767px`):** switches to burgundy brand surface with white actions
- **Login panel:** deep burgundy + white cross pattern (`.login-cross-pattern`)

### 9.8 Using the design system (rules)

1. **Never** hardcode brand hex/RGB in features — use `bg-primary`, `text-muted-foreground`, semantic tokens, etc.
2. Prefer **`@repo/ui` components** over one-off markup; extend cva variants in the package only when shared.
3. Compose pages from `cn()` for class merging; keep Tailwind content paths covering `features/**` and `packages/ui/src/**`.
4. New shared components: add under `packages/ui/src/components/ui/`, export from `src/index.ts`, add a Vitest test under `packages/ui/tests/`.
5. Admin layout CSS stays in `apps/admin/app/globals.css`; global tokens stay in `packages/ui/src/globals.css`.
6. Icons: **lucide-react** only (match `components.json`).
7. Mobile-first: use `sm:` and up for desktop polish; baseline must work at **360px** (`sm` breakpoint).
8. Respect reduced motion (use `.motion-base` or Tailwind transitions that honor `prefers-reduced-motion`).

### 9.9 NFR checklist for every screen

| ID | Requirement |
| :--- | :--- |
| NFR-01.3 | Admin initial JS bundle stays lean (`< 180 KB` gzip target for mobile) |
| NFR-02.2 | Supabase session cookies httpOnly/secure/SameSite |
| NFR-02.3 | Never trust client-only hiding for authorization |
| NFR-04.1 | Responsive down to **360px**; touch targets ≥ **44px** (`.touch-target` / Button min-h) |
| NFR-04.2 | Display Ethiopian calendar (`DD/MM/YYYY E.C.` / Amharic months); store Gregorian |
| NFR-04.3 | Ethiopic glyphs render without truncation (Noto Sans Ethiopic stack) |
| NFR-05.1–2 | WCAG 2.1 AA; keyboard + focus traps on dialogs; brand focus ring visible |

Mobile patterns: bottom-sheet **Drawer** for dialogs, frozen first column on wide matrices (Action Plan, attendance).

---

## 10. Testing Frontend by Role

| Layer | Tool | Focus |
| :--- | :--- | :--- |
| Unit/component | Vitest + RTL in `apps/admin/tests/` | Shell, dashboards per role, users, audit, nav filtering |
| Integration | Root Vitest `tests/integration` | API contracts used by hooks |
| E2E | Playwright | Auth routing, member lifecycle, 403 cases, a11y (axe) |

**Examples already in repo:** `shell.test.tsx`, `admin.test.tsx` (DashboardRouter), `super-admin*.test.tsx`, `secretary.test.tsx`, `sub-chairperson.test.tsx`, `mezmur.test.tsx`, `users.test.tsx`, `audit-logs.test.tsx`.

**E2E expectations (testing/e2e.md):**

1. Login as Chair → Chair dashboard; Timihrt leader → department route; regular member rejected.
2. Secretary member lifecycle.
3. Negative RBAC: non-privileged users get **403** from API (not merely hidden UI).

Before push: `pnpm prepare` (format, lint, typecheck, unit, integration, build, e2e).

---

## 11. Contribution Workflow (Frontend Lanes)

1. Branch: `feature/<task>` / `fix/...` / `docs/...` — no direct push to `main`.
2. Prefer feature slices under `apps/admin/features/`; keep `app/` pages thin.
3. Reuse `@repo/ui` before inventing local primitives.
4. Add/extend component tests for new role-gated UI.
5. Run `pnpm prepare` locally; open PR with template checklist.
6. Cross-lane: API contract changes → confirm with Core before UI depends on new fields.

Lane ownership: `docs/lanes/frontend-1.md`, `docs/lanes/frontend-2.md`, `docs/team/ownership.md`.

---

## 12. Source Map (Where to Read Next)

| Topic | Path |
| :--- | :--- |
| RBAC matrix | `docs/requirements/roles-and-permissions.md` |
| Functional requirements | `docs/requirements/functional-requirements.md` |
| Business rules | `docs/requirements/business-rules.md` |
| Dashboards | `docs/frontend/dashboards.md` |
| Navigation | `docs/frontend/navigation.md` |
| Frontend architecture | `docs/frontend/architecture.md` |
| Design system (tokens + components) | `packages/ui/src/globals.css`, `packages/ui/src/index.ts` |
| Tailwind design base | `packages/ui/tailwind.config.ts` |
| Admin shell tokens | `apps/admin/app/globals.css` |
| UI tokens / mobile (legacy prose) | `docs/frontend/ui-system.md` |
| shadcn setup | `docs/frontend/shadcn.md` |
| System product doc §6–7 | `docs/Hitsanat_Kifl_System_Documentation_v2.1 (2).md` |
| Repo / packages | `docs/development/repository-structure.md` |
| Setup / ports | `docs/development/setup.md` |
| Live roles config | `apps/admin/config/roles.ts` |
| Live nav | `apps/admin/features/shell/nav-config.ts` |
| Design system consumers | `packages/ui/src/components/ui/*`, `packages/ui/tests/*` |
| Dashboard router | `apps/admin/features/dashboard/components/dashboard-router.tsx` |
| Auth middleware | `apps/admin/middleware.ts` |
| Turborepo | `turbo.json` |
| Workspace | `pnpm-workspace.yaml` |

---

## 13. Quick Start for Admin Frontend Work

```bash
# from repo root
cp .env.example .env          # set SUPABASE_*, NEXT_PUBLIC_API_URL, etc.
docker compose up -d postgres postgres_test
pnpm install
pnpm dev                      # turbo: portfolio 3000, api 3001, admin 3002

# open
# http://localhost:3002/login
```

Verify:

```bash
pnpm typecheck
pnpm test:unit
pnpm --filter @repo/admin build
```

---

*End of Admin Frontend Development Guide.*
