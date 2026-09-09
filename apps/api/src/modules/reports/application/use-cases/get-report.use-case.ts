import type { PeriodicReport } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

export class GetReportUseCase {
  constructor(private readonly repo: ReportsRepository) {}

  async execute(id: string): Promise<PeriodicReport> {
    const report = await this.repo.findReportById(id);
    if (!report) {
      throw new Error(`Report not found: ${id}`);
    }
    return report;
  }
}
