import type { Request, Response } from "express";
import { CreateAnnualPlanUseCase } from "../application/use-cases/create-annual-plan.use-case.js";
import { CreateWeeklyPlanUseCase } from "../application/use-cases/create-weekly-plan.use-case.js";
import { DistributePlanUseCase } from "../application/use-cases/distribute-plan.use-case.js";
import { GetAnnualPlanUseCase } from "../application/use-cases/get-annual-plan.use-case.js";
import { GetDistributionStatusUseCase } from "../application/use-cases/get-distribution-status.use-case.js";
import { GetProgressSummaryUseCase } from "../application/use-cases/get-progress-summary.use-case.js";
import { ListAnnualPlansUseCase } from "../application/use-cases/list-annual-plans.use-case.js";
import { SubmitProgressUseCase } from "../application/use-cases/submit-progress.use-case.js";
import { UpdateAnnualPlanUseCase } from "../application/use-cases/update-annual-plan.use-case.js";
import { DrizzlePlanningRepository } from "../infrastructure/repositories/planning.repository.js";

const planningRepository = new DrizzlePlanningRepository();

export async function createAnnualPlan(req: Request, res: Response) {
  try {
    const useCase = new CreateAnnualPlanUseCase(planningRepository);
    const result = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listAnnualPlans(req: Request, res: Response) {
  try {
    const useCase = new ListAnnualPlansUseCase(planningRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;
    const result = await useCase.execute({ page, limit, search });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getAnnualPlan(req: Request, res: Response) {
  try {
    const useCase = new GetAnnualPlanUseCase(planningRepository);
    const plan = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

export async function updateAnnualPlan(req: Request, res: Response) {
  try {
    const useCase = new UpdateAnnualPlanUseCase(planningRepository);
    const plan = await useCase.execute(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function distributePlan(req: Request, res: Response) {
  try {
    const useCase = new DistributePlanUseCase(planningRepository);
    const distributions = await useCase.execute({
      activityId: req.params.activityId as string,
      subDepartmentIds: req.body.subDepartmentIds,
    });
    res.status(201).json({ success: true, data: distributions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function createWeeklyPlan(req: Request, res: Response) {
  try {
    const useCase = new CreateWeeklyPlanUseCase(planningRepository);
    const weeklyPlan = await useCase.execute({
      distributionId: req.params.distributionId as string,
      ...req.body,
    });
    res.status(201).json({ success: true, data: weeklyPlan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function submitProgress(req: Request, res: Response) {
  try {
    const useCase = new SubmitProgressUseCase(planningRepository);
    const progress = await useCase.execute({
      weeklyPlanId: req.params.weeklyPlanId as string,
      ...req.body,
      submittedBy: req.body.submittedBy || "system",
    });
    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function getDistributionStatus(req: Request, res: Response) {
  try {
    const useCase = new GetDistributionStatusUseCase(planningRepository);
    const distributions = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: distributions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getProgressSummary(req: Request, res: Response) {
  try {
    const useCase = new GetProgressSummaryUseCase(planningRepository);
    const summary = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}
