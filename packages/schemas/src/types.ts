// Re-export domain types for backward compatibility
export {
  type BaseEntity,
  type AuditableEntity,
  MemberStatus,
  Gender,
  YearOfStudy,
  type Member,
  type SubDepartment,
  type SubDepartmentMember,
  SubDeptRole,
  type CreateMember,
  type UpdateMember,
  type Family,
  type FamilyMember,
  type CreateFamily,
  type UpdateFamily,
  KutrGroup,
  CollectionLocation,
  type Child,
  type Parent,
  type ChildParent,
  type CreateChild,
  type UpdateChild,
  type CreateParent,
  type UpdateParent,
  PlanStatus,
  PlanDistributionStatus,
  type AnnualMasterPlan,
  type PlanGoal,
  type PlanActivity,
  type PlanDistribution,
  type WeeklyPlan,
  type PlanProgressRecord,
  type CreateAnnualMasterPlan,
  type UpdateAnnualMasterPlan,
  SessionType,
  AttendanceStatus,
  PersonType,
  EventType,
  type ProgramSession,
  type ProgramSessionAttendance,
  type Event,
  type EventProgramAssignment,
  type EventAttendance,
  type CreateProgramSession,
  type CreateEvent,
  AssessmentType,
  TargetAudience,
  type AcademicAssessment,
  type StudentScore,
  type Announcement,
  type AuditLog,
  type CreateAcademicAssessment,
  type CreateAnnouncement,
  DomainError,
  NotFoundError,
  ValidationError,
  BusinessRuleViolationError,
} from "@repo/domain";

// Re-export permission types for backward compatibility
export {
  GlobalRole,
  ResourceType,
  ActionType,
  SubDepartmentCode,
  type Permission,
  type UserSession,
  type PermissionContext,
  type PermissionCheckResult,
} from "@repo/permissions";

// Re-export validation schemas for backward compatibility
export {
  uuidSchema,
  phoneSchema,
  emailSchema,
  dateSchema,
  paginationSchema,
  type PaginationInput,
  memberStage1Schema,
  memberStage2Schema,
  memberResponseSchema,
  type MemberStage1Input,
  type MemberStage2Input,
  type MemberResponse,
  familySchema,
  familyResponseSchema,
  type FamilyInput,
  type FamilyResponse,
  childRegistrationSchema,
  childResponseSchema,
  parentSchema,
  parentResponseSchema,
  childParentLinkSchema,
  type ChildRegistrationInput,
  type ChildResponse,
  type ParentInput,
  type ParentResponse,
  type ChildParentLinkInput,
  annualPlanSchema,
  planGoalSchema,
  planActivitySchema,
  planDistributionSchema,
  weeklyPlanSchema,
  progressRecordSchema,
  type AnnualPlanInput,
  type PlanGoalInput,
  type PlanActivityInput,
  type PlanDistributionInput,
  type WeeklyPlanInput,
  type ProgressRecordInput,
  sessionSchema,
  attendanceUpdateSchema,
  batchVerifySchema,
  eventSchema,
  eventAssignmentSchema,
  type SessionInput,
  type AttendanceUpdateInput,
  type BatchVerifyInput,
  type EventInput,
  type EventAssignmentInput,
  assessmentSchema,
  scoreSchema,
  announcementSchema,
  reportGenerationSchema,
  type AssessmentInput,
  type ScoreInput,
  type AnnouncementInput,
  type ReportGenerationInput,
  apiResponseSchema,
  paginatedResponseSchema,
  type ApiResponseInput,
  type PaginatedResponseInput,
} from "@repo/validation";

// Utility types
export type CreateEntity<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type UpdateEntity<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}
