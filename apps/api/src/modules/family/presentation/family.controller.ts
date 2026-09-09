import type { Request, Response } from "express";
import { DrizzleFamilyRepository } from "../infrastructure/repositories/family.repository.js";
import { CreateFamilyUseCase } from "../application/use-cases/create-family.use-case.js";
import { ListFamiliesUseCase } from "../application/use-cases/list-families.use-case.js";
import { GetFamilyDetailUseCase } from "../application/use-cases/get-family-detail.use-case.js";

const familyRepository = new DrizzleFamilyRepository();

export async function create(req: Request, res: Response) {
  try {
    const useCase = new CreateFamilyUseCase(familyRepository);
    const family = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: family });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const useCase = new ListFamiliesUseCase(familyRepository);
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

export async function getById(req: Request, res: Response) {
  try {
    const useCase = new GetFamilyDetailUseCase(familyRepository);
    const family = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: family });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}
