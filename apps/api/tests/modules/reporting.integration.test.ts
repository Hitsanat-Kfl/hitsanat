import { beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateReportUseCase } from "../../src/modules/reports/application/use-cases/generate-report.use-case.js";
import { GetReportUseCase } from "../../src/modules/reports/application/use-cases/get-report.use-case.js";
import { ListReportsUseCase } from "../../src/modules/reports/application/use-cases/list-reports.use-case.js";
import { ListSubmissionsUseCase } from "../../src/modules/reports/application/use-cases/list-submissions.use-case.js";
import { ReviewSubmissionUseCase } from "../../src/modules/reports/application/use-cases/review-submission.use-case.js";
import { SubmitReportUseCase } from "../../src/modules/reports/application/use-cases/submit-report.use-case.js";
import type { ReportsRepository } from "../../src/modules/reports/domain/repositories/reports.repository.js";

const mockReport = {
  id: "report-001",
  reportType: "Monthly" as const,
  periodLabel: "September 2026",
  periodStart: new Date("2026-09-01"),
  periodEnd: new Date("2026-09-30"),
  subDepartmentId: "TIMIHRT",
  generatedBy: "leader-001",
  status: "Draft" as const,
  metrics: {
    attendance: {
      totalSessions: 4,
      averageAttendanceRate: 85,
      totalPresent: 34,
      totalAbsent: 4,
      totalExcused: 2,
    },
    planning: {
      totalActivities: 10,
      completedActivities: 7,
      overallProgress: 70,
      weightedScore: 6.5,
    },
  },
  challenges: "Low attendance in week 3",
  notes: "Good progress overall",
  createdAt: new Date("2026-09-30"),
};

const mockSubmission = {
  id: "sub-001",
  reportType: "Monthly" as const,
  periodLabel: "September 2026",
  subDepartmentId: "TIMIHRT",
  submittedBy: "leader-001",
  status: "Submitted" as const,
  metrics: {
    attendance: {
      totalSessions: 4,
      averageAttendanceRate: 85,
      totalPresent: 34,
      totalAbsent: 4,
      totalExcused: 2,
    },
  },
  challenges: "Low attendance",
  notes: null,
  reviewedBy: undefined,
  reviewedAt: undefined,
  createdAt: new Date("2026-09-30"),
};

function createMockReportsRepo(): ReportsRepository {
  return {
    findReportById: vi.fn(),
    findManyReports: vi.fn(),
    createReport: vi.fn(),
    updateReport: vi.fn(),
    deleteReport: vi.fn(),
    createSubmission: vi.fn(),
    findSubmissionById: vi.fn(),
    findManySubmissions: vi.fn(),
    reviewSubmission: vi.fn(),
  };
}

describe("Reporting Integration Tests", () => {
  let repo: ReportsRepository;

  beforeEach(() => {
    repo = createMockReportsRepo();
  });

  describe("Report Generation", () => {
    it("should generate a report with valid data", async () => {
      const useCase = new GenerateReportUseCase(repo);
      vi.mocked(repo.createReport).mockResolvedValue(mockReport);

      const result = await useCase.execute({
        reportType: "Monthly",
        periodLabel: "September 2026",
        periodStart: "2026-09-01",
        periodEnd: "2026-09-30",
        subDepartmentId: "TIMIHRT",
        generatedBy: "leader-001",
        attendanceData: { totalSessions: 4, totalPresent: 34, totalAbsent: 4, totalExcused: 2 },
        planningData: {
          totalActivities: 10,
          completedActivities: 7,
          overallProgress: 70,
          weightedScore: 6.5,
        },
      });

      expect(result).toBeDefined();
      expect(result.reportType).toBe("Monthly");
      expect(result.status).toBe("Draft");
      expect(repo.createReport).toHaveBeenCalledOnce();
    });

    it("should reject invalid report type", async () => {
      const useCase = new GenerateReportUseCase(repo);

      await expect(
        useCase.execute({
          reportType: "Invalid",
          periodLabel: "Test",
          periodStart: "2026-09-01",
          periodEnd: "2026-09-30",
          generatedBy: "leader-001",
        })
      ).rejects.toThrow("Invalid report type");
    });

    it("should list reports with pagination", async () => {
      const useCase = new ListReportsUseCase(repo);
      vi.mocked(repo.findManyReports).mockResolvedValue({
        success: true,
        data: [mockReport],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await useCase.execute({ page: 1, limit: 20 });
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it("should get report by ID", async () => {
      const useCase = new GetReportUseCase(repo);
      vi.mocked(repo.findReportById).mockResolvedValue(mockReport);

      const result = await useCase.execute("report-001");
      expect(result).toBeDefined();
      expect(result.id).toBe("report-001");
    });

    it("should throw for non-existent report", async () => {
      const useCase = new GetReportUseCase(repo);
      vi.mocked(repo.findReportById).mockResolvedValue(null);

      await expect(useCase.execute("non-existent")).rejects.toThrow("Report not found");
    });
  });

  describe("Sub-Department Submission", () => {
    it("should submit a report", async () => {
      const useCase = new SubmitReportUseCase(repo);
      vi.mocked(repo.createSubmission).mockResolvedValue(mockSubmission);

      const result = await useCase.execute({
        reportType: "Monthly",
        periodLabel: "September 2026",
        subDepartmentId: "TIMIHRT",
        submittedBy: "leader-001",
        metrics: {
          attendance: {
            totalSessions: 4,
            averageAttendanceRate: 85,
            totalPresent: 34,
            totalAbsent: 4,
            totalExcused: 2,
          },
        },
        challenges: "Low attendance",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("Submitted");
      expect(result.subDepartmentId).toBe("TIMIHRT");
      expect(repo.createSubmission).toHaveBeenCalledOnce();
    });

    it("should reject invalid report type for submission", async () => {
      const useCase = new SubmitReportUseCase(repo);

      await expect(
        useCase.execute({
          reportType: "Invalid",
          periodLabel: "Test",
          subDepartmentId: "TIMIHRT",
          submittedBy: "leader-001",
        })
      ).rejects.toThrow("Invalid report type");
    });

    it("should list submissions", async () => {
      const useCase = new ListSubmissionsUseCase(repo);
      vi.mocked(repo.findManySubmissions).mockResolvedValue({
        success: true,
        data: [mockSubmission],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await useCase.execute({ page: 1, limit: 20 });
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it("should filter submissions by sub-department", async () => {
      const useCase = new ListSubmissionsUseCase(repo);
      vi.mocked(repo.findManySubmissions).mockResolvedValue({
        success: true,
        data: [mockSubmission],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await useCase.execute({ subDepartmentId: "TIMIHRT" });
      expect(result.data).toHaveLength(1);
      expect(repo.findManySubmissions).toHaveBeenCalledWith({ subDepartmentId: "TIMIHRT" });
    });

    it("should review submission", async () => {
      const useCase = new ReviewSubmissionUseCase(repo);
      vi.mocked(repo.findSubmissionById).mockResolvedValue(mockSubmission);
      vi.mocked(repo.reviewSubmission).mockResolvedValue({
        ...mockSubmission,
        status: "Accepted",
        reviewedBy: "ekd-001",
        reviewedAt: new Date("2026-10-01"),
      });

      const result = await useCase.execute({
        id: "sub-001",
        reviewedBy: "ekd-001",
        status: "Accepted",
      });

      expect(result.status).toBe("Accepted");
      expect(result.reviewedBy).toBe("ekd-001");
    });

    it("should reject invalid review status", async () => {
      const useCase = new ReviewSubmissionUseCase(repo);
      vi.mocked(repo.findSubmissionById).mockResolvedValue(mockSubmission);

      await expect(
        useCase.execute({ id: "sub-001", reviewedBy: "ekd-001", status: "Invalid" })
      ).rejects.toThrow("Invalid review status");
    });

    it("should reject review for non-existent submission", async () => {
      const useCase = new ReviewSubmissionUseCase(repo);
      vi.mocked(repo.findSubmissionById).mockResolvedValue(null);

      await expect(
        useCase.execute({ id: "non-existent", reviewedBy: "ekd-001", status: "Accepted" })
      ).rejects.toThrow("Submission not found");
    });
  });
});
