import { z } from "zod";
import { uuidSchema, dateSchema } from "./common.js";

export const familySchema = z.object({
  familyName: z.string().min(1).max(128),
  fatherMemberId: uuidSchema.optional(),
  motherMemberId: uuidSchema.optional(),
  academicYear: z.string().min(1).max(32),
});

export const familyResponseSchema = z.object({
  id: uuidSchema,
  familyName: z.string(),
  fatherMemberId: uuidSchema.nullable(),
  motherMemberId: uuidSchema.nullable(),
  academicYear: z.string(),
  createdAt: dateSchema,
});

export type FamilyInput = z.infer<typeof familySchema>;
export type FamilyResponse = z.infer<typeof familyResponseSchema>;
