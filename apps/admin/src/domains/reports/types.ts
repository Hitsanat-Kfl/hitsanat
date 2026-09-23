export type ReportType = "Weekly" | "Monthly" | "Quarterly" | "Half_Year" | "Annual";
export type ReportStatus = "Draft" | "Submitted" | "Reviewed" | "Approved";
export type SubmissionStatus = "Submitted" | "Under_Review" | "Accepted" | "Returned";

export interface PeriodicReport {
  id: string;
  reportType: ReportType;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  subDepartmentId: string | null;
  generatedBy: string;
  status: ReportStatus;
  metrics: Record<string, unknown> | null;
  challenges: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ReportSubmission {
  id: string;
  reportType: ReportType;
  periodLabel: string;
  subDepartmentId: string;
  submittedBy: string;
  status: SubmissionStatus;
  metrics: Record<string, unknown> | null;
  challenges: string | null;
  notes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}
