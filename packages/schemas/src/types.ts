/**
 * Shared Domain Types & Interfaces
 * Core domain types used across the application
 */

// Base entity types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Audit fields
export interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy?: string;
}

// Status enums
export enum MemberStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  GRADUATED = "Graduated",
  ARCHIVED = "Archived",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum YearOfStudy {
  FIRST = "1st Year",
  SECOND = "2nd Year",
  THIRD = "3rd Year",
  FOURTH = "4th Year",
  FIFTH = "5th Year",
  GC = "GC",
}

export enum KutrGroup {
  KUTR_1 = "Kutr 1",
  KUTR_2 = "Kutr 2",
}

export enum CollectionLocation {
  APARTAMA = "Apartama",
  GENDE_BOY = "Gende Boy",
  GENDE_JE = "Gende Je",
  COBALT = "Cobalt",
  BATE = "Bate",
}

export enum SubDepartmentCode {
  TIMIHRT = "TIMIHRT",
  MEZMUR = "MEZMUR",
  KUTITR = "KUTITR",
  EKD = "EKD",
  KINETIBEB = "KINETIBEB",
}

export enum SubDeptRole {
  LEADER = "Leader",
  SUB_LEADER = "Sub-Leader",
  SECRETARY = "Secretary",
  MEMBER = "Member",
}

export enum PlanStatus {
  DRAFT = "Draft",
  DISTRIBUTED = "Distributed",
  ACTIVE = "Active",
  COMPLETED = "Completed",
  ARCHIVED = "Archived",
}

export enum PlanDistributionStatus {
  ASSIGNED = "Assigned",
  IN_PROGRESS = "In_Progress",
  COMPLETED = "Completed",
}

export enum SessionType {
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export enum AttendanceStatus {
  EXPECTED = "Expected",
  PRESENT = "Present",
  ABSENT = "Absent",
  EXCUSED = "Excused",
}

export enum PersonType {
  MEMBER = "Member",
  CHILD = "Child",
}

export enum EventType {
  SPECIAL = "Special",
  EXTRA_TRAINING = "Extra_Training",
  AWDEMERIT = "Awdemerit",
  ADAR = "Adar",
}

export enum AssessmentType {
  MID_EXAM = "Mid_Exam",
  FINAL_EXAM = "Final_Exam",
  ASSIGNMENT = "Assignment",
}

export enum TargetAudience {
  PUBLIC = "Public",
  MEMBERS = "Members",
  PARENTS = "Parents",
}

export enum ReportType {
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  HALF_YEAR = "Half_Year",
  ANNUAL = "Annual",
}

// Domain entity interfaces
export interface Member extends BaseEntity {
  fullName: string;
  christianName: string;
  phoneNumber: string;
  yearOfStudy: YearOfStudy;
  academicDepartment: string;
  campus: string;
  gender: Gender;
  photoUrl?: string;
  telegramUsername?: string;
  dateJoined: Date;
  isActive: boolean;
}

export interface SubDepartment extends BaseEntity {
  code: SubDepartmentCode;
  nameAm: string;
  nameEn: string;
  description?: string;
}

export interface SubDepartmentMember extends BaseEntity {
  memberId: string;
  subDepartmentId: string;
  role: SubDeptRole;
  isPrimary: boolean;
  assignedAt: Date;
}

export interface Family extends BaseEntity {
  familyName: string;
  fatherMemberId?: string;
  motherMemberId?: string;
  academicYear: string;
}

export interface FamilyMember extends BaseEntity {
  familyId: string;
  memberId: string;
  assignedAt: Date;
}

export interface Child extends BaseEntity {
  fullName: string;
  christianName: string;
  gender: Gender;
  dateOfBirth: Date;
  address: string;
  kutrGroup: KutrGroup;
  collectionLocation: CollectionLocation;
  photoUrl?: string;
  isActive: boolean;
}

export interface Parent extends BaseEntity {
  fullName: string;
  phoneNumber: string;
  secondaryPhone?: string;
  address: string;
  occupation?: string;
  notes?: string;
}

export interface ChildParent extends BaseEntity {
  childId: string;
  parentId: string;
  relation: "Father" | "Mother";
}

export interface AnnualMasterPlan extends BaseEntity {
  academicYear: string;
  title: string;
  totalBudget: number;
  totalPeople: number;
  totalTime: number;
  status: PlanStatus;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface PlanGoal extends BaseEntity {
  annualPlanId: string;
  goalNumber: number;
  title: string;
}

export interface PlanActivity extends BaseEntity {
  planGoalId: string;
  activityNumber: number;
  mainActivity: string;
  expectedResult?: string;
  annualTarget: number;
  budget: number;
  humanResource: number;
  plannedTime: number;
  weight: number;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
}

export interface PlanDistribution extends BaseEntity {
  planActivityId: string;
  subDepartmentId: string;
  status: PlanDistributionStatus;
  assignedAt: Date;
}

export interface WeeklyPlan extends BaseEntity {
  planDistributionId: string;
  ethiopianMonth: string;
  weekNumber: number;
  sessionDate: Date;
  taskDescription: string;
}

export interface PlanProgressRecord extends BaseEntity {
  weeklyPlanId: string;
  actualResultNumeric?: number;
  actualResultText?: string;
  status: PlanDistributionStatus;
  challenges?: string;
  submittedBy: string;
}

export interface ProgramSession extends BaseEntity {
  sessionType: SessionType;
  sessionDate: Date;
  startTime: Date;
  endTime: Date;
}

export interface ProgramSessionAttendance extends BaseEntity {
  programSessionId: string;
  personType: PersonType;
  personId: string;
  collectionLocation?: string;
  status: AttendanceStatus;
  recordedBy: string;
  confirmedAt?: Date;
}

export interface Event extends BaseEntity {
  eventName: string;
  eventType: EventType;
  eventDate: Date;
  isPublished: boolean;
  countdownActive: boolean;
}

export interface EventProgramAssignment extends BaseEntity {
  eventId: string;
  subDepartmentId: string;
  programTitle: string;
  assignedMembers: string[];
}

export interface EventAttendance extends BaseEntity {
  eventId: string;
  personType: PersonType;
  personId: string;
  status: AttendanceStatus;
  recordedBy: string;
  confirmedAt?: Date;
}

export interface AcademicAssessment extends BaseEntity {
  curriculumId: string;
  assessmentType: AssessmentType;
  subjectTopic: string;
  maxScore: number;
  academicPeriod: string;
  examDate: Date;
}

export interface StudentScore extends BaseEntity {
  academicAssessmentId: string;
  childId: string;
  scoreAchieved: number;
  recordedBy: string;
}

export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  targetAudience: TargetAudience;
  isPublished: boolean;
  publishToTelegram: boolean;
  publishedAt?: Date;
  createdBy: string;
}

export interface AuditLog extends BaseEntity {
  operatorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  payloadDiff?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
}

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

// Permission types
export enum GlobalRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CHAIRPERSON = "CHAIRPERSON",
  SUB_CHAIRPERSON = "SUB_CHAIRPERSON",
  SECRETARY = "SECRETARY",
}

export enum ResourceType {
  MEMBERS = "members",
  FAMILIES = "families",
  CHILDREN = "children",
  PARENTS = "parents",
  SUB_DEPARTMENTS = "sub_departments",
  ATTENDANCE = "attendance",
  ACADEMIC = "academic",
  PLANNING = "planning",
  EVENTS = "events",
  REPORTS = "reports",
  ANNOUNCEMENTS = "announcements",
}

export enum ActionType {
  CREATE = "C",
  READ = "R",
  UPDATE = "U",
  DELETE = "D",
  APPROVE = "A",
}

export interface Permission {
  resource: ResourceType;
  action: ActionType;
  subDepartmentScope?: SubDepartmentCode;
}
