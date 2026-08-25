# ADR-0014: Biome as the Single Unified Tool for Formatting and Linting

**Status:** Accepted  
**Deciders:** Abrham (Core Lead), Development Team  
**Date:** August 2026  

---

## Context
Combining separate tools (ESLint, Prettier, import sorters) in a large monorepo often leads to conflicting configuration files, sluggish IDE performance, and slow CI linting steps.

---

## Decision
Adopt **Biome** (`biome.json`) as the exclusive, single unified tool for:
1. Code formatting
2. Static analysis and linting
3. Import sorting and organization

No separate ESLint or Prettier installations are permitted.

---

## Consequences
### Positive:
- Near-instantaneous linting and formatting across the monorepo ($> 20\times$ faster than ESLint+Prettier).
- Single configuration file (`biome.json`) shared by all apps and packages.
- Zero rule conflicts between formatter and linter.

### Negative:
- Non-standard custom ESLint plugins cannot be used directly (mitigated by Biome's extensive built-in rule catalog).
