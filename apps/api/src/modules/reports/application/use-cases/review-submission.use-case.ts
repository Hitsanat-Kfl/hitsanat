import type { ReportSubmission } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

interface ReviewSubmissionInput {
  id: string;
  reviewedBy: string;
  status: string;
  /** Chairperson review comments (required when returning a submission). */
  reviewComments?: string;
}

export class ReviewSubmissionUseCase {
  constructor(private readonly repo: ReportsRepository) {}

  async execute(input: ReviewSubmissionInput): Promise<ReportSubmission> {
    const validStatuses = ["Under_Review", "Accepted", "Returned"];
    if (!validStatuses.includes(input.status)) {
      throw new Error(
        `Invalid review status: ${input.status}. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const existing = await this.repo.findSubmissionById(input.id);
    if (!existing) {
      throw new Error(`Submission not found: ${input.id}`);
    }

    return this.repo.reviewSubmission(input.id, {
      reviewedBy: input.reviewedBy,
      status: input.status,
      reviewComments: input.reviewComments,
    });
  }
}
