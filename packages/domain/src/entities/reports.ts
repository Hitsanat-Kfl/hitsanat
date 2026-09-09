import type { BaseEntity } from "../base.js";

export enum ReportType {
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  HALF_YEAR = "Half_Year",
  ANNUAL = "Annual",
}

export enum ReportStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  REVIEWED = "Reviewed",
  APPROVED = "Approved",
}

export enum SubmissionStatus {
  SUBMITTED = "Submitted",
  UNDER_REVIEW = "Under_Review",
  ACCEPTED = "Accepted",
  RETURNED = "Returned",
}

export interface ReportMetrics {
  planning?: {
    totalActivities: number;
    completedActivities: number;
    overallProgress: number;
    weightedScore: number;
  };
  attendance?: {
    totalSessions: number;
    averageAttendanceRate: number;
    totalPresent: number;
    totalAbsent: number;
    totalExcused: number;
  };
  academic?: {
    totalAssessments: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  performance?: {
    plannedTarget: number;
    actualAchievement: number;
    completionPercentage: number;
    budgetVariance: number;
  };
}

export interface PeriodicReport extends BaseEntity {
  reportType: ReportType;
  periodLabel: string;
  periodStart: Date;
  periodEnd: Date;
  subDepartmentId?: string;
  generatedBy: string;
  status: ReportStatus;
  metrics?: ReportMetrics;
  challenges?: string;
  notes?: string;
}

export interface ReportSubmission extends BaseEntity {
  reportType: ReportType;
  periodLabel: string;
  subDepartmentId: string;
  submittedBy: string;
  status: SubmissionStatus;
  metrics?: ReportMetrics;
  challenges?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export type CreatePeriodicReport = Omit<PeriodicReport, "id" | "createdAt" | "updatedAt">;
export type CreateReportSubmission = Omit<ReportSubmission, "id" | "createdAt" | "updatedAt">;
