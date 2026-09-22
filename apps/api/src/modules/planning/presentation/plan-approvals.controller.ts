import type { Request, Response } from "express";
import {
  ListPlanApprovalsUseCase,
  ReviewPlanApprovalUseCase,
  SubmitPlanApprovalUseCase,
} from "../application/use-cases/plan-approval.use-cases.js";

function requireSession(req: Request): { id: string } {
  const user = req.sessionUser;
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }
  return user;
}

export async function submitPlanApproval(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new SubmitPlanApprovalUseCase();
    const approval = await useCase.execute({
      annualPlanId: req.params.id as string,
      requestedBy: session.id,
      changeSummary: req.body.changeSummary,
    });
    res.status(201).json({ success: true, data: approval });
  } catch (error) {
    handleError(res, error);
  }
}

export async function listPlanApprovals(req: Request, res: Response) {
  try {
    const useCase = new ListPlanApprovalsUseCase();
    const approvals = await useCase.execute({
      annualPlanId: req.query.annualPlanId as string | undefined,
      status: (req.query.status as string | undefined) ?? "Pending",
    });
    res.status(200).json({ success: true, data: approvals });
  } catch (error) {
    handleError(res, error);
  }
}

export async function reviewPlanApproval(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new ReviewPlanApprovalUseCase();
    const approval = await useCase.execute({
      approvalId: req.params.approvalId as string,
      reviewedBy: session.id,
      decision: req.body.decision,
      reviewComments: req.body.reviewComments,
    });
    res.status(200).json({ success: true, data: approval });
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? (error as { statusCode: number }).statusCode
      : message.includes("not found")
        ? 404
        : 400;
  res.status(statusCode).json({ success: false, error: { code: "PLAN_APPROVAL_ERROR", message } });
}
