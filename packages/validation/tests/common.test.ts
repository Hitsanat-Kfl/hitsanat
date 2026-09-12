import { describe, expect, it } from "vitest";
import {
  dateSchema,
  emailSchema,
  paginationSchema,
  phoneSchema,
  uuidSchema,
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
