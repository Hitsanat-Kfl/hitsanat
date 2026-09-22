import { Router } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import type { Request, Response } from "express";
import { GetChairpersonOverviewUseCase } from "../application/use-cases/get-chairperson-overview.use-case.js";

/**
 * FR-13.5 / RPT-004: Chairperson executive overview.
 * Cross-departmental visibility — CHAIRPERSON, SUB_CHAIRPERSON, SUPER_ADMIN.
 */
export async function getChairpersonOverview(_req: Request, res: Response) {
  try {
    const useCase = new GetChairpersonOverviewUseCase();
    const overview = await useCase.execute();
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: { code: "DASHBOARD_ERROR", message } });
  }
}

export const dashboardRouter: Router = Router();

dashboardRouter.use(requireAuth());
dashboardRouter.get(
  "/chairperson-overview",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
  }),
  getChairpersonOverview
);
