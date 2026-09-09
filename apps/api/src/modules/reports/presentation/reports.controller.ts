import type { Request, Response } from "express";
import { DrizzleReportsRepository } from "../infrastructure/repositories/reports.repository.js";
import { GenerateReportUseCase } from "../application/use-cases/generate-report.use-case.js";
import { ListReportsUseCase } from "../application/use-cases/list-reports.use-case.js";
import { GetReportUseCase } from "../application/use-cases/get-report.use-case.js";

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
