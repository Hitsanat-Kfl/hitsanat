import type { PeriodicReport } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

export class ListReportsUseCase {
  constructor(private readonly repo: ReportsRepository) {}

  async execute(params: {
    page?: number;
    limit?: number;
    reportType?: string;
    subDepartmentId?: string;
  }): Promise<{
    success: boolean;
    data: PeriodicReport[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.repo.findManyReports(params);
  }
}
