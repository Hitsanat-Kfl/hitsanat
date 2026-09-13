import type { Request, Response } from "express";
import { GenerateReportUseCase } from "../application/use-cases/generate-report.use-case.js";
import { GetReportUseCase } from "../application/use-cases/get-report.use-case.js";
import { ListReportsUseCase } from "../application/use-cases/list-reports.use-case.js";
import { ListSubmissionsUseCase } from "../application/use-cases/list-submissions.use-case.js";
import { ReviewSubmissionUseCase } from "../application/use-cases/review-submission.use-case.js";
import { SubmitReportUseCase } from "../application/use-cases/submit-report.use-case.js";
import { DrizzleReportsRepository } from "../infrastructure/repositories/reports.repository.js";

const reportsRepository = new DrizzleReportsRepository();

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
    const useCase = new SubmitReportUseCase(reportsRepository);
    const submission = await useCase.execute({
      ...req.body,
      submittedBy: req.body.userId || "system",
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
    const useCase = new ReviewSubmissionUseCase(reportsRepository);
    const submission = await useCase.execute({
      id: req.params.submissionId as string,
      reviewedBy: req.body.userId || "system",
      status: req.body.status,
    });
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}
