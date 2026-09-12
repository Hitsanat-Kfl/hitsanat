import type { StudentScore } from "@repo/domain";
import type { AcademicRepository } from "../../domain/repositories/academic.repository.js";

export class ListScoresUseCase {
  constructor(private readonly repo: AcademicRepository) {}

  async executeByAssessment(assessmentId: string): Promise<StudentScore[]> {
    return this.repo.findScoresByAssessmentId(assessmentId);
  }

  async executeByChild(childId: string): Promise<StudentScore[]> {
    return this.repo.findScoresByChildId(childId);
  }
}
