import type { AcademicAssessment, StudentScore } from "@repo/domain";

export interface AcademicRepository {
  findAssessmentById(id: string): Promise<AcademicAssessment | null>;
  findManyAssessments(params: {
    page?: number;
    limit?: number;
    subjectTopic?: string;
    assessmentType?: string;
  }): Promise<{
    success: boolean;
    data: AcademicAssessment[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  createAssessment(
    data: Omit<AcademicAssessment, "id" | "createdAt" | "updatedAt">
  ): Promise<AcademicAssessment>;

  findScoreById(id: string): Promise<StudentScore | null>;
  findScoresByAssessmentId(assessmentId: string): Promise<StudentScore[]>;
  findScoresByChildId(childId: string): Promise<StudentScore[]>;
  createScore(data: Omit<StudentScore, "id" | "createdAt" | "updatedAt">): Promise<StudentScore>;
  updateScore(
    id: string,
    data: Partial<Omit<StudentScore, "id" | "createdAt" | "updatedAt">>
  ): Promise<StudentScore>;
}
