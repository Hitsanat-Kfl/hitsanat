import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import { getApprovalsSummary, listApprovals } from "./approvals.controller.js";

export const approvalsRouter: Router = Router();

// Unified Approvals Inbox (§2.5a): CHAIRPERSON + SUB_CHAIRPERSON (ADR-0018);
// SUPER_ADMIN passes via the §4.3 bypass.
approvalsRouter.use(requireAuth());
approvalsRouter.use(
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
  })
);

approvalsRouter.get("/", listApprovals);
approvalsRouter.get("/summary", getApprovalsSummary);
