import type { BaseEntity } from "../base.js";

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

export type CreateAnnualMasterPlan = Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">;
export type UpdateAnnualMasterPlan = Partial<
  Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">
>;
