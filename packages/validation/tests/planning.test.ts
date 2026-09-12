import { describe, expect, it } from "vitest";
import {
  annualPlanSchema,
  planActivitySchema,
  planDistributionSchema,
  planGoalSchema,
  progressRecordSchema,
  weeklyPlanSchema,
} from "../src/planning.js";

describe("Planning Validation Schemas", () => {
  describe("annualPlanSchema", () => {
    it("should accept valid plan", () => {
      const result = annualPlanSchema.safeParse({
        academicYear: "2016/2017 E.C.",
        title: "Annual Plan 2016",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty title", () => {
      const result = annualPlanSchema.safeParse({
        academicYear: "2016/2017 E.C.",
        title: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("planGoalSchema", () => {
    it("should accept valid goal", () => {
      const result = planGoalSchema.safeParse({
        goalNumber: 1,
        title: "Spiritual Growth",
      });
      expect(result.success).toBe(true);
    });

    it("should reject goalNumber < 1", () => {
      const result = planGoalSchema.safeParse({
        goalNumber: 0,
        title: "Spiritual Growth",
      });
      expect(result.success).toBe(false);
    });

    it("should reject goalNumber > 6", () => {
      const result = planGoalSchema.safeParse({
        goalNumber: 7,
        title: "Spiritual Growth",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("planActivitySchema", () => {
    it("should accept valid activity", () => {
      const result = planActivitySchema.safeParse({
        activityNumber: 1,
        mainActivity: "Teach Sunday School",
        expectedResult: "Children learn",
        annualTarget: 50,
        budget: 500,
        humanResource: 10,
        plannedTime: 5,
        q1Target: 12,
        q2Target: 13,
        q3Target: 13,
        q4Target: 12,
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative budget", () => {
      const result = planActivitySchema.safeParse({
        activityNumber: 1,
        mainActivity: "Teach Sunday School",
        annualTarget: 50,
        budget: -100,
        humanResource: 10,
        plannedTime: 5,
        q1Target: 12,
        q2Target: 13,
        q3Target: 13,
        q4Target: 12,
      });
      expect(result.success).toBe(false);
    });

    it("should accept zero values", () => {
      const result = planActivitySchema.safeParse({
        activityNumber: 1,
        mainActivity: "Teach Sunday School",
        annualTarget: 0,
        budget: 0,
        humanResource: 0,
        plannedTime: 0,
        q1Target: 0,
        q2Target: 0,
        q3Target: 0,
        q4Target: 0,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("planDistributionSchema", () => {
    it("should accept valid distribution", () => {
      const result = planDistributionSchema.safeParse({
        subDepartmentId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID", () => {
      const result = planDistributionSchema.safeParse({
        subDepartmentId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("weeklyPlanSchema", () => {
    it("should accept valid weekly plan", () => {
      const result = weeklyPlanSchema.safeParse({
        ethiopianMonth: "Tikimt",
        weekNumber: 1,
        sessionDate: "2024-01-15T08:00:00Z",
        taskDescription: "Teach children",
      });
      expect(result.success).toBe(true);
    });

    it("should reject weekNumber < 1", () => {
      const result = weeklyPlanSchema.safeParse({
        ethiopianMonth: "Tikimt",
        weekNumber: 0,
        sessionDate: "2024-01-15",
        taskDescription: "Teach children",
      });
      expect(result.success).toBe(false);
    });

    it("should reject weekNumber > 5", () => {
      const result = weeklyPlanSchema.safeParse({
        ethiopianMonth: "Tikimt",
        weekNumber: 6,
        sessionDate: "2024-01-15",
        taskDescription: "Teach children",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("progressRecordSchema", () => {
    it("should accept valid progress", () => {
      const result = progressRecordSchema.safeParse({
        actualResultNumeric: 10,
        actualResultText: "Completed",
        status: "Completed",
        challenges: "None",
      });
      expect(result.success).toBe(true);
    });

    it("should accept minimal progress", () => {
      const result = progressRecordSchema.safeParse({
        status: "Pending",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid status", () => {
      const result = progressRecordSchema.safeParse({
        status: "Invalid",
      });
      expect(result.success).toBe(false);
    });
  });
});
