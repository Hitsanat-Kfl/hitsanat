import { z } from "zod";
import { dateSchema, uuidSchema } from "./common.js";

export const annualPlanSchema = z.object({
  academicYear: z.string().max(32),
  title: z.string().min(1).max(255),
});

export const planGoalSchema = z.object({
  goalNumber: z.number().int().min(1).max(6),
  title: z.string().min(1),
});

export const planActivitySchema = z.object({
  activityNumber: z.number().int().min(1),
  mainActivity: z.string().min(1),
  expectedResult: z.string().optional(),
  annualTarget: z.number().int().min(0),
  budget: z.number().min(0),
  humanResource: z.number().int().min(0),
  plannedTime: z.number().int().min(0),
  q1Target: z.number().int().min(0),
  q2Target: z.number().int().min(0),
  q3Target: z.number().int().min(0),
  q4Target: z.number().int().min(0),
});

export const planDistributionSchema = z.object({
  subDepartmentId: uuidSchema,
});

export const weeklyPlanSchema = z.object({
  ethiopianMonth: z.string().max(32),
  weekNumber: z.number().int().min(1).max(5),
  sessionDate: dateSchema,
  taskDescription: z.string().min(1),
});

export const progressRecordSchema = z.object({
  actualResultNumeric: z.number().int().optional(),
  actualResultText: z.string().optional(),
  status: z.enum(["Pending", "In_Progress", "Completed"]),
  challenges: z.string().optional(),
});

export type AnnualPlanInput = z.infer<typeof annualPlanSchema>;
export type PlanGoalInput = z.infer<typeof planGoalSchema>;
export type PlanActivityInput = z.infer<typeof planActivitySchema>;
export type PlanDistributionInput = z.infer<typeof planDistributionSchema>;
export type WeeklyPlanInput = z.infer<typeof weeklyPlanSchema>;
export type ProgressRecordInput = z.infer<typeof progressRecordSchema>;
