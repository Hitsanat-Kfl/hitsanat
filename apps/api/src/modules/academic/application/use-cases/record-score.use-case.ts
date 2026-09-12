import type { StudentScore } from "@repo/domain";
import type { AcademicRepository } from "../../domain/repositories/academic.repository.js";

interface RecordScoreInput {
  academicAssessmentId: string;
  childId: string;
  scoreAchieved: number;
  recordedBy: string;
}

export class RecordScoreUseCase {
  constructor(private readonly repo: AcademicRepository) {}

  async execute(input: RecordScoreInput): Promise<StudentScore> {
    const assessment = await this.repo.findAssessmentById(input.academicAssessmentId);
    if (!assessment) {
      throw new Error(`Academic assessment not found: ${input.academicAssessmentId}`);
    }

    if (input.scoreAchieved < 0 || input.scoreAchieved > assessment.maxScore) {
      throw new Error(
        `Score ${input.scoreAchieved} is outside valid range (0-${assessment.maxScore})`
      );
    }

    return this.repo.createScore({
      academicAssessmentId: input.academicAssessmentId,
      childId: input.childId,
      scoreAchieved: input.scoreAchieved,
      recordedBy: input.recordedBy,
    });
  }
}
