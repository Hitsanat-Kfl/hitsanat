import { describe, expect, it } from "vitest";
import { familyResponseSchema, familySchema } from "../src/family.js";

describe("Family Validation Schemas", () => {
  describe("familySchema", () => {
    it("should accept valid family data", () => {
      const result = familySchema.safeParse({
        familyName: "Family 1",
        academicYear: "2016/2017 E.C.",
      });
      expect(result.success).toBe(true);
    });

    it("should accept with parent IDs", () => {
      const result = familySchema.safeParse({
        familyName: "Family 1",
        fatherMemberId: "550e8400-e29b-41d4-a716-446655440000",
        motherMemberId: "550e8400-e29b-41d4-a716-446655440001",
        academicYear: "2016/2017 E.C.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty familyName", () => {
      const result = familySchema.safeParse({
        familyName: "",
        academicYear: "2016/2017 E.C.",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty academicYear", () => {
      const result = familySchema.safeParse({
        familyName: "Family 1",
        academicYear: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid fatherMemberId", () => {
      const result = familySchema.safeParse({
        familyName: "Family 1",
        fatherMemberId: "not-a-uuid",
        academicYear: "2016/2017 E.C.",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("familyResponseSchema", () => {
    it("should accept valid response", () => {
      const result = familyResponseSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        familyName: "Family 1",
        fatherMemberId: null,
        motherMemberId: null,
        academicYear: "2016/2017 E.C.",
        createdAt: "2024-01-15T10:30:00Z",
      });
      expect(result.success).toBe(true);
    });
  });
});
