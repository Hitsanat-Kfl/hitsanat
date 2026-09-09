import type { PlanDistribution } from "@repo/domain";
import { PlanDistributionStatus } from "@repo/domain";
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

interface DistributePlanInput {
  activityId: string;
  subDepartmentIds: string[];
}

export class DistributePlanUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(input: DistributePlanInput): Promise<PlanDistribution[]> {
    const activity = await this.repo.findActivityById(input.activityId);
    if (!activity) {
      throw new Error(`Plan activity not found: ${input.activityId}`);
    }

    const distributions: PlanDistribution[] = [];

    for (const subDepartmentId of input.subDepartmentIds) {
      const distribution = await this.repo.createDistribution({
        planActivityId: input.activityId,
        subDepartmentId,
        status: PlanDistributionStatus.ASSIGNED,
        assignedAt: new Date(),
      });
      distributions.push(distribution);
    }

    return distributions;
  }
}
