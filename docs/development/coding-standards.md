# Engineering Coding Standards & Guidelines

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Linter & Formatter:** Biome (`biome.json`)  

---

## 1. TypeScript & Language Rules

1. **Strict Type Safety:** `noImplicitAny`, `strictNullChecks`, and `noUncheckedIndexedAccess` are enabled across all tsconfig files.
2. **Explicit Return Types:** All public application use cases, repository methods, and domain calculation functions must declare explicit return types.
3. **No Raw Any:** The `any` type is strictly prohibited. Use `unknown` with Zod schema parsing or custom type guards.
4. **Zod as the Single Contract Authority:** All request parameters, bodies, and domain transfer boundaries must be validated via shared Zod schemas in `packages/validation`.

---

## 2. Formatting & Naming Conventions

- **File Naming:** `kebab-case` for all TypeScript files, components, and directories (e.g. `member-registration.form.tsx`, `planning-weight.engine.ts`).
- **Class / Type Naming:** `PascalCase` (e.g. `MemberAggregate`, `PlanActivityEntity`).
- **Function / Variable Naming:** `camelCase` (e.g. `computeActivityWeight`, `seedAttendanceRoster`).
- **Database Tables & Columns:** `snake_case` (e.g. `christian_name`, `program_session_attendance`).
- **Constants / Enums:** `UPPER_SNAKE_CASE` (e.g. `SUB_DEPT_TIMIHRT`, `MAX_ATTENDANCE_CAP`).

---

## 3. Error Handling Invariants

- Never swallow exceptions with empty `catch {}` blocks.
- Throw typed domain errors inheriting from `DomainError` (e.g. `ParentCardinalityViolationError`, `InvalidEthiopianDateError`).
- Log structured error objects using `@hitsanat/logger` with correlation metadata (`userId`, `path`, `method`).
