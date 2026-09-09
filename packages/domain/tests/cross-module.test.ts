import { describe, it, expect } from "vitest";
import {
  WeightCalculationEngine,
  ProgressRollUpEngine,
  ReportAggregationEngine,
} from "../src/engines/index.js";

describe("Cross-Module Integration: Planning → Reports Flow", () => {
  const weightEngine = new WeightCalculationEngine();
  const progressEngine = new ProgressRollUpEngine();
  const reportEngine = new ReportAggregationEngine();

  it("should calculate weights, progress, and aggregate into report metrics", () => {
    // Step 1: Calculate activity weights (CORE-028)
    const weightResult = weightEngine.calculateWeight(
      {
        annualTarget: 100,
        budget: 500,
        humanResource: 10,
        plannedTime: 5,
        q1Target: 25,
        q2Target: 25,
        q3Target: 25,
        q4Target: 25,
      },
      { budget: 3500, people: 112, time: 45 }
    );

    expect(weightResult.weight).toBeGreaterThan(0);

    // Step 2: Calculate activity progress (CORE-029)
    const activity = {
      id: "activity-1",
      planId: "plan-1",
      goalId: "goal-1",
      activityName: "Test Activity",
      annualTarget: 100,
      q1Target: 25,
      q2Target: 25,
      q3Target: 25,
      q4Target: 25,
      weight: weightResult.weight,
    };

    const progressResult = progressEngine.calculateActivityProgress({
      activity,
      distributions: [],
      weeklyPlans: [],
      progressRecords: [
        { id: "1", activityId: "activity-1", status: "Completed", weeklyPlanId: "w1" },
        { id: "2", activityId: "activity-1", status: "Completed", weeklyPlanId: "w2" },
        { id: "3", activityId: "activity-1", status: "In_Progress", weeklyPlanId: "w3" },
      ],
    });

    expect(progressResult.completedTasks).toBe(2);
    expect(progressResult.inProgressTasks).toBe(1);
    expect(progressResult.progressPercentage).toBeGreaterThan(0);

    // Step 3: Aggregate into report metrics (CORE-038)
    const reportMetrics = reportEngine.aggregateMetrics({
      reportType: "Monthly",
      planningData: {
        totalActivities: 1,
        completedActivities: progressResult.completedTasks,
        overallProgress: progressResult.progressPercentage,
        weightedScore: weightResult.weight,
      },
      attendanceData: {
        totalSessions: 4,
        totalPresent: 80,
        totalAbsent: 15,
        totalExcused: 5,
      },
    });

    expect(reportMetrics.planning).toBeDefined();
    expect(reportMetrics.attendance).toBeDefined();
    expect(reportMetrics.planning?.overallProgress).toBe(progressResult.progressPercentage);
    expect(reportMetrics.attendance?.totalSessions).toBe(4);
  });
});

describe("Cross-Module Integration: Attendance → Reports Flow", () => {
  const reportEngine = new ReportAggregationEngine();

  it("should aggregate attendance data into report metrics", () => {
    const metrics = reportEngine.aggregateMetrics({
      reportType: "Weekly",
      attendanceData: {
        totalSessions: 2,
        totalPresent: 150,
        totalAbsent: 30,
        totalExcused: 20,
      },
    });

    expect(metrics.attendance).toBeDefined();
    expect(metrics.attendance?.totalSessions).toBe(2);
    expect(metrics.attendance?.averageAttendanceRate).toBe(75); // 150/200 * 100
    expect(metrics.attendance?.totalPresent).toBe(150);
  });

  it("should handle zero attendance gracefully", () => {
    const metrics = reportEngine.aggregateMetrics({
      reportType: "Monthly",
      attendanceData: {
        totalSessions: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalExcused: 0,
      },
    });

    expect(metrics.attendance?.averageAttendanceRate).toBe(0);
  });
});

describe("Cross-Module Integration: Academic → Reports Flow", () => {
  const reportEngine = new ReportAggregationEngine();

  it("should aggregate academic scores into report metrics", () => {
    const metrics = reportEngine.aggregateMetrics({
      reportType: "Quarterly",
      academicData: {
        totalAssessments: 3,
        scores: [85, 90, 78],
      },
    });

    expect(metrics.academic).toBeDefined();
    expect(metrics.academic?.totalAssessments).toBe(3);
    expect(metrics.academic?.averageScore).toBe(84.33);
    expect(metrics.academic?.highestScore).toBe(90);
    expect(metrics.academic?.lowestScore).toBe(78);
  });
});

describe("Cross-Module Integration: Performance Metrics", () => {
  const reportEngine = new ReportAggregationEngine();

  it("should calculate performance metrics with budget variance", () => {
    const performance = reportEngine.calculatePerformanceMetrics(
      100, // planned target
      85, // actual achievement
      10000, // budget planned
      11000 // budget actual
    );

    expect(performance.completionPercentage).toBe(85);
    expect(performance.budgetVariance).toBe(10); // (11000-10000)/10000 * 100
  });

  it("should handle zero planned target", () => {
    const performance = reportEngine.calculatePerformanceMetrics(0, 50);

    expect(performance.completionPercentage).toBe(0);
  });
});
