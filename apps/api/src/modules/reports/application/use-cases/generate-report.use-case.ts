import type { PeriodicReport, ReportType, ReportMetrics } from "@repo/domain";
import { ReportAggregationEngine } from "@repo/domain";
import type { ReportsRepository } from "../../domain/repositories/reports.repository.js";

interface GenerateReportInput {
  reportType: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  subDepartmentId?: string;
  generatedBy: string;
  attendanceData?: {
    totalSessions: number;
    totalPresent: number;
    totalAbsent: number;
    totalExcused: number;
  };
  planningData?: {
    totalActivities: number;
    completedActivities: number;
    overallProgress: number;
    weightedScore: number;
  };
  academicData?: {
    totalAssessments: number;
    scores: number[];
  };
  budgetPlanned?: number;
  budgetActual?: number;
  challenges?: string;
  notes?: string;
}

export class GenerateReportUseCase {
  private readonly aggregationEngine = new ReportAggregationEngine();

  constructor(private readonly repo: ReportsRepository) {}

  async execute(input: GenerateReportInput): Promise<PeriodicReport> {
    const validTypes = ["Weekly", "Monthly", "Quarterly", "Half_Year", "Annual"];
    if (!validTypes.includes(input.reportType)) {
      throw new Error(
        `Invalid report type: ${input.reportType}. Must be one of: ${validTypes.join(", ")}`
      );
    }

    const metrics = this.aggregationEngine.aggregateMetrics({
      reportType: input.reportType as ReportType,
      attendanceData: input.attendanceData,
      planningData: input.planningData,
      academicData: input.academicData,
      budgetPlanned: input.budgetPlanned,
      budgetActual: input.budgetActual,
    });

    return this.repo.createReport({
      reportType: input.reportType,
      periodLabel: input.periodLabel,
      periodStart: new Date(input.periodStart),
      periodEnd: new Date(input.periodEnd),
      subDepartmentId: input.subDepartmentId,
      generatedBy: input.generatedBy,
      status: "Draft",
      metrics,
      challenges: input.challenges,
      notes: input.notes,
    });
  }
}
