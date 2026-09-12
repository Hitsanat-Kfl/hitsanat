import type { Request, Response } from "express";
import { AssignProgramUseCase } from "../application/use-cases/assign-program.use-case.js";
import { CreateEventUseCase } from "../application/use-cases/create-event.use-case.js";
import { GetEventUseCase } from "../application/use-cases/get-event.use-case.js";
import { ListEventsUseCase } from "../application/use-cases/list-events.use-case.js";
import { DrizzleEventsRepository } from "../infrastructure/repositories/events.repository.js";

const eventsRepository = new DrizzleEventsRepository();

export async function createEvent(req: Request, res: Response) {
  try {
    const useCase = new CreateEventUseCase(eventsRepository);
    const event = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listEvents(req: Request, res: Response) {
  try {
    const useCase = new ListEventsUseCase(eventsRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const eventType = req.query.eventType as string | undefined;
    const result = await useCase.execute({ page, limit, eventType });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function getEvent(req: Request, res: Response) {
  try {
    const useCase = new GetEventUseCase(eventsRepository);
    const event = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(404).json({ success: false, error: message });
  }
}

export async function assignProgram(req: Request, res: Response) {
  try {
    const useCase = new AssignProgramUseCase(eventsRepository);
    const assignment = await useCase.execute({
      eventId: req.params.id as string,
      ...req.body,
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}
