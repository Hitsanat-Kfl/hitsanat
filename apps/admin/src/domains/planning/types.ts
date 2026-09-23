export type PlanStatus = "Draft" | "Distributed" | "Active" | "Completed" | "Archived";
export type PlanDistributionStatus = "Assigned" | "In_Progress" | "Completed";

export interface AnnualMasterPlan {
  id: string;
  academicYear: string;
  title: string;
  totalBudget: number;
  totalPeople: number;
  totalTime: number;
  status: PlanStatus;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface PlanGoal {
  id: string;
  annualPlanId: string;
  goalNumber: number;
  title: string;
  createdAt: string;
}

export interface PlanActivity {
  id: string;
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
  createdAt: string;
}

export interface PlanWithGoals extends AnnualMasterPlan {
  goals: (PlanGoal & { activities: PlanActivity[] })[];
}

export interface PlanDistribution {
  id: string;
  planActivityId: string;
  subDepartmentId: string;
  status: PlanDistributionStatus;
  assignedAt: string;
  createdAt: string;
}

export interface WeeklyPlan {
  id: string;
  planDistributionId: string;
  ethiopianMonth: string;
  weekNumber: number;
  sessionDate: string;
  taskDescription: string;
  createdAt: string;
}

export interface PlanProgressRecord {
  id: string;
  weeklyPlanId: string;
  actualResultNumeric?: number;
  actualResultText?: string;
  status: PlanDistributionStatus;
  challenges?: string;
  submittedBy: string;
  createdAt: string;
}

export interface DistributionStatusItem {
  distributionId: string;
  activityMainActivity: string;
  subDepartmentId: string;
  status: string;
  assignedAt: string;
}

export interface ProgressSummaryItem {
  goalNumber: number;
  goalTitle: string;
  activityId: string;
  mainActivity: string;
  weight: number;
  progressCount: number;
  totalNumeric: number;
  latestStatus: string | null;
}
