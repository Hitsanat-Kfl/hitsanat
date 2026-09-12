import { Router } from "express";
import {
  createAnnualPlan,
  createWeeklyPlan,
  distributePlan,
  getAnnualPlan,
  listAnnualPlans,
  submitProgress,
  updateAnnualPlan,
} from "./planning.controller.js";

export const planningRouter: Router = Router();

// Annual Plan CRUD
planningRouter.post("/", createAnnualPlan);
planningRouter.get("/", listAnnualPlans);
planningRouter.get("/:id", getAnnualPlan);
planningRouter.patch("/:id", updateAnnualPlan);

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
