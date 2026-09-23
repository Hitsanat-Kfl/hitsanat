# Admin App Architecture

Feature-sliced structure under `src/`. Each domain owns its UI, data hooks, and API calls.

```
app/                    Routes only — pages are thin (import from features/widgets, render)
src/
  config/
    roles.ts            Single source of truth for the AdminRole union
    dashboard.ts        Role-aware dashboard widget layouts (roleDashboardConfig)
    navigation.ts       Centralized navigation config (sidebar + role filtering)
  authorization/        Portal-access decisions (ADR-0007) shared by RouteGuard + DashboardRouter
  domains/              Shared type definitions (facade: domains/definitions.ts)
  infrastructure/       api/client.ts (typed fetch), auth/supabase-client.ts
  features/             One folder per domain; prefer barrel (index.ts)
    <domain>/
      components/       Feature UI components
      hooks/            Data hooks (fetching lives here via @/infrastructure/api/client)
      index.ts          Public surface — cross-feature imports use "@/features/<domain>"
  widgets/
    shell/              AppShell, sidebar, header, i18n, page shell (re-exports nav from config)
    dashboard/          Role dashboards: components/, hooks/, fixtures/
  shared/               Cross-cutting UI (empty until something qualifies)
  providers/            App-level providers (empty until needed)
middleware.ts           Session refresh + login redirect
tests/                  Vitest component tests (import from ../src/...)
```

## Rules

1. **Pages import features/widgets; features never import from `app/`.**
2. **Cross-feature imports go through the barrel** (`@/features/<domain>`), never deep paths — internals can be refactored freely.
3. **All data fetching lives in `features/<domain>/hooks/`** — no API calls inside components.
4. **Roles are defined once** in `src/config/roles.ts`; navigation and dashboard configs derive from it.
5. **Navigation lives once** in `src/config/navigation.ts`; shell re-exports for consumers.
6. **Portal access lives once** in `src/authorization` — do not fork role checks.
7. Anything needed by 2+ features moves up one level; domain-specific code stays inside its slice.

## Adding a new domain

1. `src/features/<domain>/{components,hooks}/` + `index.ts` barrel.
2. Thin route under `app/(authenticated)/<domain>/page.tsx`.
3. Add nav entry in `src/config/navigation.ts` with `allowedRoles`.
