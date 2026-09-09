import type { PlanDistributionStatus, PlanProgressRecord } from "@repo/domain";
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

interface SubmitProgressInput {
  weeklyPlanId: string;
  actualResultNumeric?: number;
  actualResultText?: string;
  status: PlanDistributionStatus;
  challenges?: string;
  submittedBy: string;
}

export class SubmitProgressUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(input: SubmitProgressInput): Promise<PlanProgressRecord> {
    return this.repo.createProgressRecord({
      weeklyPlanId: input.weeklyPlanId,
      actualResultNumeric: input.actualResultNumeric,
      actualResultText: input.actualResultText,
      status: input.status,
      challenges: input.challenges,
      submittedBy: input.submittedBy,
    });
  }
}
