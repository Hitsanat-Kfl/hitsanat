# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Student leaders at Haramaya University Gibi Gubae — undergraduate and postgraduate students serving in volunteer ministry roles (Chairperson, Secretary, Sub-Chairpersons, Department Heads). They plan and coordinate weekend spiritual education sessions for children, manage transport routes, track attendance, and maintain institutional records across academic-year leadership transitions.

## Product Purpose

Hitsanat Kifl (የህጻናት ክፍል — Children's Department) is the operational backbone of the children's ministry at the Haramaya University Ethiopian Orthodox Tewahedo Student Association. It exists so that student leaders can run weekend ministry operations — coordinating 5 collection points, 5 sub-departments, and 2 age groups — with real-time visibility into attendance, transport, planning progress, and reporting, instead of relying on scattered spreadsheets and paper records that break on handover.

Success means: every Saturday and Sunday ministry session runs smoothly, every child is accounted for, and the next cohort of student leaders picks up where the last one left off without institutional knowledge loss.

## Positioning

Hitsanat Kifl is purpose-built for the unique constraints of campus Orthodox children's ministry: student-led, volunteer-powered, operating on a weekly rhythm with fixed collection points and transport routes. No generic church management tool accounts for the combination of academic-year turnover, Amharic-first bilingual operation, Ethiopian calendar presentation with Gregorian storage, and the specific Orthodox terminology and feast cycle that shape ministry life.

## Operating Context

- **Weekly rhythm**: Saturday ministry (8:00–11:30 AM), Sunday ministry (8:00–10:00 AM)
- **5 Sub-Departments**: Timihrt (Education), Mezmur (Music/Hymns), Kutitr (Attendance/Transport), Ekd (Planning/Strategy), Kinetibeb (Visual Arts)
- **5 Child Collection Points**: Apartama, Gende Boy, Gende Je, Cobalt, Bate
- **2 Age Groups**: Kutr 1 (younger), Kutr 2 (older)
- **Monthly events**: Awdemerit (children sing before congregation), birthday celebrations (15th)
- **Special feasts**: Timket, Hosaena, Adar, Fresh Welcome, Welfare
- **Planning cycle**: Annual Master Plan → quarterly goals → monthly activities → weekly execution, weighted by Budget + People + Time formula
- **Handover cycle**: Student leadership transitions with each academic year; structured records must survive cohort changes
- **Languages**: Amharic (Ge'ez script) primary, English secondary; bilingual throughout
- **Deployment**: Vercel (admin + portfolio), Railway (API + Telegram bot), Supabase PostgreSQL — free-tier hosting

## Capabilities and Constraints

### Confirmed Capabilities
- Member registration and enrichment (two-stage: fast record + details)
- Child and parent management with strict cardinality (max 1 Father + 1 Mother per child)
- 5 sub-department hierarchy with scoped RBAC
- Activity scheduling with auto-seeded attendance rosters
- Attendance tracking across regular sessions and special events
- Transport and route assignment (Kutitr ownership)
- Annual planning hierarchy with 3-factor weight formula (Budget + People + Time)
- Real-time progress dashboards (weekly → monthly → quarterly → annual roll-up)
- Audit logging with break-glass action tracking
- Public portfolio site with program pages, events, announcements, and stats
- Telegram bot integration for publishing announcements
- Bilingual UI (Amharic/English) with Ge'ez script support
- Mobile-responsive down to 360px viewport

### Technical Constraints
- Express.js API backend
- Next.js 15 admin and portfolio frontends
- PostgreSQL 15 via Supabase
- shadcn/ui component library (Radix UI primitives)
- Vitest for unit/component/integration testing
- Playwright + axe-core for E2E and accessibility
- Biome for code formatting/linting
- pnpm monorepo with Turborepo
- WCAG 2.1 Level AA compliance required
- 44px minimum touch targets on mobile
- ~$3/month free-tier deployment budget

### Undecided
- Email invitation links (deferred)
- Dependency health checks for DB/Supabase/Telegram (deferred)
- Data export for leadership transitions (deferred)

## Brand Commitments

- **Product name**: Hitsanat Kifl (የህጻናት ክፍል — Children's Department)
- **Organization**: Haramaya University Gibi Gubae — Orthodox Tewahedo Student Association
- **Ethiopian Orthodox identity is sacred**: Ge'ez/Amharic script, church terminology, and Orthodox cultural context must never be diluted or westernized. The ministry's Orthodox Christian character is foundational, not decorative.
- **Primary color**: Church Deep Gold `hsl(43, 96%, 45%)` — main actions, active nav, key highlights
- **Secondary color**: Deep Navy/Charcoal `hsl(222, 47%, 11%)` — headers, dark mode, executive accents
- **Typography**: Inter/Geist Sans for Latin; Noto Sans Ethiopic/Abyssinica SIL for Ge'ez script
- **Telegram bot signature**: "— Hitsanat Kifl 🇪🇹"
- **Voice**: Professional enough for church leadership, warm enough for student volunteers — never corporate-cold

## Evidence on Hand

- Full admin dashboard with 25+ pages across dashboard, members, children, events, attendance, planning, reports, sub-departments, audit logs, permissions, and super-admin panels
- Public portfolio with landing page, program pages, events, announcements, and stats
- REST API with Swagger documentation at `/docs`
- Telegram bot for announcement publishing
- Comprehensive documentation suite in `docs/` (requirements, ADRs, testing strategy, contribution workflow, implementation roadmap)
- E2E tests covering multi-role leadership journeys
- Accessibility tests with axe-core

## Product Principles

1. **Operational reality first.** Every feature must serve the actual weekly rhythm of campus ministry — not an idealized church management workflow. If it doesn't help a student leader run Saturday ministry, it doesn't belong.
2. **Handover-proof.** Institutional knowledge must survive academic-year transitions. Structured records, audit trails, and clear role documentation ensure the next cohort doesn't start from zero.
3. **Amharic-first, bilingual-capable.** The primary experience is in Ge'ez script. English is a secondary layer, never the default. Ethiopian calendar presentation with Gregorian storage (ADR-0004).
4. **Volunteer-powered, zero-budget.** Designed for free-tier hosting and student-maintained infrastructure. Complexity must justify its operational cost.
5. **Orthodox identity is structural, not cosmetic.** Ministry terminology, feast cycles, and cultural context shape the information architecture — they are not surface decoration.

## Accessibility & Inclusion

- WCAG 2.1 Level AA compliance (NFR-05.1) with zero critical/serious violations enforced in CI
- Keyboard navigation for all interactive components (Tab, Shift+Tab, Enter, Space, Escape)
- Visible focus rings on all interactive elements
- Semantic headings and ARIA attributes throughout
- Form inputs with associated labels or aria-labels
- 44px minimum touch targets for mobile interaction
- Ge'ez/Amharic script rendering without glyph truncation or layout jitter
- Bottom sheet drawers for mobile dialogs (single-handed thumb operation)
- Responsive layouts from 360px to 1600px+
