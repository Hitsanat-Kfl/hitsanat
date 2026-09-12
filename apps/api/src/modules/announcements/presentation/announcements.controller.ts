import type { Request, Response } from "express";
import { CreateAnnouncementUseCase } from "../application/use-cases/create-announcement.use-case.js";
import { ListAnnouncementsUseCase } from "../application/use-cases/list-announcements.use-case.js";
import { PublishAnnouncementUseCase } from "../application/use-cases/publish-announcement.use-case.js";
import { DrizzleAnnouncementsRepository } from "../infrastructure/repositories/announcements.repository.js";

const announcementsRepository = new DrizzleAnnouncementsRepository();

export async function createAnnouncement(req: Request, res: Response) {
  try {
    const useCase = new CreateAnnouncementUseCase(announcementsRepository);
    const announcement = await useCase.execute({
      ...req.body,
      createdBy: req.body.userId || "system",
    });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listAnnouncements(req: Request, res: Response) {
  try {
    const useCase = new ListAnnouncementsUseCase(announcementsRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const targetAudience = req.query.targetAudience as string | undefined;
    const isPublished =
      req.query.isPublished === "true"
        ? true
        : req.query.isPublished === "false"
          ? false
          : undefined;
    const result = await useCase.execute({ page, limit, targetAudience, isPublished });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function publishAnnouncement(req: Request, res: Response) {
  try {
    const useCase = new PublishAnnouncementUseCase(announcementsRepository);
    const announcement = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}
