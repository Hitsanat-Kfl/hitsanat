import type { AcademicAssessment } from "@repo/domain";
import type { AssessmentType } from "@repo/domain";
import type { AcademicRepository } from "../../domain/repositories/academic.repository.js";

interface CreateAssessmentInput {
  curriculumId: string;
  assessmentType: AssessmentType;
  subjectTopic: string;
  maxScore: number;
  academicPeriod: string;
  examDate: Date;
}

export class CreateAssessmentUseCase {
  constructor(private readonly repo: AcademicRepository) {}

  async execute(input: CreateAssessmentInput): Promise<AcademicAssessment> {
    return this.repo.createAssessment({
      curriculumId: input.curriculumId,
      assessmentType: input.assessmentType,
      subjectTopic: input.subjectTopic,
      maxScore: input.maxScore,
      academicPeriod: input.academicPeriod,
      examDate: input.examDate,
    });
  }
}
