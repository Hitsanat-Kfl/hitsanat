import type { Notification } from "@repo/domain";
import type { NotificationsRepository } from "../../domain/repositories/notifications.repository.js";

export class ListNotificationsUseCase {
  constructor(private readonly repo: NotificationsRepository) {}

  async execute(params: {
    userId: string;
    unreadOnly?: boolean;
    type?: string;
    limit?: number;
  }): Promise<{ items: Notification[]; unread: number }> {
    const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);
    const [items, unread] = await Promise.all([
      this.repo.findManyByUserId({
        userId: params.userId,
        unreadOnly: params.unreadOnly,
        type: params.type,
        limit,
      }),
      this.repo.countUnread(params.userId),
    ]);
    return { items, unread };
  }

  countUnread(userId: string): Promise<number> {
    return this.repo.countUnread(userId);
  }
}
