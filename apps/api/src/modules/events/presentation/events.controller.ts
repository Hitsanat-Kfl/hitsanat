import type { Request, Response } from "express";
import { ApproveEventUseCase } from "../application/use-cases/approve-event.use-case.js";
import { AssignProgramUseCase } from "../application/use-cases/assign-program.use-case.js";
import { CreateEventUseCase } from "../application/use-cases/create-event.use-case.js";
import { GetEventUseCase } from "../application/use-cases/get-event.use-case.js";
import { ListEventAttendanceUseCase } from "../application/use-cases/list-event-attendance.use-case.js";
import { ListEventsUseCase } from "../application/use-cases/list-events.use-case.js";
import { RecordEventAttendanceUseCase } from "../application/use-cases/record-event-attendance.use-case.js";
import { UpdateEventAttendanceUseCase } from "../application/use-cases/update-event-attendance.use-case.js";
import { DrizzleEventsRepository } from "../infrastructure/repositories/events.repository.js";

const eventsRepository = new DrizzleEventsRepository();

function requireSession(req: Request): { id: string } {
  const user = req.sessionUser;
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }
  return user;
}

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

export async function recordEventAttendance(req: Request, res: Response) {
  try {
    const useCase = new RecordEventAttendanceUseCase(eventsRepository);
    const attendance = await useCase.execute({
      eventId: req.params.id as string,
      ...req.body,
    });
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listEventAttendance(req: Request, res: Response) {
  try {
    const useCase = new ListEventAttendanceUseCase(eventsRepository);
    const attendance = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function updateEventAttendance(req: Request, res: Response) {
  try {
    const useCase = new UpdateEventAttendanceUseCase(eventsRepository);
    const attendance = await useCase.execute({
      id: req.params.attendanceId as string,
      ...req.body,
    });
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

/**
 * PATCH /events/:id/approve — approve event & publish flag (endpoints.md §2.5).
 * CHAIRPERSON or SUB_CHAIRPERSON only (ADR-0018); body: { publish: boolean }.
 */
export async function approveEvent(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new ApproveEventUseCase(eventsRepository);
    const event = await useCase.execute({
      id: req.params.id as string,
      approvedBy: session.id,
      publish: req.body.publish !== false,
    });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({ success: false, error: message });
  }
}
