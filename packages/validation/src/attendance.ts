import { z } from "zod";
import { uuidSchema, dateSchema } from "./common.js";

export const sessionSchema = z.object({
  sessionType: z.enum(["Saturday", "Sunday"]),
  sessionDate: z.string().date(),
  startTime: dateSchema,
  endTime: dateSchema,
});

export const attendanceUpdateSchema = z.object({
  status: z.enum(["Expected", "Present", "Absent", "Excused"]),
});

export const batchVerifySchema = z.object({
  recordIds: z.array(uuidSchema).min(1),
  status: z.enum(["Present", "Absent", "Excused"]),
});

export const eventSchema = z.object({
  eventName: z.string().min(1).max(255),
  eventType: z.enum(["Special", "Extra_Training", "Awdemerit", "Adar"]),
  eventDate: dateSchema,
  isPublished: z.boolean().optional(),
  countdownActive: z.boolean().optional(),
});

export const eventAssignmentSchema = z.object({
  subDepartmentId: uuidSchema,
  programTitle: z.string().min(1).max(255),
  assignedMembers: z.array(uuidSchema).min(2),
});

export type SessionInput = z.infer<typeof sessionSchema>;
export type AttendanceUpdateInput = z.infer<typeof attendanceUpdateSchema>;
export type BatchVerifyInput = z.infer<typeof batchVerifySchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type EventAssignmentInput = z.infer<typeof eventAssignmentSchema>;
