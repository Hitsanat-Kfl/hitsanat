import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetProgressSummaryUseCase } from "../../src/modules/planning/application/use-cases/get-progress-summary.use-case.js";
import { ListAnnualPlansUseCase } from "../../src/modules/planning/application/use-cases/list-annual-plans.use-case.js";
import type { PlanningRepository } from "../../src/modules/planning/domain/repositories/planning.repository.js";

function createMockPlanningRepo(): PlanningRepository {
  return {
    findPlanById: vi.fn(),
    findManyPlans: vi.fn(),
    createPlan: vi.fn(),
    updatePlan: vi.fn(),
    deletePlan: vi.fn(),
    findWeeklyPlansByPlanId: vi.fn(),
    createWeeklyPlan: vi.fn(),
    updateWeeklyPlan: vi.fn(),
    findProgressByPlanId: vi.fn(),
    createProgress: vi.fn(),
    updateProgress: vi.fn(),
    findDistributionStatus: vi.fn(),
  };
}

describe("Planning Performance Tests", () => {
  let repo: PlanningRepository;

  beforeEach(() => {
    repo = createMockPlanningRepo();
    vi.mocked(repo.findManyPlans).mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
    vi.mocked(repo.findProgressByPlanId).mockResolvedValue([]);
  });

  it("list annual plans should respond within 200ms", async () => {
    const useCase = new ListAnnualPlansUseCase(repo);
    const start = performance.now();
    await useCase.execute({ page: 1, limit: 20 });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("progress summary should respond within 200ms", async () => {
    const useCase = new GetProgressSummaryUseCase(repo);
    const start = performance.now();
    await useCase.execute("plan-001");
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("progress summary with large dataset should respond within 1s", async () => {
    const largeProgress = Array.from({ length: 200 }, (_, i) => ({
      goalNumber: (i % 10) + 1,
      goalTitle: `Goal ${(i % 10) + 1}`,
      activityId: `act-${i}`,
      mainActivity: `Activity ${i}`,
      weight: 5,
      progressCount: i,
      totalNumeric: 100,
      latestStatus: "On Track",
    }));
    vi.mocked(repo.findProgressByPlanId).mockResolvedValue(largeProgress);

    const useCase = new GetProgressSummaryUseCase(repo);
    const start = performance.now();
    const result = await useCase.execute("plan-001");
    const elapsed = performance.now() - start;

    expect(result).toHaveLength(200);
    expect(elapsed).toBeLessThan(1000);
  });

  it("list plans with large dataset should respond within 500ms", async () => {
    const largePlans = Array.from({ length: 50 }, (_, i) => ({
      id: `plan-${i}`,
      title: `Annual Plan ${i}`,
      year: 2026,
      subDepartmentId: `dept-${i}`,
      status: "Active",
      createdAt: new Date(),
    }));
    vi.mocked(repo.findManyPlans).mockResolvedValue({
      success: true,
      data: largePlans,
      pagination: { page: 1, limit: 50, total: 50, totalPages: 1 },
    });

    const useCase = new ListAnnualPlansUseCase(repo);
    const start = performance.now();
    const result = await useCase.execute({ page: 1, limit: 50 });
    const elapsed = performance.now() - start;

    expect(result.data).toHaveLength(50);
    expect(elapsed).toBeLessThan(500);
  });
});
