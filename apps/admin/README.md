# Admin App Architecture

Feature-sliced structure. Each domain owns its UI, data hooks, and API calls.

```
app/            Routes only — pages are thin (import from features, render)
features/       One folder per domain; the only import surface is the barrel (index.ts)
  <domain>/
    components/   Feature UI components
    hooks/        Data hooks (all fetching lives here, via lib/api-client)
    api.ts        Feature-specific endpoint helpers (optional)
    index.ts      Public surface — cross-feature imports use "@/features/<domain>"
  dashboard/      Role dashboards: config.ts (widget layout), hooks/, fixtures/
  shell/          AppShell, sidebar, header, i18n, page shell
  auth/           RouteGuard
components/      Shared UI used by 2+ features (empty until something qualifies)
lib/             Infrastructure: api-client, supabase client, shared types
config/roles.ts  Single source of truth for the AdminRole union
```

## Rules

1. **Pages import features; features never import from `app/`.**
2. **Cross-feature imports go through the barrel** (`@/features/<domain>`), never deep paths — internals can be refactored freely.
3. **All data fetching lives in `features/<domain>/hooks/`** — no API calls inside components.
4. **Roles are defined once** in `config/roles.ts`; navigation and dashboard configs derive from it.
5. Anything needed by 2+ features moves up one level; domain-specific code stays inside its slice.

## Adding a new domain

1. `features/<domain>/{components,hooks}/` + `index.ts` barrel.
2. Thin route under `app/(authenticated)/<domain>/page.tsx`.
3. Add nav entry in `features/shell/nav-config.ts` with `allowedRoles`.
