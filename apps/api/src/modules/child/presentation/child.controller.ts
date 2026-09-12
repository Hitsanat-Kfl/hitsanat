import type { Request, Response } from "express";
import { CreateChildUseCase } from "../application/use-cases/create-child.use-case.js";
import { CreateParentUseCase } from "../application/use-cases/create-parent.use-case.js";
import { DeleteChildUseCase } from "../application/use-cases/delete-child.use-case.js";
import { GetBirthdayMonthUseCase } from "../application/use-cases/get-birthday-month.use-case.js";
import { GetChildDetailUseCase } from "../application/use-cases/get-child-detail.use-case.js";
import { LinkParentUseCase } from "../application/use-cases/link-parent.use-case.js";
import { ListAllParentsUseCase } from "../application/use-cases/list-all-parents.use-case.js";
import { ListChildrenUseCase } from "../application/use-cases/list-children.use-case.js";
import { ListParentsUseCase } from "../application/use-cases/list-parents.use-case.js";
import { ReclassifyChildUseCase } from "../application/use-cases/reclassify-child.use-case.js";
import { UnlinkParentUseCase } from "../application/use-cases/unlink-parent.use-case.js";
import { UpdateChildUseCase } from "../application/use-cases/update-child.use-case.js";
import { DrizzleChildRepository } from "../infrastructure/repositories/child.repository.js";

const childRepository = new DrizzleChildRepository();

// --- Child CRUD ---

export async function create(req: Request, res: Response) {
  try {
    const useCase = new CreateChildUseCase(childRepository);
    const child = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: child });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const useCase = new ListChildrenUseCase(childRepository);
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
    const useCase = new GetChildDetailUseCase(childRepository);
    const child = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: child });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const useCase = new UpdateChildUseCase(childRepository);
    const child = await useCase.execute(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: child });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const useCase = new DeleteChildUseCase(childRepository);
    await useCase.execute(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

// --- Reclassify (BR-012, BR-013) ---

export async function reclassify(req: Request, res: Response) {
  try {
    const useCase = new ReclassifyChildUseCase(childRepository);
    const child = await useCase.execute(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: child });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

// --- Birthday Month Query ---

export async function getByBirthdayMonth(req: Request, res: Response) {
  try {
    const useCase = new GetBirthdayMonthUseCase(childRepository);
    const month = Number(req.params.month);
    const children = await useCase.execute(month);
    res.status(200).json({ success: true, data: children });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

// --- Child-Parent Linking ---

export async function listParents(req: Request, res: Response) {
  try {
    const useCase = new ListParentsUseCase(childRepository);
    const parents = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: parents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

export async function linkParent(req: Request, res: Response) {
  try {
    const useCase = new LinkParentUseCase(childRepository);
    const link = await useCase.execute(req.params.id as string, req.body);
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function unlinkParent(req: Request, res: Response) {
  try {
    const useCase = new UnlinkParentUseCase(childRepository);
    await useCase.execute(req.params.id as string, req.params.parentId as string);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

// --- Parent CRUD (scoped to children module) ---

export async function createParent(req: Request, res: Response) {
  try {
    const useCase = new CreateParentUseCase(childRepository);
    const parent = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: parent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listAllParents(_req: Request, res: Response) {
  try {
    const useCase = new ListAllParentsUseCase(childRepository);
    const parentsList = await useCase.execute();
    res.status(200).json({ success: true, data: parentsList });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}
