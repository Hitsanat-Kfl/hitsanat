import { describe, expect, it } from "vitest";
import { memberResponseSchema, memberStage1Schema, memberStage2Schema } from "../src/member.js";

describe("Member Validation Schemas", () => {
  describe("memberStage1Schema", () => {
    const validStage1 = {
      fullName: "John Doe",
      christianName: "John",
      phoneNumber: "+251911234567",
      yearOfStudy: "2nd Year",
      academicDepartment: "Software Engineering",
      campus: "Main Campus",
      gender: "Male",
    };

    it("should accept valid stage 1 data", () => {
      const result = memberStage1Schema.safeParse(validStage1);
      expect(result.success).toBe(true);
    });

    it("should reject missing fullName", () => {
      const result = memberStage1Schema.safeParse({
        ...validStage1,
        fullName: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid yearOfStudy", () => {
      const result = memberStage1Schema.safeParse({
        ...validStage1,
        yearOfStudy: "6th Year",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid gender", () => {
      const result = memberStage1Schema.safeParse({
        ...validStage1,
        gender: "Other",
      });
      expect(result.success).toBe(false);
    });

    it("should accept all valid year options", () => {
      const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "GC"];
      for (const year of years) {
        const result = memberStage1Schema.safeParse({
          ...validStage1,
          yearOfStudy: year,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("memberStage2Schema", () => {
    it("should accept valid stage 2 data", () => {
      const result = memberStage2Schema.safeParse({
        subDepartmentIds: ["550e8400-e29b-41d4-a716-446655440000"],
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty subDepartmentIds", () => {
      const result = memberStage2Schema.safeParse({
        subDepartmentIds: [],
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const result = memberStage2Schema.safeParse({
        subDepartmentIds: ["550e8400-e29b-41d4-a716-446655440000"],
        familyId: "550e8400-e29b-41d4-a716-446655440001",
        photoUrl: "https://example.com/photo.jpg",
        telegramUsername: "@john",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid subDepartmentId", () => {
      const result = memberStage2Schema.safeParse({
        subDepartmentIds: ["not-a-uuid"],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("memberResponseSchema", () => {
    it("should accept valid response", () => {
      const result = memberResponseSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        fullName: "John Doe",
        christianName: "John",
        phoneNumber: "+251911234567",
        yearOfStudy: "2nd Year",
        academicDepartment: "Software Engineering",
        campus: "Main Campus",
        gender: "Male",
        photoUrl: null,
        telegramUsername: null,
        dateJoined: "2024-01-15T10:30:00Z",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      });
      expect(result.success).toBe(true);
    });
  });
});
