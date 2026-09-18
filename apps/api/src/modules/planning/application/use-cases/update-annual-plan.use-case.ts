import type { AnnualMasterPlan, PlanStatus as PlanStatusEnum } from "@repo/domain";

const PlanStatus = {
  DRAFT: "Draft",
  DISTRIBUTED: "Distributed",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
} as const;
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

interface UpdateAnnualPlanInput {
  title?: string;
  status?: PlanStatusEnum;
  approvedBy?: string;
}

export class UpdateAnnualPlanUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(id: string, input: UpdateAnnualPlanInput): Promise<AnnualMasterPlan> {
    const existing = await this.repo.findPlanById(id);
    if (!existing) {
      throw new Error(`Annual plan not found: ${id}`);
    }

    const updateData: Partial<Omit<AnnualMasterPlan, "id" | "createdAt" | "updatedAt">> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.status !== undefined) {
      updateData.status = input.status as PlanStatusEnum;
      if (input.status === PlanStatus.ACTIVE && input.approvedBy) {
        updateData.approvedBy = input.approvedBy;
        updateData.approvedAt = new Date();
      }
    }

    return this.repo.updatePlan(id, updateData);
  }
}
