import type {
  AnnualMasterPlan,
  PlanActivity,
  PlanDistribution,
  PlanGoal,
  PlanProgressRecord,
  WeeklyPlan,
} from "@repo/domain";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface PlanWithGoals extends AnnualMasterPlan {
  goals: (PlanGoal & { activities: PlanActivity[] })[];
}

export interface PlanningRepository {
  // Annual Plan
  findPlanById(id: string): Promise<PlanWithGoals | null>;
  findManyPlans(params: PaginationParams): Promise<PaginatedResponse<AnnualMasterPlan>>;
  createPlan(
    data: Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">
  ): Promise<AnnualMasterPlan>;
  updatePlan(
    id: string,
    data: Partial<Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">>
  ): Promise<AnnualMasterPlan>;
  deletePlan(id: string): Promise<void>;

  // Goals
  createGoal(data: Omit<PlanGoal, "id" | "createdAt">): Promise<PlanGoal>;
  findGoalsByPlanId(planId: string): Promise<PlanGoal[]>;

  // Activities
  createActivity(data: Omit<PlanActivity, "id" | "createdAt" | "updatedAt">): Promise<PlanActivity>;
  findActivitiesByGoalId(goalId: string): Promise<PlanActivity[]>;
  findActivityById(id: string): Promise<PlanActivity | null>;
  updateActivity(
    id: string,
    data: Partial<Omit<PlanActivity, "id" | "createdAt" | "updatedAt">>
  ): Promise<PlanActivity>;

  // Distributions
  createDistribution(
    data: Omit<PlanDistribution, "id" | "createdAt" | "updatedAt">
  ): Promise<PlanDistribution>;
  findDistributionsByActivityId(activityId: string): Promise<PlanDistribution[]>;
  findDistributionsBySubDepartment(subDepartmentId: string): Promise<PlanDistribution[]>;
  updateDistributionStatus(id: string, status: string): Promise<PlanDistribution>;

  // Weekly Plans
  createWeeklyPlan(data: Omit<WeeklyPlan, "id" | "createdAt" | "updatedAt">): Promise<WeeklyPlan>;
  findWeeklyPlansByDistributionId(distributionId: string): Promise<WeeklyPlan[]>;

  // Progress Records
  createProgressRecord(
    data: Omit<PlanProgressRecord, "id" | "createdAt" | "updatedAt">
  ): Promise<PlanProgressRecord>;
  findProgressRecordsByWeeklyPlanId(weeklyPlanId: string): Promise<PlanProgressRecord[]>;

  // Analytics Queries (BES-012)
  findDistributionsByPlanId(
    planId: string
  ): Promise<(PlanDistribution & { activityMainActivity: string; subDepartmentName: string })[]>;
  findProgressByPlanId(planId: string): Promise<
    {
      goalNumber: number;
      goalTitle: string;
      activityId: string;
      mainActivity: string;
      weight: number;
      progressCount: number;
      totalNumeric: number;
      latestStatus: string | null;
    }[]
  >;
}
