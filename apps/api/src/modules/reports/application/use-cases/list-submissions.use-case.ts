import type { ReportSubmission } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

interface ListSubmissionsInput {
  page?: number;
  limit?: number;
  subDepartmentId?: string;
  status?: string;
}

export class ListSubmissionsUseCase {
  constructor(private readonly repo: ReportsRepository) {}

  async execute(input: ListSubmissionsInput): Promise<{
    success: boolean;
    data: ReportSubmission[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.repo.findManySubmissions(input);
  }
}
