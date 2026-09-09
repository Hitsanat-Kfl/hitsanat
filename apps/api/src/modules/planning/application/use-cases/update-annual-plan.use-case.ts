import type { AnnualMasterPlan } from "@repo/domain";
import { PlanStatus } from "@repo/domain";
import type { PlanningRepository } from "../../domain/repositories/planning.repository.js";

interface UpdateAnnualPlanInput {
  title?: string;
  status?: PlanStatus;
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
      updateData.status = input.status;
      if (input.status === PlanStatus.ACTIVE && input.approvedBy) {
        updateData.approvedBy = input.approvedBy;
        updateData.approvedAt = new Date();
      }
    }

    return this.repo.updatePlan(id, updateData);
  }
}
