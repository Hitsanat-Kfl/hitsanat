import type { Request, Response } from "express";
import { CreateMeetingUseCase } from "../application/use-cases/create-meeting.use-case.js";
import {
  GetMeetingUseCase,
  ListMeetingsUseCase,
} from "../application/use-cases/meeting-query.use-cases.js";
import {
  CancelMeetingUseCase,
  RecordMinutesUseCase,
  UpdateMeetingUseCase,
} from "../application/use-cases/update-meeting.use-case.js";
import { DrizzleMeetingsRepository } from "../infrastructure/repositories/meetings.repository.js";

const meetingsRepository = new DrizzleMeetingsRepository();

/**
 * FR-13.1.1 / BR-008 double guard: middleware scope check + explicit session
 * check, mirroring users.controller.ts.
 */
function requireSession(req: Request): { id: string } {
  const user = req.sessionUser;
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }
  return user;
}

export async function createMeeting(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new CreateMeetingUseCase(meetingsRepository);
    const meeting = await useCase.execute({
      title: req.body.title,
      description: req.body.description,
      scheduledAt: req.body.scheduledAt,
      durationMinutes: req.body.durationMinutes,
      location: req.body.location,
      agenda: req.body.agenda,
      createdBy: session.id,
      inviteeUserIds: req.body.inviteeUserIds,
    });
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    handleError(res, error);
  }
}

export async function listMeetings(req: Request, res: Response) {
  try {
    const useCase = new ListMeetingsUseCase(meetingsRepository);
    const result = await useCase.execute({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      status: req.query.status as string | undefined,
      upcoming: req.query.upcoming === "true",
    });
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function getMeeting(req: Request, res: Response) {
  try {
    const useCase = new GetMeetingUseCase(meetingsRepository);
    const meeting = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    handleError(res, error, 404);
  }
}

/** PATCH /meetings/:id — CHAIRPERSON only (enforced at router level). */
export async function updateMeeting(req: Request, res: Response) {
  try {
    requireSession(req);
    const useCase = new UpdateMeetingUseCase(meetingsRepository);
    const meeting = await useCase.execute(req.params.id as string, {
      title: req.body.title,
      description: req.body.description,
      scheduledAt: req.body.scheduledAt,
      durationMinutes: req.body.durationMinutes,
      location: req.body.location,
      agenda: req.body.agenda,
      status: req.body.status,
      inviteeUserIds: req.body.inviteeUserIds,
    });
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    handleError(res, error);
  }
}

/** DELETE /meetings/:id — CHAIRPERSON only (enforced at router level). */
export async function cancelMeeting(req: Request, res: Response) {
  try {
    requireSession(req);
    const useCase = new CancelMeetingUseCase(meetingsRepository);
    const meeting = await useCase.execute(req.params.id as string);
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    handleError(res, error);
  }
}

/** POST /meetings/:id/minutes — record minutes (BR-019: within 48h window). */
export async function recordMinutes(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new RecordMinutesUseCase(meetingsRepository);
    const meeting = await useCase.execute(req.params.id as string, {
      minutes: req.body.minutes,
      recordedBy: session.id,
    });
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: unknown, notFoundStatus = 400) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? (error as { statusCode: number }).statusCode
      : message.includes("not found")
        ? notFoundStatus
        : 400;
  res.status(statusCode).json({ success: false, error: { code: "MEETING_ERROR", message } });
}
