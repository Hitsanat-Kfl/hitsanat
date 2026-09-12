import type { AcademicAssessment } from "@repo/domain";
import type { AcademicRepository } from "../../domain/repositories/academic.repository.js";

interface ListAssessmentsInput {
  page?: number;
  limit?: number;
  subjectTopic?: string;
  assessmentType?: string;
}

export class ListAssessmentsUseCase {
  constructor(private readonly repo: AcademicRepository) {}

  async execute(input: ListAssessmentsInput): Promise<{
    success: boolean;
    data: AcademicAssessment[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.repo.findManyAssessments(input);
  }
}
