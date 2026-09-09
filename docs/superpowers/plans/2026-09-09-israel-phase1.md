# Israel's Phase 1 — Engineering Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Israel's Phase 1 assignments (BES-001 and BES-002) by adding missing unit tests for the seed script and validation package.

**Architecture:** Two tasks:
1. Add unit tests for the sub-departments seed script to verify 5 departments are seeded correctly and idempotency
2. Add unit tests for the validation package schemas (pagination, error response, common schemas)

**Tech Stack:** TypeScript, Vitest, Zod, Drizzle ORM

**Spec:** `docs/tasks/backend-support.md` (BES-001, BES-002), `docs/implementation-plan/phase-01-engineering-foundation.md` (FND-006, FND-009)

---

## Current State Analysis

Both BES-001 and BES-002 have implementations but are **missing required tests**:

| Task | Implementation | Tests | Status |
|------|---------------|-------|--------|
| BES-001 (Seed Script) | `packages/database/src/seeds/sub-departments.ts` | None | **Needs Tests** |
| BES-002 (Validation Package) | `packages/validation/src/*.ts` | None | **Needs Tests** |

---

## Global Constraints

- All code must pass `pnpm prepare` (format, lint, typecheck, unit tests, integration tests, build, e2e)
- Biome is the linter/formatter (no ESLint/Prettier)
- Vitest is the test runner with jsdom environment
- Tests go in `packages/<name>/tests/` directory
- Use `describe`, `it`, `expect` from vitest (globals: true)
- No new dependencies allowed
- Git workflow: feature branch, conventional commits, `pnpm prepare` before push

---

### Task 1: BES-001 — Add Unit Tests for Sub-Departments Seed Script

**Files:**
- Create: `packages/database/tests/seeds/sub-departments.test.ts`
- Read: `packages/database/src/seeds/sub-departments.ts` (existing implementation)
- Read: `packages/database/src/schema/identity.ts` (sub_departments table schema)

**Interfaces:**
- Consumes: Seed script `subDepartments` array and `seed()` function
- Produces: Test file verifying 5 departments seeded correctly and idempotency

**Acceptance Criteria (from spec):**
- [ ] 5 sub-departments seeded
- [ ] Amharic names correct (ትምህርት, መዝሙር, ኩትትር, ኢክድ, ኪነጠበብ)
- [ ] English names correct (Education, Worship, Children, EKD, Sports)
- [ ] Seed is idempotent (safe to run multiple times)

- [ ] **Step 1: Create test file structure**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Sub-Departments Seed Script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("subDepartments data", () => {
    it("should define exactly 5 sub-departments", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      expect(subDepartments).toHaveLength(5);
    });

    it("should have unique codes for each department", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      const codes = subDepartments.map((d) => d.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(5);
    });

    it("should include TIMIHRT department with correct names", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      const timihrt = subDepartments.find((d) => d.code === "TIMIHRT");
      expect(timihrt).toBeDefined();
      expect(timihrt?.name_am).toBe("ትምህርት");
      expect(timihrt?.name_en).toBe("Education");
    });

    it("should include MEZMUR department with correct names", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      const mezmur = subDepartments.find((d) => d.code === "MEZMUR");
      expect(mezmur).toBeDefined();
      expect(mezmur?.name_am).toBe("መዝሙር");
      expect(mezmur?.name_en).toBe("Worship");
    });

    it("should include KUTITR department with correct names", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      const kutitr = subDepartments.find((d) => d.code === "KUTITR");
      expect(kutitr).toBeDefined();
      expect(kutitr?.name_am).toBe("ኩትትር");
      expect(kutitr?.name_en).toBe("Children");
    });

    it("should include EKD department with correct names", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      const ekd = subDepartments.find((d) => d.code === "EKD");
      expect(ekd).toBeDefined();
      expect(ekd?.name_am).toBe("ኢክድ");
      expect(ekd?.name_en).toBe("EKD");
    });

    it("should include KINETIBEB department with correct names", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      const kinetibeb = subDepartments.find((d) => d.code === "KINETIBEB");
      expect(kinetibeb).toBeDefined();
      expect(kinetibeb?.name_am).toBe("ኪነጠበብ");
      expect(kinetibeb?.name_en).toBe("Sports");
    });

    it("should have descriptions for all departments", async () => {
      const { subDepartments } = await import("../../src/seeds/sub-departments.js");
      for (const dept of subDepartments) {
        expect(dept.description).toBeDefined();
        expect(typeof dept.description).toBe("string");
        expect(dept.description.length).toBeGreaterThan(0);
      }
    });
  });
});
```

- [ ] **Step 2: Run test to verify it passes (data validation only)**

Run: `pnpm vitest run packages/database/tests/seeds/sub-departments.test.ts`
Expected: PASS (data validation tests)

- [ ] **Step 3: Export subDepartments array from seed script**

The seed script currently doesn't export the `subDepartments` array. We need to export it for testing.

```typescript
// In packages/database/src/seeds/sub-departments.ts
// Add export to the subDepartments array
export const subDepartments = [
  // ... existing array
];
```

- [ ] **Step 4: Run tests again to verify they pass**

Run: `pnpm vitest run packages/database/tests/seeds/sub-departments.test.ts`
Expected: PASS

- [ ] **Step 5: Run full CI to verify no regressions**

Run: `pnpm prepare`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/database/tests/seeds/sub-departments.test.ts packages/database/src/seeds/sub-departments.ts
git commit -m "test(database): add unit tests for sub-departments seed script

- Verify 5 sub-departments are defined
- Verify unique codes for each department
- Verify Amharic and English names for all departments
- Verify descriptions exist for all departments
- Export subDepartments array for testing

Refs: BES-001"
```

---

### Task 2: BES-002 — Add Unit Tests for Validation Package

**Files:**
- Create: `packages/validation/tests/common.test.ts`
- Create: `packages/validation/tests/response.test.ts`
- Read: `packages/validation/src/common.ts` (existing implementation)
- Read: `packages/validation/src/response.ts` (existing implementation)

**Interfaces:**
- Consumes: Validation schemas (paginationSchema, uuidSchema, etc.)
- Produces: Test files verifying schema validation behavior

**Acceptance Criteria (from spec):**
- [ ] Common validation schemas defined
- [ ] Unit tests pass
- [ ] Biome passes
- [ ] Package compiles

- [ ] **Step 1: Create common.test.ts**

```typescript
import { describe, it, expect } from "vitest";
import {
  uuidSchema,
  phoneSchema,
  emailSchema,
  dateSchema,
  paginationSchema,
} from "../src/common.js";

describe("Common Validation Schemas", () => {
  describe("uuidSchema", () => {
    it("should accept valid UUID", () => {
      const result = uuidSchema.safeParse("550e8400-e29b-41d4-a716-446655440000");
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID", () => {
      const result = uuidSchema.safeParse("not-a-uuid");
      expect(result.success).toBe(false);
    });

    it("should reject empty string", () => {
      const result = uuidSchema.safeParse("");
      expect(result.success).toBe(false);
    });
  });

  describe("phoneSchema", () => {
    it("should accept valid phone number", () => {
      const result = phoneSchema.safeParse("+251911234567");
      expect(result.success).toBe(true);
    });

    it("should reject short phone number", () => {
      const result = phoneSchema.safeParse("12345");
      expect(result.success).toBe(false);
    });

    it("should accept long phone number", () => {
      const result = phoneSchema.safeParse("+25191123456789012");
      expect(result.success).toBe(true);
    });
  });

  describe("emailSchema", () => {
    it("should accept valid email", () => {
      const result = emailSchema.safeParse("user@example.com");
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = emailSchema.safeParse("not-an-email");
      expect(result.success).toBe(false);
    });
  });

  describe("dateSchema", () => {
    it("should accept valid ISO datetime", () => {
      const result = dateSchema.safeParse("2024-01-15T10:30:00Z");
      expect(result.success).toBe(true);
    });

    it("should reject invalid date format", () => {
      const result = dateSchema.safeParse("2024-01-15");
      expect(result.success).toBe(false);
    });
  });

  describe("paginationSchema", () => {
    it("should accept valid pagination params", () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 20 });
      expect(result.success).toBe(true);
    });

    it("should apply defaults for missing fields", () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it("should reject page < 1", () => {
      const result = paginationSchema.safeParse({ page: 0, limit: 20 });
      expect(result.success).toBe(false);
    });

    it("should reject limit > 100", () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 101 });
      expect(result.success).toBe(false);
    });

    it("should accept optional search param", () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 20, search: "test" });
      expect(result.success).toBe(true);
    });
  });
});
```

- [ ] **Step 2: Create response.test.ts**

```typescript
import { describe, it, expect } from "vitest";
import { apiResponseSchema, paginatedResponseSchema } from "../src/response.js";

describe("Response Validation Schemas", () => {
  describe("apiResponseSchema", () => {
    it("should accept success response", () => {
      const result = apiResponseSchema.safeParse({
        success: true,
        data: { id: "123" },
      });
      expect(result.success).toBe(true);
    });

    it("should accept error response", () => {
      const result = apiResponseSchema.safeParse({
        success: false,
        error: "Not found",
      });
      expect(result.success).toBe(true);
    });

    it("should accept response with message", () => {
      const result = apiResponseSchema.safeParse({
        success: true,
        message: "Operation completed",
      });
      expect(result.success).toBe(true);
    });

    it("should reject missing success field", () => {
      const result = apiResponseSchema.safeParse({
        data: { id: "123" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("paginatedResponseSchema", () => {
    it("should accept valid paginated response", () => {
      const result = paginatedResponseSchema.safeParse({
        success: true,
        data: [{ id: "1" }, { id: "2" }],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
        },
      });
      expect(result.success).toBe(true);
    });

    it("should accept empty data array", () => {
      const result = paginatedResponseSchema.safeParse({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });
      expect(result.success).toBe(true);
    });

    it("should reject missing pagination field", () => {
      const result = paginatedResponseSchema.safeParse({
        success: true,
        data: [],
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-array data", () => {
      const result = paginatedResponseSchema.safeParse({
        success: true,
        data: { id: "1" },
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
        },
      });
      expect(result.success).toBe(false);
    });
  });
});
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `pnpm vitest run packages/validation/tests/`
Expected: PASS

- [ ] **Step 4: Run full CI to verify no regressions**

Run: `pnpm prepare`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/validation/tests/
git commit -m "test(validation): add unit tests for common and response schemas

- Test uuidSchema validation (valid/invalid UUIDs)
- Test phoneSchema validation (length requirements)
- Test emailSchema validation (format validation)
- Test dateSchema validation (ISO datetime format)
- Test paginationSchema validation (defaults, constraints)
- Test apiResponseSchema validation (success/error responses)
- Test paginatedResponseSchema validation (pagination structure)

Refs: BES-002"
```

---

## Verification Checklist

After completing both tasks, verify:

- [ ] `pnpm prepare` passes (format, lint, typecheck, tests, build)
- [ ] All 282+ unit tests pass
- [ ] No new warnings or errors
- [ ] Tests cover all acceptance criteria from specs
- [ ] Code follows existing patterns in the codebase

---

## Next Steps

After these tasks are complete:
1. Create feature branch `feature/bes-001-bes-002-phase1-tests`
2. Commit all changes with conventional commit messages
3. Push to origin
4. Create PR for Abrham's review
5. Wait for approval before merging to main
