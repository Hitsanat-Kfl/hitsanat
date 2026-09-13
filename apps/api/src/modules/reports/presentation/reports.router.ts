import { Router } from "express";
import {
  generateReport,
  getReport,
  listReports,
  listSubmissions,
  reviewSubmission,
  submitReport,
} from "./reports.controller.js";

export const reportsRouter: Router = Router();

// Report Generation & Retrieval (CORE-039)
reportsRouter.post("/generate", generateReport);
reportsRouter.get("/", listReports);
reportsRouter.get("/:id", getReport);

// Sub-Department Submissions (BES-019)
reportsRouter.post("/submissions", submitReport);
reportsRouter.get("/submissions/list", listSubmissions);
reportsRouter.put("/submissions/:submissionId/review", reviewSubmission);

// TODO RPT-004 (Frontend 2): Executive Dashboard - Chairperson Overview
// Build Chairperson executive dashboard in apps/admin
// Overall progress summary, sub-department status cards
// Planning completion percentage, attendance summary
// Key KPI widgets, cross-departmental visibility

// TODO RPT-005 (Frontend 2): Sub-Department Dashboard
// Build sub-department scoped dashboards in apps/admin
// Scoped to user's sub-department (RBAC)
// Department-specific KPIs, progress tracking
// Attendance summary, academic scores for Timihrt leaders

// TODO RPT-006 (Frontend 2): Report Generation UI
// Build report generation and viewing interface in apps/admin
// Report period selector (Weekly/Monthly/Quarterly/Annual)
// Report generation trigger, report display with tables and charts
// Export capability (PDF or print), RBAC enforced
