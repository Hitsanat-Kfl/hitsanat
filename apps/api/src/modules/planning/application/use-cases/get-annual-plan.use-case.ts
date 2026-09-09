import type { PlanWithGoals } from "../../domain/repositories/planning.repository.js";
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

export class GetAnnualPlanUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(id: string): Promise<PlanWithGoals> {
    const plan = await this.repo.findPlanById(id);
    if (!plan) {
      throw new Error(`Annual plan not found: ${id}`);
    }
    return plan;
  }
}
