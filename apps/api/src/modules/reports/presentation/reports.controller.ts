import type { Request, Response } from "express";
import { ApproveReportUseCase } from "../application/use-cases/approve-report.use-case.js";
import { GenerateReportUseCase } from "../application/use-cases/generate-report.use-case.js";
import { GetReportUseCase } from "../application/use-cases/get-report.use-case.js";
import { ListReportsUseCase } from "../application/use-cases/list-reports.use-case.js";
import { ListSubmissionsUseCase } from "../application/use-cases/list-submissions.use-case.js";
import { ReviewSubmissionUseCase } from "../application/use-cases/review-submission.use-case.js";
import { SubmitReportUseCase } from "../application/use-cases/submit-report.use-case.js";
import { DrizzleReportsRepository } from "../infrastructure/repositories/reports.repository.js";
import { notifyReportAwaitingSignoff } from "../notifications-link.js";

const reportsRepository = new DrizzleReportsRepository();

/**
 * Session-derived identity. Reviewed-by / generated-by must never come from
 * the request body — a client cannot be trusted to name the actor.
 */
function requireSession(req: Request): { id: string; name: string } {
  const user = req.sessionUser;
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }
  return { id: user.id, name: user.name };
}

export async function generateReport(req: Request, res: Response) {
  try {
    const useCase = new GenerateReportUseCase(reportsRepository);
    const report = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listReports(req: Request, res: Response) {
  try {
    const useCase = new ListReportsUseCase(reportsRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const reportType = req.query.reportType as string | undefined;
    const subDepartmentId = req.query.subDepartmentId as string | undefined;
    const result = await useCase.execute({ page, limit, reportType, subDepartmentId });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getReport(req: Request, res: Response) {
  try {
    const useCase = new GetReportUseCase(reportsRepository);
    const report = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

export async function submitReport(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new SubmitReportUseCase(reportsRepository);
    const submission = await useCase.execute({
      ...req.body,
      submittedBy: session.id,
    });
    // FR-17.1 / §2.24: tell the executives a report is awaiting sign-off.
    notifyReportAwaitingSignoff({
      submissionId: submission.id,
      reportType: submission.reportType,
      periodLabel: submission.periodLabel,
      submittedByName: session.name,
    });
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listSubmissions(req: Request, res: Response) {
  try {
    const useCase = new ListSubmissionsUseCase(reportsRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const subDepartmentId = req.query.subDepartmentId as string | undefined;
    const status = req.query.status as string | undefined;
    const result = await useCase.execute({ page, limit, subDepartmentId, status });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function reviewSubmission(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new ReviewSubmissionUseCase(reportsRepository);
    const submission = await useCase.execute({
      id: req.params.submissionId as string,
      reviewedBy: session.id,
      status: req.body.status,
      reviewComments: req.body.reviewComments,
    });
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

/**
 * PATCH /reports/:id/approve — executive sign-off of a generated periodic
 * report (ApprovePeriodicReportUseCase, endpoints.md §2.5). Archives the
 * approved report; identity from the session.
 */
export async function approveReport(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new ApproveReportUseCase(reportsRepository);
    const report = await useCase.execute({
      id: req.params.id as string,
      approvedBy: session.id,
      comments: req.body.comments,
    });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({ success: false, error: message });
  }
}
