import type { PeriodicReport } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

/**
 * ApprovePeriodicReportUseCase (modules/reports.md §3, endpoints.md §2.5):
 * Chairperson or Sub-Chairperson (ADR-0018) signs off and archives the
 * approved periodic report.
 */
export class ApproveReportUseCase {
  constructor(private readonly repo: ReportsRepository) {}

  async execute(input: {
    id: string;
    approvedBy: string;
    comments?: string;
  }): Promise<PeriodicReport> {
    const existing = await this.repo.findReportById(input.id);
    if (!existing) {
      throw new Error(`Report not found: ${input.id}`);
    }
    if (existing.status === "Approved") {
      throw new Error("Report is already approved and archived");
    }

    return this.repo.updateReport(input.id, {
      status: "Approved",
      notes: input.comments?.trim()
        ? [existing.notes, `Executive sign-off: ${input.comments.trim()}`]
            .filter(Boolean)
            .join(" — ")
        : existing.notes,
    });
  }
}
