import type { Notification } from "@repo/domain";
import type { NotificationsRepository } from "../../domain/repositories/notifications.repository.js";

export class MarkNotificationsReadUseCase {
  constructor(private readonly repo: NotificationsRepository) {}

  markRead(id: string, userId: string): Promise<Notification | null> {
    return this.repo.markRead(id, userId);
  }

  markAllRead(userId: string): Promise<number> {
    return this.repo.markAllRead(userId);
  }
}
