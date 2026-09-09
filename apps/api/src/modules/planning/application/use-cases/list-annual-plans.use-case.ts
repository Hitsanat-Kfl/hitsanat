import type { AnnualMasterPlan } from "@repo/domain";
import type {
  PlanningRepository,
  PaginatedResponse,
} from "../../domain/repositories/planning.repository.js";

interface ListAnnualPlansInput {
  page?: number;
  limit?: number;
  search?: string;
}

export class ListAnnualPlansUseCase {
  constructor(private readonly repo: PlanningRepository) {}

  async execute(input: ListAnnualPlansInput): Promise<PaginatedResponse<AnnualMasterPlan>> {
    return this.repo.findManyPlans({
      page: input.page,
      limit: input.limit,
      search: input.search,
    });
  }
}
