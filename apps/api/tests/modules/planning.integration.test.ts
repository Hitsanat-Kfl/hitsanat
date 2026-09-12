import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateAnnualPlanUseCase } from "../../src/modules/planning/application/use-cases/create-annual-plan.use-case.js";
import { CreateWeeklyPlanUseCase } from "../../src/modules/planning/application/use-cases/create-weekly-plan.use-case.js";
import { DistributePlanUseCase } from "../../src/modules/planning/application/use-cases/distribute-plan.use-case.js";
import { GetAnnualPlanUseCase } from "../../src/modules/planning/application/use-cases/get-annual-plan.use-case.js";
import { GetDistributionStatusUseCase } from "../../src/modules/planning/application/use-cases/get-distribution-status.use-case.js";
import { GetProgressSummaryUseCase } from "../../src/modules/planning/application/use-cases/get-progress-summary.use-case.js";
import { ListAnnualPlansUseCase } from "../../src/modules/planning/application/use-cases/list-annual-plans.use-case.js";
import { SubmitProgressUseCase } from "../../src/modules/planning/application/use-cases/submit-progress.use-case.js";
import { UpdateAnnualPlanUseCase } from "../../src/modules/planning/application/use-cases/update-annual-plan.use-case.js";
import type { PlanningRepository } from "../../src/modules/planning/domain/repositories/planning.repository.js";

const mockPlan = {
  id: "plan-001",
  academicYear: "2026-2027",
  title: "Annual Master Plan 2026",
  totalBudget: 3500,
  totalPeople: 112,
  totalTime: 45,
  status: "Draft" as const,
  createdBy: "admin-001",
  createdAt: new Date("2026-09-01"),
};

const mockGoal = {
  id: "goal-001",
  annualPlanId: "plan-001",
  goalNumber: 1,
  title: "Spiritual Growth",
  createdAt: new Date("2026-09-01"),
};

const mockActivity = {
  id: "activity-001",
  planGoalId: "goal-001",
  activityNumber: 1,
  mainActivity: "Bible Study Sessions",
  expectedResult: "Weekly sessions held",
  annualTarget: 48,
  budget: 500,
  humanResource: 15,
  plannedTime: 8,
  weight: 14.29,
  q1Target: 12,
  q2Target: 12,
  q3Target: 12,
  q4Target: 12,
  createdAt: new Date("2026-09-01"),
};

const mockActivity2 = {
  ...mockActivity,
  id: "activity-002",
  activityNumber: 2,
  mainActivity: "Prayer Meetings",
  budget: 300,
  humanResource: 20,
  plannedTime: 6,
  weight: 10.71,
  q1Target: 12,
  q2Target: 12,
  q3Target: 12,
  q4Target: 12,
};

const mockDistribution = {
  id: "dist-001",
  planActivityId: "activity-001",
  subDepartmentId: "KUTITR",
  status: "Assigned" as const,
  assignedAt: new Date("2026-09-15"),
  createdAt: new Date("2026-09-15"),
};

const mockDistribution2 = {
  ...mockDistribution,
  id: "dist-002",
  subDepartmentId: "TIMIHRT",
};

const mockWeeklyPlan = {
  id: "wp-001",
  planDistributionId: "dist-001",
  ethiopianMonth: "Meskerem",
  weekNumber: 1,
  sessionDate: new Date("2026-09-13"),
  taskDescription: "Review chapter 1 of the guide",
  createdAt: new Date("2026-09-13"),
};

const mockProgress = {
  id: "progress-001",
  weeklyPlanId: "wp-001",
  actualResultNumeric: 85,
  actualResultText: "85% attendance achieved",
  status: "Completed" as const,
  challenges: "Low turnout due to holiday",
  submittedBy: "leader-001",
  createdAt: new Date("2026-09-20"),
};

function createMockPlanningRepo(): PlanningRepository {
  return {
    findPlanById: vi.fn(),
    findManyPlans: vi.fn(),
    createPlan: vi.fn(),
    updatePlan: vi.fn(),
    deletePlan: vi.fn(),
    createGoal: vi.fn(),
    findGoalsByPlanId: vi.fn(),
    createActivity: vi.fn(),
    findActivitiesByGoalId: vi.fn(),
    findActivityById: vi.fn(),
    updateActivity: vi.fn(),
    createDistribution: vi.fn(),
    findDistributionsByActivityId: vi.fn(),
    findDistributionsBySubDepartment: vi.fn(),
    updateDistributionStatus: vi.fn(),
    createWeeklyPlan: vi.fn(),
    findWeeklyPlansByDistributionId: vi.fn(),
    createProgressRecord: vi.fn(),
    findProgressRecordsByWeeklyPlanId: vi.fn(),
    findDistributionsByPlanId: vi.fn(),
    findProgressByPlanId: vi.fn(),
  };
}

describe("Planning Integration Tests", () => {
  let repo: PlanningRepository;

  beforeEach(() => {
    repo = createMockPlanningRepo();
  });

  describe("Full Planning Lifecycle", () => {
    it("should create plan → distribute → weekly plan → submit progress", async () => {
      // Step 1: Create Annual Plan (BR-030 weight calculation)
      const createPlan = new CreateAnnualPlanUseCase(repo);

      vi.mocked(repo.createPlan).mockResolvedValue(mockPlan);
      vi.mocked(repo.createGoal).mockResolvedValue(mockGoal);
      vi.mocked(repo.createActivity)
        .mockResolvedValueOnce(mockActivity)
        .mockResolvedValueOnce(mockActivity2);

      const planResult = await createPlan.execute({
        academicYear: "2026-2027",
        title: "Annual Master Plan 2026",
        createdBy: "admin-001",
        goals: [
          {
            goalNumber: 1,
            title: "Spiritual Growth",
            activities: [
              {
                activityNumber: 1,
                mainActivity: "Bible Study Sessions",
                expectedResult: "Weekly sessions held",
                annualTarget: 48,
                budget: 500,
                humanResource: 15,
                plannedTime: 8,
                q1Target: 12,
                q2Target: 12,
                q3Target: 12,
                q4Target: 12,
              },
              {
                activityNumber: 2,
                mainActivity: "Prayer Meetings",
                annualTarget: 48,
                budget: 300,
                humanResource: 20,
                plannedTime: 6,
                q1Target: 12,
                q2Target: 12,
                q3Target: 12,
                q4Target: 12,
              },
            ],
          },
        ],
      });

      expect(planResult.plan).toBeDefined();
      expect(planResult.goals).toHaveLength(1);
      expect(repo.createPlan).toHaveBeenCalledOnce();
      expect(repo.createGoal).toHaveBeenCalledOnce();
      expect(repo.createActivity).toHaveBeenCalledTimes(2);

      // Step 2: Distribute to sub-department
      const distribute = new DistributePlanUseCase(repo);

      vi.mocked(repo.findActivityById).mockResolvedValue(mockActivity);
      vi.mocked(repo.createDistribution)
        .mockResolvedValueOnce(mockDistribution)
        .mockResolvedValueOnce(mockDistribution2);

      const distResult = await distribute.execute({
        activityId: "activity-001",
        subDepartmentIds: ["KUTITR", "TIMIHRT"],
      });

      expect(distResult).toHaveLength(2);
      expect(repo.createDistribution).toHaveBeenCalledTimes(2);

      // Step 3: Create Weekly Plan
      const createWeekly = new CreateWeeklyPlanUseCase(repo);

      vi.mocked(repo.createWeeklyPlan).mockResolvedValue(mockWeeklyPlan);

      const weeklyResult = await createWeekly.execute({
        distributionId: "dist-001",
        ethiopianMonth: "Meskerem",
        weekNumber: 1,
        sessionDate: new Date("2026-09-13"),
        taskDescription: "Review chapter 1 of the guide",
      });

      expect(weeklyResult).toBeDefined();
      expect(repo.createWeeklyPlan).toHaveBeenCalledOnce();

      // Step 4: Submit Progress
      const submitProgress = new SubmitProgressUseCase(repo);

      vi.mocked(repo.createProgressRecord).mockResolvedValue(mockProgress);

      const progressResult = await submitProgress.execute({
        weeklyPlanId: "wp-001",
        actualResultNumeric: 85,
        actualResultText: "85% attendance achieved",
        status: "Completed",
        challenges: "Low turnout due to holiday",
        submittedBy: "leader-001",
      });

      expect(progressResult).toBeDefined();
      expect(progressResult.actualResultNumeric).toBe(85);
      expect(repo.createProgressRecord).toHaveBeenCalledOnce();
    });
  });

  describe("BR-030 Weight Calculation", () => {
    it("should create plan with calculated weights", async () => {
      const createPlan = new CreateAnnualPlanUseCase(repo);

      vi.mocked(repo.createPlan).mockResolvedValue(mockPlan);
      vi.mocked(repo.createGoal).mockResolvedValue(mockGoal);
      vi.mocked(repo.createActivity)
        .mockResolvedValueOnce(mockActivity)
        .mockResolvedValueOnce(mockActivity2);

      const result = await createPlan.execute({
        academicYear: "2026-2027",
        title: "Test Plan",
        createdBy: "admin-001",
        goals: [
          {
            goalNumber: 1,
            title: "Goal 1",
            activities: [
              {
                activityNumber: 1,
                mainActivity: "Activity A",
                annualTarget: 48,
                budget: 500,
                humanResource: 15,
                plannedTime: 8,
                q1Target: 12,
                q2Target: 12,
                q3Target: 12,
                q4Target: 12,
              },
              {
                activityNumber: 2,
                mainActivity: "Activity B",
                annualTarget: 48,
                budget: 300,
                humanResource: 20,
                plannedTime: 6,
                q1Target: 12,
                q2Target: 12,
                q3Target: 12,
                q4Target: 12,
              },
            ],
          },
        ],
      });

      // Verify createPlan was called with calculated totals
      expect(repo.createPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          totalBudget: expect.any(Number),
          totalPeople: expect.any(Number),
          totalTime: expect.any(Number),
        })
      );

      // Verify activities were created with weights
      expect(repo.createActivity).toHaveBeenCalledTimes(2);
    });

    it("should calculate weight as 1/3 * (budget% + people% + time%)", async () => {
      const createPlan = new CreateAnnualPlanUseCase(repo);

      vi.mocked(repo.createPlan).mockResolvedValue(mockPlan);
      vi.mocked(repo.createGoal).mockResolvedValue(mockGoal);
      vi.mocked(repo.createActivity).mockResolvedValue(mockActivity);

      await createPlan.execute({
        academicYear: "2026-2027",
        title: "Test Plan",
        createdBy: "admin-001",
        goals: [
          {
            goalNumber: 1,
            title: "Goal 1",
            activities: [
              {
                activityNumber: 1,
                mainActivity: "Activity A",
                annualTarget: 48,
                budget: 1000,
                humanResource: 30,
                plannedTime: 10,
                q1Target: 12,
                q2Target: 12,
                q3Target: 12,
                q4Target: 12,
              },
            ],
          },
        ],
      });

      // Single activity should have weight = 100% (1/3 * (100% + 100% + 100%))
      expect(repo.createActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          weight: 100,
        })
      );
    });
  });

  describe("BR-031 Distribution Constraint", () => {
    it("should distribute activity to multiple sub-departments", async () => {
      const distribute = new DistributePlanUseCase(repo);

      vi.mocked(repo.findActivityById).mockResolvedValue(mockActivity);
      vi.mocked(repo.createDistribution)
        .mockResolvedValueOnce(mockDistribution)
        .mockResolvedValueOnce(mockDistribution2);

      const result = await distribute.execute({
        activityId: "activity-001",
        subDepartmentIds: ["KUTITR", "TIMIHRT"],
      });

      expect(result).toHaveLength(2);
      expect(result[0].subDepartmentId).toBe("KUTITR");
      expect(result[1].subDepartmentId).toBe("TIMIHRT");
    });

    it("should reject distribution to non-existent activity", async () => {
      const distribute = new DistributePlanUseCase(repo);

      vi.mocked(repo.findActivityById).mockResolvedValue(null);

      await expect(
        distribute.execute({
          activityId: "non-existent",
          subDepartmentIds: ["KUTITR"],
        })
      ).rejects.toThrow("Plan activity not found: non-existent");
    });

    it("should allow distributing to same sub-department from different activities", async () => {
      const distribute = new DistributePlanUseCase(repo);

      vi.mocked(repo.findActivityById).mockResolvedValue(mockActivity);
      vi.mocked(repo.createDistribution).mockResolvedValue(mockDistribution);

      const result1 = await distribute.execute({
        activityId: "activity-001",
        subDepartmentIds: ["KUTITR"],
      });

      vi.mocked(repo.findActivityById).mockResolvedValue(mockActivity2);
      vi.mocked(repo.createDistribution).mockResolvedValue(mockDistribution2);

      const result2 = await distribute.execute({
        activityId: "activity-002",
        subDepartmentIds: ["KUTITR"],
      });

      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
    });
  });

  describe("BR-032 Progress Roll-Up Aggregation", () => {
    it("should retrieve progress summary by plan", async () => {
      const getProgressSummary = new GetProgressSummaryUseCase(repo);

      vi.mocked(repo.findProgressByPlanId).mockResolvedValue([
        {
          goalNumber: 1,
          goalTitle: "Spiritual Growth",
          activityId: "activity-001",
          mainActivity: "Bible Study Sessions",
          weight: 14.29,
          progressCount: 3,
          totalNumeric: 255,
          latestStatus: "Completed",
        },
      ]);

      const result = await getProgressSummary.execute("plan-001");

      expect(result).toHaveLength(1);
      expect(result[0].goalNumber).toBe(1);
      expect(result[0].progressCount).toBe(3);
      expect(result[0].totalNumeric).toBe(255);
      expect(repo.findProgressByPlanId).toHaveBeenCalledWith("plan-001");
    });

    it("should retrieve distribution status by plan", async () => {
      const getDistStatus = new GetDistributionStatusUseCase(repo);

      vi.mocked(repo.findDistributionsByPlanId).mockResolvedValue([
        {
          ...mockDistribution,
          activityMainActivity: "Bible Study Sessions",
          subDepartmentName: "KUTITR",
        },
        {
          ...mockDistribution2,
          activityMainActivity: "Bible Study Sessions",
          subDepartmentName: "TIMIHRT",
        },
      ]);

      const result = await getDistStatus.execute("plan-001");

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe("Assigned");
      expect(result[1].status).toBe("Assigned");
      expect(repo.findDistributionsByPlanId).toHaveBeenCalledWith("plan-001");
    });
  });

  describe("Plan CRUD", () => {
    it("should list plans with pagination", async () => {
      const listPlans = new ListAnnualPlansUseCase(repo);

      vi.mocked(repo.findManyPlans).mockResolvedValue({
        success: true,
        data: [mockPlan],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await listPlans.execute({ page: 1, limit: 20 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it("should get plan by ID with goals and activities", async () => {
      const getPlan = new GetAnnualPlanUseCase(repo);

      vi.mocked(repo.findPlanById).mockResolvedValue({
        ...mockPlan,
        goals: [
          {
            ...mockGoal,
            activities: [mockActivity, mockActivity2],
          },
        ],
      });

      const result = await getPlan.execute("plan-001");

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].activities).toHaveLength(2);
    });

    it("should throw for non-existent plan", async () => {
      const getPlan = new GetAnnualPlanUseCase(repo);

      vi.mocked(repo.findPlanById).mockResolvedValue(null);

      await expect(getPlan.execute("non-existent")).rejects.toThrow(
        "Annual plan not found: non-existent"
      );
    });

    it("should update plan status", async () => {
      const updatePlan = new UpdateAnnualPlanUseCase(repo);

      vi.mocked(repo.findPlanById).mockResolvedValue({
        ...mockPlan,
        goals: [],
      });
      vi.mocked(repo.updatePlan).mockResolvedValue({
        ...mockPlan,
        status: "Active",
      });

      const result = await updatePlan.execute("plan-001", { status: "Active" });

      expect(result.status).toBe("Active");
      expect(repo.updatePlan).toHaveBeenCalledWith("plan-001", { status: "Active" });
    });
  });
});
