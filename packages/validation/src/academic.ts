import { z } from "zod";
import { uuidSchema, dateSchema } from "./common.js";

export const assessmentSchema = z.object({
  curriculumId: uuidSchema,
  assessmentType: z.enum(["Mid_Exam", "Final_Exam", "Assignment"]),
  subjectTopic: z.string().min(1).max(255),
  maxScore: z.number().min(1),
  academicPeriod: z.string().max(32),
  examDate: dateSchema,
});

export const scoreSchema = z.object({
  childId: uuidSchema,
  scoreAchieved: z.number().min(0),
});

export const announcementSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  targetAudience: z.enum(["Public", "Members", "Parents"]),
  isPublished: z.boolean().optional(),
  publishToTelegram: z.boolean().optional(),
});

export const reportGenerationSchema = z.object({
  reportType: z.enum(["Weekly", "Monthly", "Quarterly", "Half_Year", "Annual"]),
  periodStart: z.string().date(),
  periodEnd: z.string().date(),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;
export type ScoreInput = z.infer<typeof scoreSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type ReportGenerationInput = z.infer<typeof reportGenerationSchema>;
