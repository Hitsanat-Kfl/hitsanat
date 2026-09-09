import type { Request, Response } from "express";
import { DrizzlePublicRepository } from "../infrastructure/repositories/public.repository.js";
import { GetPublicStatsUseCase } from "../application/use-cases/get-public-stats.use-case.js";
import { GetPublicEventsUseCase } from "../application/use-cases/get-public-events.use-case.js";
import { GetPublicAnnouncementsUseCase } from "../application/use-cases/get-public-announcements.use-case.js";

const publicRepository = new DrizzlePublicRepository();

export async function getPublicStats(_req: Request, res: Response) {
  try {
    const useCase = new GetPublicStatsUseCase(publicRepository);
    const stats = await useCase.execute();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getPublicEvents(_req: Request, res: Response) {
  try {
    const useCase = new GetPublicEventsUseCase(publicRepository);
    const events = await useCase.execute();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getPublicAnnouncements(_req: Request, res: Response) {
  try {
    const useCase = new GetPublicAnnouncementsUseCase(publicRepository);
    const announcements = await useCase.execute();
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}
