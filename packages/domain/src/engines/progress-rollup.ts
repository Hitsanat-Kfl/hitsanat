import type {
  PlanActivity,
  PlanDistribution,
  PlanProgressRecord,
  WeeklyPlan,
} from "../entities/planning.js";

export interface ProgressRollUpInput {
  activity: PlanActivity;
  distributions: PlanDistribution[];
  weeklyPlans: WeeklyPlan[];
  progressRecords: PlanProgressRecord[];
}

export interface ActivityProgress {
  activityId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  progressPercentage: number;
  quarterlyProgress: {
    q1: { target: number; actual: number; percentage: number };
    q2: { target: number; actual: number; percentage: number };
    q3: { target: number; actual: number; percentage: number };
    q4: { target: number; actual: number; percentage: number };
  };
}

export interface GoalProgress {
  goalId: string;
  goalNumber: number;
  activities: ActivityProgress[];
  overallProgress: number;
}

export interface PlanProgress {
  planId: string;
  goals: GoalProgress[];
  overallProgress: number;
  status: "on_track" | "behind" | "ahead";
}

export interface IProgressRollUpEngine {
  calculateActivityProgress(input: ProgressRollUpInput): ActivityProgress;
  calculateGoalProgress(goalId: string, activities: ActivityProgress[]): GoalProgress;
  calculatePlanProgress(planId: string, goals: GoalProgress[]): PlanProgress;
}
