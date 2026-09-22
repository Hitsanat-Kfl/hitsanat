import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import {
  approveReport,
  generateReport,
  getReport,
  listReports,
  listSubmissions,
  reviewSubmission,
  submitReport,
} from "./reports.controller.js";

export const reportsRouter: Router = Router();

// All report endpoints require a valid session.
reportsRouter.use(requireAuth());

// Report Generation & Retrieval (CORE-039)
// Read: all leadership roles. Generate: Ekd consolidates; executives may too.
reportsRouter.post(
  "/generate",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY", "EKD_LEADER"],
  }),
  generateReport
);
reportsRouter.get(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY", "EKD_LEADER"],
  }),
  listReports
);
reportsRouter.get(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY", "EKD_LEADER"],
  }),
  getReport
);

// Executive sign-off (ApprovePeriodicReportUseCase, endpoints.md §2.5).
// CHAIRPERSON or SUB_CHAIRPERSON only (ADR-0018 standing deputy authority).
reportsRouter.patch(
  "/:id/approve",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
  }),
  approveReport
);

// Sub-Department Submissions (BES-019)
reportsRouter.post(
  "/submissions",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY", "EKD_LEADER"],
  }),
  submitReport
);
reportsRouter.get(
  "/submissions/list",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY", "EKD_LEADER"],
  }),
  listSubmissions
);
// Review of submissions: executive sign-off roles (ADR-0018) — never the
// submitting leader. Identity comes from the session, not the body.
reportsRouter.put(
  "/submissions/:submissionId/review",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
  }),
  reviewSubmission
);
