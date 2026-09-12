import { describe, expect, it } from "vitest";
import {
  attendanceUpdateSchema,
  batchVerifySchema,
  eventAssignmentSchema,
  eventSchema,
  sessionSchema,
} from "../src/attendance.js";

describe("Attendance Validation Schemas", () => {
  describe("sessionSchema", () => {
    it("should accept valid session", () => {
      const result = sessionSchema.safeParse({
        sessionType: "Saturday",
        sessionDate: "2024-01-15",
        startTime: "2024-01-15T07:30:00Z",
        endTime: "2024-01-15T09:30:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Sunday session", () => {
      const result = sessionSchema.safeParse({
        sessionType: "Sunday",
        sessionDate: "2024-01-16",
        startTime: "2024-01-16T08:00:00Z",
        endTime: "2024-01-16T10:00:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid sessionType", () => {
      const result = sessionSchema.safeParse({
        sessionType: "Monday",
        sessionDate: "2024-01-15",
        startTime: "2024-01-15T07:30:00Z",
        endTime: "2024-01-15T09:30:00Z",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("attendanceUpdateSchema", () => {
    it("should accept Present", () => {
      const result = attendanceUpdateSchema.safeParse({ status: "Present" });
      expect(result.success).toBe(true);
    });

    it("should accept Absent", () => {
      const result = attendanceUpdateSchema.safeParse({ status: "Absent" });
      expect(result.success).toBe(true);
    });

    it("should accept Excused", () => {
      const result = attendanceUpdateSchema.safeParse({ status: "Excused" });
      expect(result.success).toBe(true);
    });

    it("should accept Expected", () => {
      const result = attendanceUpdateSchema.safeParse({ status: "Expected" });
      expect(result.success).toBe(true);
    });

    it("should reject invalid status", () => {
      const result = attendanceUpdateSchema.safeParse({ status: "Late" });
      expect(result.success).toBe(false);
    });
  });

  describe("batchVerifySchema", () => {
    it("should accept valid batch", () => {
      const result = batchVerifySchema.safeParse({
        recordIds: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
        status: "Present",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty recordIds", () => {
      const result = batchVerifySchema.safeParse({
        recordIds: [],
        status: "Present",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid status", () => {
      const result = batchVerifySchema.safeParse({
        recordIds: ["550e8400-e29b-41d4-a716-446655440000"],
        status: "Expected",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("eventSchema", () => {
    it("should accept valid event", () => {
      const result = eventSchema.safeParse({
        eventName: "Special Program",
        eventType: "Special",
        eventDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("should accept with optional fields", () => {
      const result = eventSchema.safeParse({
        eventName: "Special Program",
        eventType: "Special",
        eventDate: "2024-01-15T10:00:00Z",
        isPublished: true,
        countdownActive: false,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid eventType", () => {
      const result = eventSchema.safeParse({
        eventName: "Special Program",
        eventType: "Invalid",
        eventDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("eventAssignmentSchema", () => {
    it("should accept valid assignment", () => {
      const result = eventAssignmentSchema.safeParse({
        subDepartmentId: "550e8400-e29b-41d4-a716-446655440000",
        programTitle: "Youth Program",
        assignedMembers: [
          "550e8400-e29b-41d4-a716-446655440000",
          "550e8400-e29b-41d4-a716-446655440001",
        ],
      });
      expect(result.success).toBe(true);
    });

    it("should reject less than 2 members", () => {
      const result = eventAssignmentSchema.safeParse({
        subDepartmentId: "550e8400-e29b-41d4-a716-446655440000",
        programTitle: "Youth Program",
        assignedMembers: ["550e8400-e29b-41d4-a716-446655440000"],
      });
      expect(result.success).toBe(false);
    });
  });
});
