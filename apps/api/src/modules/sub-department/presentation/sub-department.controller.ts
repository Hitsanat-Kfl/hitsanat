import type { Request, Response } from "express";
import { GetSubDepartmentRosterUseCase } from "../application/use-cases/get-sub-department-roster.use-case.js";
import { ListSubDepartmentsUseCase } from "../application/use-cases/list-sub-departments.use-case.js";
import { DrizzleSubDepartmentRepository } from "../infrastructure/repositories/sub-department.repository.js";

const repo = new DrizzleSubDepartmentRepository();

export async function list(_req: Request, res: Response) {
  try {
    const useCase = new ListSubDepartmentsUseCase(repo);
    const subDepts = await useCase.execute();
    res.status(200).json({ success: true, data: subDepts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getRoster(req: Request, res: Response) {
  try {
    const useCase = new GetSubDepartmentRosterUseCase(repo);
    const roster = await useCase.execute(req.params.code as string);
    res.status(200).json({ success: true, data: roster });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
}
