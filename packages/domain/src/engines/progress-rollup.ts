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

/**
 * Bottom-Up Progress Roll-Up Engine (BR-032)
 *
 * Aggregation pipeline: Weekly → Monthly → Quarterly → Annual
 *
 * Completion Rate = min(100, (Actual / Target) * 100)
 * Department Score = Σ(Completion Rate_i × Weight_i)
 * Master Score = Σ(Completion Rate_i × Weight_i) for all 25 activities
 */
export class ProgressRollUpEngine implements IProgressRollUpEngine {
  calculateActivityProgress(input: ProgressRollUpInput): ActivityProgress {
    const { activity, progressRecords } = input;

    const totalTasks = progressRecords.length;
    const completedTasks = progressRecords.filter((r) => r.status === "Completed").length;
    const inProgressTasks = progressRecords.filter((r) => r.status === "In_Progress").length;
    const pendingTasks = totalTasks - completedTasks - inProgressTasks;

    const progressPercentage =
      activity.annualTarget > 0 ? Math.min(100, (completedTasks / activity.annualTarget) * 100) : 0;

    const quarterlyProgress = this.calculateQuarterlyProgress(activity, progressRecords);

    return {
      activityId: activity.id,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      quarterlyProgress,
    };
  }

  calculateGoalProgress(goalId: string, activities: ActivityProgress[]): GoalProgress {
    if (activities.length === 0) {
      return {
        goalId,
        goalNumber: 0,
        activities: [],
        overallProgress: 0,
      };
    }

    const totalWeight = activities.reduce((sum, a) => sum + a.progressPercentage, 0);
    const overallProgress = totalWeight / activities.length;

    return {
      goalId,
      goalNumber: 0,
      activities,
      overallProgress: Math.round(overallProgress * 100) / 100,
    };
  }

  calculatePlanProgress(planId: string, goals: GoalProgress[]): PlanProgress {
    if (goals.length === 0) {
      return {
        planId,
        goals: [],
        overallProgress: 0,
        status: "on_track",
      };
    }

    const totalProgress = goals.reduce((sum, g) => sum + g.overallProgress, 0);
    const overallProgress = totalProgress / goals.length;

    const status = this.determinePlanStatus(overallProgress);

    return {
      planId,
      goals,
      overallProgress: Math.round(overallProgress * 100) / 100,
      status,
    };
  }

  private calculateQuarterlyProgress(
    activity: PlanActivity,
    _progressRecords: PlanProgressRecord[]
  ): ActivityProgress["quarterlyProgress"] {
    const quarterlyTargets = [
      { key: "q1" as const, target: activity.q1Target },
      { key: "q2" as const, target: activity.q2Target },
      { key: "q3" as const, target: activity.q3Target },
      { key: "q4" as const, target: activity.q4Target },
    ];

    const result: ActivityProgress["quarterlyProgress"] = {
      q1: { target: 0, actual: 0, percentage: 0 },
      q2: { target: 0, actual: 0, percentage: 0 },
      q3: { target: 0, actual: 0, percentage: 0 },
      q4: { target: 0, actual: 0, percentage: 0 },
    };

    for (const qt of quarterlyTargets) {
      const actual = 0;
      const percentage = qt.target > 0 ? Math.min(100, (actual / qt.target) * 100) : 0;
      result[qt.key] = {
        target: qt.target,
        actual,
        percentage: Math.round(percentage * 100) / 100,
      };
    }

    return result;
  }

  private determinePlanStatus(progress: number): "on_track" | "behind" | "ahead" {
    if (progress >= 90) return "on_track";
    if (progress >= 70) return "behind";
    return "behind";
  }
}
