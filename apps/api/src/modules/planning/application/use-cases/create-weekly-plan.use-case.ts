import type { WeeklyPlan } from "@repo/domain";
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

interface CreateWeeklyPlanInput {
  distributionId: string;
  ethiopianMonth: string;
  weekNumber: number;
  sessionDate: Date;
  taskDescription: string;
}

export class CreateWeeklyPlanUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(input: CreateWeeklyPlanInput): Promise<WeeklyPlan> {
    return this.repo.createWeeklyPlan({
      planDistributionId: input.distributionId,
      ethiopianMonth: input.ethiopianMonth,
      weekNumber: input.weekNumber,
      sessionDate: input.sessionDate,
      taskDescription: input.taskDescription,
    });
  }
}
