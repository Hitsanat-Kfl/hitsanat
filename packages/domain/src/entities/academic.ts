import type { BaseEntity } from "../base.js";

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

export type CreateAcademicAssessment = Omit<AcademicAssessment, "id" | "createdAt" | "updatedAt">;
export type CreateAnnouncement = Omit<Announcement, "id" | "createdAt" | "updatedAt">;
