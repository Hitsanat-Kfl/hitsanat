import type { PeriodicReport, ReportMetrics, ReportSubmission } from "@repo/domain";

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

  // Sub-Department Submissions (BES-019)
  createSubmission(data: {
    reportType: string;
    periodLabel: string;
    subDepartmentId: string;
    submittedBy: string;
    metrics?: ReportMetrics;
    challenges?: string;
    notes?: string;
  }): Promise<ReportSubmission>;
  findSubmissionById(id: string): Promise<ReportSubmission | null>;
  findManySubmissions(params: {
    page?: number;
    limit?: number;
    subDepartmentId?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: ReportSubmission[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  reviewSubmission(
    id: string,
    data: { reviewedBy: string; status: string; reviewComments?: string }
  ): Promise<ReportSubmission>;
}
