# Team Contribution & Code Review Guide

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

## 1. Step-by-Step Task Lifecycle

1. **Task Assignment:** Contributor picks an assigned task from the Implementation Task Matrix ([Task Assignments](../roadmap/task-assignments.md)).
2. **Local Development:** Contributor creates branch (`feature/<task-name>`), implements domain logic/UI, and writes matching unit/integration tests.
3. **Verification Before Push:** Contributor runs `pnpm prepare` locally. Every check (Biome, Typecheck, Tests, Build) must pass.
4. **Pull Request Submission:** Contributor opens PR with the standardized PR template:
   - Summary of changes
   - Impacted modules/packages
   - Testing evidence (local prepare output)
   - Linked Task ID
5. **Code Review:** Assigned reviewer inspects architectural compliance and testing coverage.
6. **Merge & Deployment:** Lead merges PR via Squash & Merge. Automatic CI/CD pipeline deploys to staging/production.

---

## 2. Review Checklists by Lane

### 2.1 Core Backend Review Checklist
- [ ] Business logic resides in Domain/Application layer (no direct Express dependencies).
- [ ] Drizzle queries use proper foreign keys and indexes.
- [ ] Scoped RBAC checks (`requireScopePermission`) protect all mutation endpoints.
- [ ] Integration tests run against real PostgreSQL test database.
- [ ] Non-leadership users cannot access management routes (ADR-0007).

### 2.2 Frontend Review Checklist
- [ ] Components compose shared `@hitsanat/ui` primitives.
- [ ] Layout is responsive down to $360\text{ px}$ mobile viewport.
- [ ] Dates render via `@hitsanat/calendar` Ethiopian date utilities.
- [ ] React Hook Form validates against shared `@hitsanat/validation` Zod schemas.
- [ ] Accessibility checks pass (no missing form labels or ARIA tags).
