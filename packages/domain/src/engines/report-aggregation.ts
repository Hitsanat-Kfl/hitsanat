import type { ReportMetrics, ReportType } from "../entities/reports.js";

export interface AttendanceData {
  totalSessions: number;
  totalPresent: number;
  totalAbsent: number;
  totalExcused: number;
}

export interface PlanningData {
  totalActivities: number;
  completedActivities: number;
  overallProgress: number;
  weightedScore: number;
}

export interface AcademicData {
  totalAssessments: number;
  scores: number[];
}

export interface AggregationInput {
  reportType: ReportType;
  attendanceData?: AttendanceData;
  planningData?: PlanningData;
  academicData?: AcademicData;
  budgetPlanned?: number;
  budgetActual?: number;
}

export interface IReportAggregationEngine {
  aggregateMetrics(input: AggregationInput): ReportMetrics;
  calculatePerformanceMetrics(
    plannedTarget: number,
    actualAchievement: number,
    budgetPlanned?: number,
    budgetActual?: number
  ): ReportMetrics["performance"];
}

/**
 * Report Aggregation Engine (FR-10.1, FR-10.3)
 *
 * Consolidates data from attendance, academic, and planning modules
 * into periodic reports (Weekly, Monthly, Quarterly, Half-Year, Annual).
 *
 * Performance Metrics:
 * - Planned Target vs Actual Achievement
 * - Completion Percentage = min(100, (Actual / Target) * 100)
 * - Budget Variance = ((Actual - Planned) / Planned) * 100
 */
export class ReportAggregationEngine implements IReportAggregationEngine {
  aggregateMetrics(input: AggregationInput): ReportMetrics {
    const metrics: ReportMetrics = {};

    if (input.planningData) {
      metrics.planning = {
        totalActivities: input.planningData.totalActivities,
        completedActivities: input.planningData.completedActivities,
        overallProgress: Math.round(input.planningData.overallProgress * 100) / 100,
        weightedScore: Math.round(input.planningData.weightedScore * 100) / 100,
      };
    }

    if (input.attendanceData) {
      const { totalSessions, totalPresent, totalAbsent, totalExcused } = input.attendanceData;
      const totalResponses = totalPresent + totalAbsent + totalExcused;
      const averageAttendanceRate = totalResponses > 0 ? (totalPresent / totalResponses) * 100 : 0;

      metrics.attendance = {
        totalSessions,
        averageAttendanceRate: Math.round(averageAttendanceRate * 100) / 100,
        totalPresent,
        totalAbsent,
        totalExcused,
      };
    }

    if (input.academicData && input.academicData.scores.length > 0) {
      const { scores, totalAssessments } = input.academicData;
      const totalScore = scores.reduce((sum, s) => sum + s, 0);
      const averageScore = totalScore / scores.length;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);

      metrics.academic = {
        totalAssessments,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore: Math.round(highestScore * 100) / 100,
        lowestScore: Math.round(lowestScore * 100) / 100,
      };
    }

    if (input.budgetPlanned !== undefined && input.budgetActual !== undefined) {
      const plannedTarget = input.planningData?.overallProgress ?? 0;
      const actualAchievement = input.planningData?.completedActivities ?? 0;
      metrics.performance = this.calculatePerformanceMetrics(
        plannedTarget,
        actualAchievement,
        input.budgetPlanned,
        input.budgetActual
      );
    }

    return metrics;
  }

  calculatePerformanceMetrics(
    plannedTarget: number,
    actualAchievement: number,
    budgetPlanned?: number,
    budgetActual?: number
  ): ReportMetrics["performance"] {
    const completionPercentage =
      plannedTarget > 0 ? Math.min(100, (actualAchievement / plannedTarget) * 100) : 0;

    let budgetVariance = 0;
    if (budgetPlanned !== undefined && budgetActual !== undefined && budgetPlanned > 0) {
      budgetVariance = ((budgetActual - budgetPlanned) / budgetPlanned) * 100;
    }

    return {
      plannedTarget,
      actualAchievement,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
      budgetVariance: Math.round(budgetVariance * 100) / 100,
    };
  }
}
