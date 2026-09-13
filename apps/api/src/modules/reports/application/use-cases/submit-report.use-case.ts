import type { ReportSubmission } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

interface SubmitReportInput {
  reportType: string;
  periodLabel: string;
  subDepartmentId: string;
  submittedBy: string;
  metrics?: Record<string, unknown>;
  challenges?: string;
  notes?: string;
}

export class SubmitReportUseCase {
  constructor(private readonly repo: ReportsRepository) {}

  async execute(input: SubmitReportInput): Promise<ReportSubmission> {
    const validTypes = ["Weekly", "Monthly", "Quarterly", "Half_Year", "Annual"];
    if (!validTypes.includes(input.reportType)) {
      throw new Error(
        `Invalid report type: ${input.reportType}. Must be one of: ${validTypes.join(", ")}`
      );
    }

    return this.repo.createSubmission({
      reportType: input.reportType,
      periodLabel: input.periodLabel,
      subDepartmentId: input.subDepartmentId,
      submittedBy: input.submittedBy,
      metrics: input.metrics,
      challenges: input.challenges,
      notes: input.notes,
    });
  }
}
