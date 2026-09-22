import { Router } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import {
  listPlanApprovals,
  reviewPlanApproval,
  submitPlanApproval,
} from "./plan-approvals.controller.js";
import {
  createAnnualPlan,
  createWeeklyPlan,
  distributePlan,
  getAnnualPlan,
  getDistributionStatus,
  getProgressSummary,
  listAnnualPlans,
  submitProgress,
  updateAnnualPlan,
} from "./planning.controller.js";

export const planningRouter: Router = Router();

// Plan Approval Workflow (FR-17.1 / BR-025)
// Submit: EKD_LEADER (create plan change requests) — list/review: CHAIRPERSON.
planningRouter.post(
  "/:id/approvals",
  requireAuth(),
  requireScopePermission({
    allowedGlobalRoles: ["EKD_LEADER", "CHAIRPERSON"],
  }),
  submitPlanApproval
);
planningRouter.get(
  "/approvals",
  requireAuth(),
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
  }),
  listPlanApprovals
);
planningRouter.patch(
  "/approvals/:approvalId/review",
  requireAuth(),
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON"],
  }),
  reviewPlanApproval
);

// Annual Plan CRUD
planningRouter.post("/", createAnnualPlan);
planningRouter.get("/", listAnnualPlans);
planningRouter.get("/:id", getAnnualPlan);
planningRouter.patch("/:id", updateAnnualPlan);

// Analytics Queries (BES-012)
planningRouter.get("/:id/distributions", getDistributionStatus);
planningRouter.get("/:id/progress", getProgressSummary);

// Plan Distribution
planningRouter.post("/:activityId/distribute", distributePlan);

// Weekly Plans & Progress
planningRouter.post("/distributions/:distributionId/weekly-plans", createWeeklyPlan);
planningRouter.post("/weekly-plans/:weeklyPlanId/progress", submitProgress);

// TODO PLN-006 (Backend Support - Israel): Add query endpoints
// GET /api/v1/annual-plans/:id/progress - Progress summary by goal
// GET /api/v1/annual-plans/:id/distributions - Distribution status by sub-department
// Support weight-adjusted completion metrics and quarterly breakdown

// TODO PLN-009 (Backend Support - Israel): Add integration tests
// Test full planning lifecycle: plan creation → weight calculation → distribution → weekly execution → progress roll-up
// Verify BR-030 weight formula, BR-031 distribution constraint, BR-032 roll-up aggregation

// TODO PLN-010 (Backend Support - Israel): Update OpenAPI/Swagger documentation
// Document all planning endpoints, weight formula, roll-up logic, error responses
