import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

export interface DistributionStatusItem {
  distributionId: string;
  activityMainActivity: string;
  subDepartmentId: string;
  status: string;
  assignedAt: Date;
}

export class GetDistributionStatusUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(planId: string): Promise<DistributionStatusItem[]> {
    const distributions = await this.repo.findDistributionsByPlanId(planId);
    return distributions.map((d) => ({
      distributionId: d.id,
      activityMainActivity: d.activityMainActivity,
      subDepartmentId: d.subDepartmentId,
      status: d.status,
      assignedAt: d.assignedAt,
    }));
  }
}
