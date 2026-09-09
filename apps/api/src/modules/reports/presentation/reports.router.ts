import { Router } from "express";
import { generateReport, listReports, getReport } from "./reports.controller.js";

export const reportsRouter: Router = Router();

// Report Generation & Retrieval (CORE-039)
reportsRouter.post("/generate", generateReport);
reportsRouter.get("/", listReports);
reportsRouter.get("/:id", getReport);

// TODO RPT-003 (Backend Support - Israel): Sub-Department Submission API
// POST /api/v1/reports/submissions - Sub-departments submit periodic data
// GET /api/v1/reports/submissions - List submissions
// PUT /api/v1/reports/submissions/:id/review - Ekd reviews submission

// TODO RPT-007 (Backend Support - Israel): Integration Tests
// Test report generation, submission, retrieval workflows
// Test RBAC enforcement on all endpoints
// Test aggregation accuracy

// TODO RPT-008 (Backend Support - Israel): OpenAPI Reporting Documentation
// Document all reporting endpoints
// Define report schema
// Document error responses

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
