# ADR-0015: Local `pnpm prepare` Quality Gate Matching GitHub Actions

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Developers pushing broken code or failing tests without local verification leads to high CI churn, broken main builds, and wasted review time.

---

## Decision
1. Standardize on a single local command:
   ```bash
   pnpm prepare
   ```
2. The command executes the full local verification pipeline: Biome Lint $\rightarrow$ Typecheck $\rightarrow$ Unit Tests $\rightarrow$ Component Tests $\rightarrow$ Integration Tests $\rightarrow$ RBAC Tests $\rightarrow$ Build $\rightarrow$ E2E/a11y Tests.
3. If any step fails, `pnpm prepare` exits with a non-zero exit code. Pushing code with failing local checks is prohibited.

---

## Consequences
### Positive:
- Ensures high confidence before opening Pull Requests.
- Mirrors the exact quality checks evaluated by GitHub Actions CI.
