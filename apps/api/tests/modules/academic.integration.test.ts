import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateAssessmentUseCase } from "../../src/modules/academic/application/use-cases/create-assessment.use-case.js";
import { ListAssessmentsUseCase } from "../../src/modules/academic/application/use-cases/list-assessments.use-case.js";
import { ListScoresUseCase } from "../../src/modules/academic/application/use-cases/list-scores.use-case.js";
import { RecordScoreUseCase } from "../../src/modules/academic/application/use-cases/record-score.use-case.js";
import type { AcademicRepository } from "../../src/modules/academic/domain/repositories/academic.repository.js";

const mockAssessment = {
  id: "assessment-001",
  curriculumId: "curriculum-001",
  assessmentType: "Mid_Exam" as const,
  subjectTopic: "Bible Knowledge",
  maxScore: 100,
  academicPeriod: "Semester 1",
  examDate: new Date("2026-10-15"),
  createdAt: new Date("2026-09-01"),
};

const mockScore = {
  id: "score-001",
  academicAssessmentId: "assessment-001",
  childId: "child-001",
  scoreAchieved: 85,
  recordedBy: "teacher-001",
  createdAt: new Date("2026-10-15"),
};

function createMockAcademicRepo(): AcademicRepository {
  return {
    findAssessmentById: vi.fn(),
    findManyAssessments: vi.fn(),
    createAssessment: vi.fn(),
    findScoreById: vi.fn(),
    findScoresByAssessmentId: vi.fn(),
    findScoresByChildId: vi.fn(),
    createScore: vi.fn(),
    updateScore: vi.fn(),
  };
}

describe("Academic Assessment Integration Tests", () => {
  let repo: AcademicRepository;

  beforeEach(() => {
    repo = createMockAcademicRepo();
  });

  describe("Assessment Creation (FR-07.1)", () => {
    it("should create an assessment with valid data", async () => {
      const useCase = new CreateAssessmentUseCase(repo);

      vi.mocked(repo.createAssessment).mockResolvedValue(mockAssessment);

      const result = await useCase.execute({
        curriculumId: "curriculum-001",
        assessmentType: "Mid_Exam",
        subjectTopic: "Bible Knowledge",
        maxScore: 100,
        academicPeriod: "Semester 1",
        examDate: new Date("2026-10-15"),
      });

      expect(result).toBeDefined();
      expect(result.subjectTopic).toBe("Bible Knowledge");
      expect(result.maxScore).toBe(100);
      expect(repo.createAssessment).toHaveBeenCalledOnce();
    });

    it("should list assessments with pagination", async () => {
      const useCase = new ListAssessmentsUseCase(repo);

      vi.mocked(repo.findManyAssessments).mockResolvedValue({
        success: true,
        data: [mockAssessment],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await useCase.execute({ page: 1, limit: 20 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it("should filter assessments by subject topic", async () => {
      const useCase = new ListAssessmentsUseCase(repo);

      vi.mocked(repo.findManyAssessments).mockResolvedValue({
        success: true,
        data: [mockAssessment],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await useCase.execute({ subjectTopic: "Bible" });

      expect(result.data).toHaveLength(1);
      expect(repo.findManyAssessments).toHaveBeenCalledWith({ subjectTopic: "Bible" });
    });
  });

  describe("Score Recording (FR-07.2)", () => {
    it("should record a score for a valid assessment", async () => {
      const useCase = new RecordScoreUseCase(repo);

      vi.mocked(repo.findAssessmentById).mockResolvedValue(mockAssessment);
      vi.mocked(repo.createScore).mockResolvedValue(mockScore);

      const result = await useCase.execute({
        academicAssessmentId: "assessment-001",
        childId: "child-001",
        scoreAchieved: 85,
        recordedBy: "teacher-001",
      });

      expect(result).toBeDefined();
      expect(result.scoreAchieved).toBe(85);
      expect(repo.createScore).toHaveBeenCalledOnce();
    });

    it("should reject score exceeding max score", async () => {
      const useCase = new RecordScoreUseCase(repo);

      vi.mocked(repo.findAssessmentById).mockResolvedValue(mockAssessment);

      await expect(
        useCase.execute({
          academicAssessmentId: "assessment-001",
          childId: "child-001",
          scoreAchieved: 150,
          recordedBy: "teacher-001",
        })
      ).rejects.toThrow("Score 150 is outside valid range (0-100)");
    });

    it("should reject score for non-existent assessment", async () => {
      const useCase = new RecordScoreUseCase(repo);

      vi.mocked(repo.findAssessmentById).mockResolvedValue(null);

      await expect(
        useCase.execute({
          academicAssessmentId: "non-existent",
          childId: "child-001",
          scoreAchieved: 85,
          recordedBy: "teacher-001",
        })
      ).rejects.toThrow("Academic assessment not found: non-existent");
    });

    it("should list scores by assessment", async () => {
      const useCase = new ListScoresUseCase(repo);

      vi.mocked(repo.findScoresByAssessmentId).mockResolvedValue([mockScore]);

      const result = await useCase.executeByAssessment("assessment-001");

      expect(result).toHaveLength(1);
      expect(result[0].scoreAchieved).toBe(85);
    });

    it("should list scores by child", async () => {
      const useCase = new ListScoresUseCase(repo);

      vi.mocked(repo.findScoresByChildId).mockResolvedValue([mockScore]);

      const result = await useCase.executeByChild("child-001");

      expect(result).toHaveLength(1);
      expect(result[0].childId).toBe("child-001");
    });
  });
});
