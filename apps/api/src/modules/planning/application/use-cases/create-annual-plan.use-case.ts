import type { AnnualMasterPlan, PlanGoal, PlanActivity } from "@repo/domain";
import { PlanStatus, WeightCalculationEngine } from "@repo/domain";
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

interface CreateAnnualPlanInput {
  academicYear: string;
  title: string;
  createdBy: string;
  goals: {
    goalNumber: number;
    title: string;
    activities: {
      activityNumber: number;
      mainActivity: string;
      expectedResult?: string;
      annualTarget: number;
      budget: number;
      humanResource: number;
      plannedTime: number;
      q1Target: number;
      q2Target: number;
      q3Target: number;
      q4Target: number;
    }[];
  }[];
}

export class CreateAnnualPlanUseCase {
  private readonly weightEngine = new WeightCalculationEngine();

  constructor(private readonly repo: PlanningRepository) {}

  async execute(input: CreateAnnualPlanInput): Promise<{
    plan: AnnualMasterPlan;
    goals: (PlanGoal & { activities: PlanActivity[] })[];
  }> {
    const allActivities = input.goals.flatMap((g) =>
      g.activities.map((a) => ({
        annualTarget: a.annualTarget,
        budget: a.budget,
        humanResource: a.humanResource,
        plannedTime: a.plannedTime,
        q1Target: a.q1Target,
        q2Target: a.q2Target,
        q3Target: a.q3Target,
        q4Target: a.q4Target,
      }))
    );

    const batchResult = this.weightEngine.calculateBatch(allActivities);

    const plan = await this.repo.createPlan({
      academicYear: input.academicYear,
      title: input.title,
      totalBudget: batchResult.totals.budget,
      totalPeople: batchResult.totals.people,
      totalTime: batchResult.totals.time,
      status: PlanStatus.DRAFT,
      createdBy: input.createdBy,
    });

    let activityIndex = 0;
    const goals: (PlanGoal & { activities: PlanActivity[] })[] = [];

    for (const goalInput of input.goals) {
      const goal = await this.repo.createGoal({
        annualPlanId: plan.id,
        goalNumber: goalInput.goalNumber,
        title: goalInput.title,
      });

      const activities: PlanActivity[] = [];
      for (const actInput of goalInput.activities) {
        const weightResult = batchResult.activities[activityIndex];
        const activity = await this.repo.createActivity({
          planGoalId: goal.id,
          activityNumber: actInput.activityNumber,
          mainActivity: actInput.mainActivity,
          expectedResult: actInput.expectedResult,
          annualTarget: actInput.annualTarget,
          budget: actInput.budget,
          humanResource: actInput.humanResource,
          plannedTime: actInput.plannedTime,
          weight: weightResult.weight,
          q1Target: actInput.q1Target,
          q2Target: actInput.q2Target,
          q3Target: actInput.q3Target,
          q4Target: actInput.q4Target,
        });
        activities.push(activity);
        activityIndex++;
      }

      goals.push({ ...goal, activities });
    }

    return { plan, goals };
  }
}
