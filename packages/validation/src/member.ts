import { z } from "zod";
import { dateSchema, phoneSchema, uuidSchema } from "./common.js";

export const memberStage1Schema = z.object({
  fullName: z.string().min(1).max(255),
  christianName: z.string().min(1).max(255),
  phoneNumber: phoneSchema,
  yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "GC"]),
  academicDepartment: z.string().min(1).max(255),
  campus: z.string().min(1).max(128),
  gender: z.enum(["Male", "Female"]),
});

export const memberStage2Schema = z.object({
  subDepartmentIds: z.array(uuidSchema).min(1),
  familyId: uuidSchema.optional(),
  photoUrl: z.string().url().optional(),
  telegramUsername: z.string().max(128).optional(),
});

export const memberResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string(),
  christianName: z.string(),
  phoneNumber: z.string(),
  yearOfStudy: z.string(),
  academicDepartment: z.string(),
  campus: z.string(),
  gender: z.string(),
  photoUrl: z.string().nullable(),
  telegramUsername: z.string().nullable(),
  dateJoined: dateSchema,
  isActive: z.boolean(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export type MemberStage1Input = z.infer<typeof memberStage1Schema>;
export type MemberStage2Input = z.infer<typeof memberStage2Schema>;
export type MemberResponse = z.infer<typeof memberResponseSchema>;
