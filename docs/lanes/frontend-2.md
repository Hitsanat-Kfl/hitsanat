# Lane 3 — Frontend Developer 2

## Hitsanat Kifl Children's Ministry Management System
**Name:** TBD (Not Assigned Yet)
**Role:** Frontend Developer
**ADR Reference:** ADR-0009 (shadcn/ui Component Foundation), ADR-0017 (Resilient Cloud Deployment)

---

## 1. Purpose

TBD is a frontend developer working on the Hitsanat Kifl system. TBD is an equal-level peer with Eyob (Frontend Developer 1). There is no hierarchy between the frontend developers — both have equal responsibility and equal technical status.

TBD can work on **both** the Portfolio application (`apps/portfolio`) and the Admin application (`apps/admin`), as well as the shared UI component library (`packages/ui`). Work is divided by task, not by application.

**Note:** This position is not yet assigned. All tasks marked for TBD should remain unassigned until a person is confirmed.

---

## 2. Responsibilities

### 2.1 Portfolio Application (`apps/portfolio`)
- Public ministry website with zero login requirement
- Event countdown displays
- Announcement feed
- Live sanitized statistics
- Ethiopian calendar display and formatting
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA compliance)
- SEO optimization

### 2.2 Admin Application (`apps/admin`)
- Role-based administrative dashboard
- Login page and authentication flow
- Dynamic role-based sidebar navigation
- Protected route guards (RBAC enforcement)
- Data tables, forms, and dashboards
- Mobile-optimized interfaces

### 2.3 Shared UI Component Library (`packages/ui`)
- shadcn/ui component development and maintenance
- Design token system (preset `b1D0f7S7`)
- Component documentation and usage guidelines
- Responsive behavior patterns
- Accessibility compliance for all shared components

### 2.4 API Integration
- TanStack Query data fetching
- Error state handling
- Loading state management
- Cache strategy

### 2.5 Design System
- Typography (Ge'ez font stack)
- Color system (CSS variables)
- Spacing and layout patterns
- Mobile breakpoint definitions

---

## 3. Owned Directories

| Directory | Purpose |
|:---|:---|
| `apps/portfolio/` | Public Portfolio Next.js application |
| `apps/portfolio/app/` | App Router pages and layouts |
| `apps/admin/` | Admin Console Next.js application |
| `apps/admin/app/` | App Router pages and layouts |
| `packages/ui/` | Shared shadcn/ui component library |
| `packages/ui/src/components/` | Shared React components |
| `packages/ui/src/lib/` | Utility functions (cn, etc.) |

**Note:** Both frontend developers share ownership of all frontend directories. Tasks are assigned per-feature, not per-directory.

---

## 4. Allowed Changes (Without Approval)

- All files within `apps/portfolio/` (for assigned tasks)
- All files within `apps/admin/` (for assigned tasks)
- All files within `packages/ui/` (for assigned tasks)
- Portfolio-specific configuration (`next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`)
- Admin-specific configuration (`next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`)
- Shared UI components (Button, Card, Badge, Input, and new components)

---

## 5. Restricted Changes (Requires Core/Abrham Approval)

- API endpoint contracts (consumes, does not define)
- Database schemas
- Authentication/authorization logic
- Shared packages outside `packages/ui/`
- Backend code in `apps/api/`
- CI/CD pipeline configuration
- Deployment configuration
- Cross-application architectural changes

---

## 6. Dependencies

### Upstream Dependencies
- **Abrham (Core)** — API contract definitions, deployment configuration
- **Israel (Backend Support)** — API endpoints for assigned features
- **Eyob (Frontend Developer 1)** — Shared component coordination

### Downstream Dependencies
- End users (Portfolio visitors, Admin leaders)

---

## 7. Review Requirements

### TBD Must Review
- Eyob's frontend PRs (as peer reviewer)
- Shared UI component changes from Eyob

### TBD Receives Review From
- **Eyob (Frontend Developer 1)** — Peer review for all frontend PRs
- **Abrham (Core)** — Architecture compliance, cross-application changes

---

## 8. Typical Tasks

| Task Type | Examples |
|:---|:---|
| Portfolio page | Build projects page, create research section |
| Admin page | Build planning UI, create reports dashboard |
| Component | Develop shared DataTable, build Pagination component |
| Integration | Wire TanStack Query to admin endpoints |
| Accessibility | Add ARIA labels, fix contrast ratios |
| Responsive | Optimize mobile layout for planning matrix |
| Testing | Write Playwright E2E, component tests |

---

## 9. Collaboration Rules

1. **API contracts come first.** TBD consumes published API contracts. Do not modify backend endpoints.
2. **Mobile-first.** All pages must work on mobile before desktop.
3. **Shared components must be generic.** `packages/ui` components must not contain business-specific logic.
4. **Peer review.** All frontend PRs are reviewed by the other frontend developer (Eyob).
5. **Coordinate on shared UI.** When modifying `packages/ui`, coordinate with Eyob to avoid conflicts.
6. **Ethiopian calendar throughout.** All date rendering uses `packages/calendar` for Ethiopian calendar conversion.

---

## 10. Escalation Rules

1. **API contract issues** — If an API endpoint does not match the documented contract, escalate to Abrham.
2. **Component conflicts** — If a shared component change affects both apps, coordinate with Eyob before merging.
3. **Design disagreements** — Escalate to Abrham for final decision on visual direction.
4. **Scope expansion** — If a task grows beyond frontend scope, escalate to Abrham.
