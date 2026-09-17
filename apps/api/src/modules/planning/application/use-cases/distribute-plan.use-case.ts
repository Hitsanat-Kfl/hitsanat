import type {
  PlanDistribution,
  PlanDistributionStatus as PlanDistributionStatusEnum,
} from "@repo/domain";

const PlanDistributionStatus = {
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In_Progress",
  COMPLETED: "Completed",
} as const;
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
        status: PlanDistributionStatus.ASSIGNED as PlanDistributionStatusEnum,
        assignedAt: new Date(),
      });
      distributions.push(distribution);
    }

    return distributions;
  }
}
