import { beforeEach, describe, expect, it, vi } from "vitest";
import { ListReportsUseCase } from "../../src/modules/reports/application/use-cases/list-reports.use-case.js";
import { ListSubmissionsUseCase } from "../../src/modules/reports/application/use-cases/list-submissions.use-case.js";
import type { ReportsRepository } from "../../src/modules/reports/domain/repositories/reports.repository.js";

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

describe("Reporting Performance Tests", () => {
  let repo: ReportsRepository;

  beforeEach(() => {
    repo = createMockReportsRepo();
    vi.mocked(repo.findManyReports).mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
    vi.mocked(repo.findManySubmissions).mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  });

  it("list reports should respond within 200ms", async () => {
    const useCase = new ListReportsUseCase(repo);
    const start = performance.now();
    await useCase.execute({ page: 1, limit: 20 });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("list submissions should respond within 200ms", async () => {
    const useCase = new ListSubmissionsUseCase(repo);
    const start = performance.now();
    await useCase.execute({ page: 1, limit: 20 });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("list reports should handle large datasets within 500ms", async () => {
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      id: `report-${i}`,
      reportType: "Monthly" as const,
      periodLabel: `Month ${i}`,
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-31"),
      subDepartmentId: `dept-${i}`,
      generatedBy: `user-${i}`,
      status: "Draft" as const,
      createdAt: new Date(),
    }));

    vi.mocked(repo.findManyReports).mockResolvedValue({
      success: true,
      data: largeDataset,
      pagination: { page: 1, limit: 100, total: 100, totalPages: 1 },
    });

    const useCase = new ListReportsUseCase(repo);
    const start = performance.now();
    const result = await useCase.execute({ page: 1, limit: 100 });
    const elapsed = performance.now() - start;

    expect(result.data).toHaveLength(100);
    expect(elapsed).toBeLessThan(500);
  });
});
