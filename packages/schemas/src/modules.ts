import { z } from "zod";

// Common validation patterns
export const uuidSchema = z.string().uuid();
export const phoneSchema = z.string().min(10).max(20);
export const emailSchema = z.string().email();
export const dateSchema = z.string().datetime();
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// Member schemas
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

export type MemberStage1 = z.infer<typeof memberStage1Schema>;
export type MemberStage2 = z.infer<typeof memberStage2Schema>;
export type MemberResponse = z.infer<typeof memberResponseSchema>;

// Children schemas
export const childRegistrationSchema = z.object({
  fullName: z.string().min(1).max(255),
  christianName: z.string().min(1).max(255),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.string().date(),
  address: z.string().min(1),
  kutrGroup: z.enum(["Kutr 1", "Kutr 2"]),
  collectionLocation: z.enum(["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"]),
  photoUrl: z.string().url().optional(),
});

export const childResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string(),
  christianName: z.string(),
  gender: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
  kutrGroup: z.string(),
  collectionLocation: z.string(),
  photoUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: dateSchema,
});

export type ChildRegistration = z.infer<typeof childRegistrationSchema>;
export type ChildResponse = z.infer<typeof childResponseSchema>;

// Parent schemas
export const parentSchema = z.object({
  fullName: z.string().min(1).max(255),
  phoneNumber: phoneSchema,
  secondaryPhone: phoneSchema.optional(),
  address: z.string().min(1),
  occupation: z.string().max(128).optional(),
  notes: z.string().optional(),
});

export const parentResponseSchema = z.object({
  id: uuidSchema,
  fullName: z.string(),
  phoneNumber: z.string(),
  secondaryPhone: z.string().nullable(),
  address: z.string(),
  occupation: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: dateSchema,
});

export type ParentSchema = z.infer<typeof parentSchema>;
export type ParentResponse = z.infer<typeof parentResponseSchema>;

// Child-Parent linking
export const childParentLinkSchema = z.object({
  parentId: uuidSchema,
  relation: z.enum(["Father", "Mother"]),
});

export type ChildParentLink = z.infer<typeof childParentLinkSchema>;

// Planning schemas
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

export type AnnualPlanSchema = z.infer<typeof annualPlanSchema>;
export type PlanGoalSchema = z.infer<typeof planGoalSchema>;
export type PlanActivitySchema = z.infer<typeof planActivitySchema>;
export type PlanDistributionSchema = z.infer<typeof planDistributionSchema>;
export type WeeklyPlanSchema = z.infer<typeof weeklyPlanSchema>;
export type ProgressRecordSchema = z.infer<typeof progressRecordSchema>;

// Attendance schemas
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

export type Session = z.infer<typeof sessionSchema>;
export type AttendanceUpdate = z.infer<typeof attendanceUpdateSchema>;
export type BatchVerify = z.infer<typeof batchVerifySchema>;

// Event schemas
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

export type EventSchema = z.infer<typeof eventSchema>;
export type EventAssignmentSchema = z.infer<typeof eventAssignmentSchema>;

// Academic schemas
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

export type Assessment = z.infer<typeof assessmentSchema>;
export type Score = z.infer<typeof scoreSchema>;

// Announcement schemas
export const announcementSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  targetAudience: z.enum(["Public", "Members", "Parents"]),
  isPublished: z.boolean().optional(),
  publishToTelegram: z.boolean().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

// Report schemas
export const reportGenerationSchema = z.object({
  reportType: z.enum(["Weekly", "Monthly", "Quarterly", "Half_Year", "Annual"]),
  periodStart: z.string().date(),
  periodEnd: z.string().date(),
});

export type ReportGeneration = z.infer<typeof reportGenerationSchema>;

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type ApiResponseSchema = z.infer<typeof apiResponseSchema>;
export type PaginatedResponseSchema = z.infer<typeof paginatedResponseSchema>;
