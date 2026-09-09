import type { PeriodicReport, ReportMetrics } from "@repo/domain";

export interface ReportsRepository {
  findReportById(id: string): Promise<PeriodicReport | null>;
  findManyReports(params: {
    page?: number;
    limit?: number;
    reportType?: string;
    subDepartmentId?: string;
  }): Promise<{
    success: boolean;
    data: PeriodicReport[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  createReport(data: {
    reportType: string;
    periodLabel: string;
    periodStart: Date;
    periodEnd: Date;
    subDepartmentId?: string;
    generatedBy: string;
    status: string;
    metrics?: ReportMetrics;
    challenges?: string;
    notes?: string;
  }): Promise<PeriodicReport>;
  updateReport(
    id: string,
    data: Partial<{
      status: string;
      metrics: ReportMetrics;
      challenges: string;
      notes: string;
    }>
  ): Promise<PeriodicReport>;
  deleteReport(id: string): Promise<void>;
}
