import { describe, expect, it } from "vitest";
import {
  announcementSchema,
  assessmentSchema,
  reportGenerationSchema,
  scoreSchema,
} from "../src/academic.js";

describe("Academic Validation Schemas", () => {
  describe("assessmentSchema", () => {
    it("should accept valid assessment", () => {
      const result = assessmentSchema.safeParse({
        curriculumId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "Mid_Exam",
        subjectTopic: "Mathematics",
        maxScore: 100,
        academicPeriod: "Semester 1",
        examDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Final_Exam type", () => {
      const result = assessmentSchema.safeParse({
        curriculumId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "Final_Exam",
        subjectTopic: "Mathematics",
        maxScore: 100,
        academicPeriod: "Semester 1",
        examDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Assignment type", () => {
      const result = assessmentSchema.safeParse({
        curriculumId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "Assignment",
        subjectTopic: "Mathematics",
        maxScore: 50,
        academicPeriod: "Semester 1",
        examDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid assessmentType", () => {
      const result = assessmentSchema.safeParse({
        curriculumId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "Quiz",
        subjectTopic: "Mathematics",
        maxScore: 100,
        academicPeriod: "Semester 1",
        examDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(false);
    });

    it("should reject zero maxScore", () => {
      const result = assessmentSchema.safeParse({
        curriculumId: "550e8400-e29b-41d4-a716-446655440000",
        assessmentType: "Mid_Exam",
        subjectTopic: "Mathematics",
        maxScore: 0,
        academicPeriod: "Semester 1",
        examDate: "2024-01-15T10:00:00Z",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("scoreSchema", () => {
    it("should accept valid score", () => {
      const result = scoreSchema.safeParse({
        childId: "550e8400-e29b-41d4-a716-446655440000",
        scoreAchieved: 85,
      });
      expect(result.success).toBe(true);
    });

    it("should accept zero score", () => {
      const result = scoreSchema.safeParse({
        childId: "550e8400-e29b-41d4-a716-446655440000",
        scoreAchieved: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative score", () => {
      const result = scoreSchema.safeParse({
        childId: "550e8400-e29b-41d4-a716-446655440000",
        scoreAchieved: -5,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("announcementSchema", () => {
    it("should accept valid announcement", () => {
      const result = announcementSchema.safeParse({
        title: "Sunday Service",
        content: "Join us for Sunday service",
        targetAudience: "Public",
      });
      expect(result.success).toBe(true);
    });

    it("should accept with optional fields", () => {
      const result = announcementSchema.safeParse({
        title: "Sunday Service",
        content: "Join us for Sunday service",
        targetAudience: "Members",
        isPublished: true,
        publishToTelegram: true,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid targetAudience", () => {
      const result = announcementSchema.safeParse({
        title: "Sunday Service",
        content: "Join us for Sunday service",
        targetAudience: "Students",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty title", () => {
      const result = announcementSchema.safeParse({
        title: "",
        content: "Join us for Sunday service",
        targetAudience: "Public",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("reportGenerationSchema", () => {
    it("should accept valid report request", () => {
      const result = reportGenerationSchema.safeParse({
        reportType: "Monthly",
        periodStart: "2024-01-01",
        periodEnd: "2024-01-31",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Weekly type", () => {
      const result = reportGenerationSchema.safeParse({
        reportType: "Weekly",
        periodStart: "2024-01-01",
        periodEnd: "2024-01-07",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Quarterly type", () => {
      const result = reportGenerationSchema.safeParse({
        reportType: "Quarterly",
        periodStart: "2024-01-01",
        periodEnd: "2024-03-31",
      });
      expect(result.success).toBe(true);
    });

    it("should accept Annual type", () => {
      const result = reportGenerationSchema.safeParse({
        reportType: "Annual",
        periodStart: "2024-01-01",
        periodEnd: "2024-12-31",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid reportType", () => {
      const result = reportGenerationSchema.safeParse({
        reportType: "Biannual",
        periodStart: "2024-01-01",
        periodEnd: "2024-06-30",
      });
      expect(result.success).toBe(false);
    });
  });
});
