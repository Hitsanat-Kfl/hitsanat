import type { Request, Response } from "express";
import { ListNotificationsUseCase } from "../application/use-cases/list-notifications.use-case.js";
import { MarkNotificationsReadUseCase } from "../application/use-cases/mark-notifications-read.use-case.js";
import { DrizzleNotificationsRepository } from "../infrastructure/repositories/notifications.repository.js";

const notificationsRepository = new DrizzleNotificationsRepository();

function requireSession(req: Request): { id: string } {
  const user = req.sessionUser;
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }
  return user;
}

/** GET /notifications — the current user's feed (own only). */
export async function listNotifications(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new ListNotificationsUseCase(notificationsRepository);
    const result = await useCase.execute({
      userId: session.id,
      unreadOnly: req.query.unread === "true",
      type: req.query.type as string | undefined,
      limit: Number(req.query.limit) || 50,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleError(res, error);
  }
}

/** GET /notifications/unread-count — badge indicator. */
export async function getUnreadCount(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new ListNotificationsUseCase(notificationsRepository);
    const unread = await useCase.countUnread(session.id);
    res.status(200).json({ success: true, data: { unread } });
  } catch (error) {
    handleError(res, error);
  }
}

/** PATCH /notifications/:id/read — mark a single notification read (own only). */
export async function markNotificationRead(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new MarkNotificationsReadUseCase(notificationsRepository);
    const notification = await useCase.markRead(req.params.id as string, session.id);
    if (!notification) {
      res
        .status(404)
        .json({ success: false, error: { code: "NOTIFICATION_NOT_FOUND", message: "Not found" } });
      return;
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    handleError(res, error);
  }
}

/** POST /notifications/read-all — mark all of the current user's notifications read. */
export async function markAllNotificationsRead(req: Request, res: Response) {
  try {
    const session = requireSession(req);
    const useCase = new MarkNotificationsReadUseCase(notificationsRepository);
    const updated = await useCase.markAllRead(session.id);
    res.status(200).json({ success: true, data: { updated } });
  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? (error as { statusCode: number }).statusCode
      : 500;
  res.status(statusCode).json({ success: false, error: { code: "NOTIFICATION_ERROR", message } });
}
