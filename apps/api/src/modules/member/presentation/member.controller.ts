import type { Request, Response } from "express";
import { CreateMemberStage1UseCase } from "../application/use-cases/create-member-stage1.use-case.js";
import { GetMemberDetailUseCase } from "../application/use-cases/get-member-detail.use-case.js";
import { ListMembersUseCase } from "../application/use-cases/list-members.use-case.js";
import { UpdateMemberStage2UseCase } from "../application/use-cases/update-member-stage2.use-case.js";
import { UpdateMemberUseCase } from "../application/use-cases/update-member.use-case.js";
import { DrizzleMemberRepository } from "../infrastructure/repositories/member.repository.js";

const memberRepository = new DrizzleMemberRepository();

export async function createStage1(req: Request, res: Response) {
  try {
    const useCase = new CreateMemberStage1UseCase(memberRepository);
    const member = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function updateStage2(req: Request, res: Response) {
  try {
    const useCase = new UpdateMemberStage2UseCase(memberRepository);
    const member = await useCase.execute(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const useCase = new UpdateMemberUseCase(memberRepository);
    const member = await useCase.execute(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, error: message });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const useCase = new ListMembersUseCase(memberRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;
    const subDept = req.query.subDept as string | undefined;
    const familyId = req.query.familyId as string | undefined;
    const yearOfStudy = req.query.yearOfStudy as string | undefined;
    const isActive = req.query.isActive as string | undefined;
    const result = await useCase.execute({
      page,
      limit,
      search,
      subDept,
      familyId,
      yearOfStudy,
      isActive,
    });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const useCase = new GetMemberDetailUseCase(memberRepository);
    const member = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}
