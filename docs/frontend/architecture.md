# Frontend Architecture Specification

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Framework:** Next.js 15 (App Router, React 19, TypeScript)  
**State & Data Fetching:** TanStack Query v5  
**Component Library:** shadcn/ui (Preset `b1D0f7S7` via `packages/ui`) (ADR-0009)  

---

## 1. Applications & Separation of Concerns

The monorepo contains two distinct frontend web applications:

```mermaid
graph TD
    User[Ministry Users]
    
    subgraph apps/admin [1. Management Portal - Leadership Only]
        AdminApp[Next.js 15 App Router]
        AuthGate[Better Auth Session Validator]
        RoleRouter[Role-Scoped Dashboard Router]
        TanStackAdmin[TanStack Query Data Layer]
    end

    subgraph apps/portfolio [2. Public Website - No Login Required]
        PublicApp[Next.js 15 App Router - SSR / SSG]
        CountdownEngine[Live Feast Countdown Component]
        PublicFeed[Public Announcements & Stats Feed]
    end

    User -->|Leadership Credentials| AuthGate --> RoleRouter --> AdminApp
    User -->|Public / Parents / Regular Members| PublicApp
```

---

## 2. Admin Portal Architecture (`apps/admin`)

- **App Router Directory Structure:**
  ```text
  apps/admin/app/
  ├── (auth)/
  │   ├── login/
  │   └── layout.tsx
  ├── (dashboard)/
  │   ├── layout.tsx             # Sidebar, Header, Scoped Context Provider
  │   ├── page.tsx               # Redirects to role-specific default dashboard
  │   ├── chairperson/           # Executive overview & approvals
  │   ├── secretary/             # Registration & member/family rosters
  │   ├── timihrt/               # Education, teacher roster, exam scores
  │   ├── mezmur/                # Song playlist, Astegni assignments, Awdemerit
  │   ├── kutitr/                # Attendance verification, 5 collection routes
  │   ├── ekd/                   # Master plan, distribution, reports, announcements
  │   ├── kinetibeb/             # Films, puppets, Yeteret Abat
  │   ├── members/               # Global member directory
  │   ├── children/              # Global child & parent directory
  │   └── settings/              # User preferences & password reset
  └── layout.tsx
  ```

---

## 3. Data Fetching & Caching Strategy (TanStack Query)

All backend communication is orchestrated via typed TanStack Query hooks:
- **Query Keys Hierarchy:** Structured query keys (e.g. `['members', { subDept, search }]`, `['annual-plans', academicYear]`).
- **Optimistic Updates:** Applied during attendance marking and status toggles for instantaneous mobile UX.
- **Error Boundaries & Toasts:** User-friendly error feedback using Sonner toast alerts.
