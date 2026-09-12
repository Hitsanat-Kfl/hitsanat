import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

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

export class GetProgressSummaryUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(planId: string): Promise<ProgressSummaryItem[]> {
    return this.repo.findProgressByPlanId(planId);
  }
}
