import { describe, expect, it } from "vitest";
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
