import type { CreateNotification, Notification } from "@repo/domain";

export interface NotificationsRepository {
  createMany(notifications: CreateNotification[]): Promise<Notification[]>;
  findManyByUserId(params: {
    userId: string;
    unreadOnly?: boolean;
    type?: string;
    limit: number;
  }): Promise<Notification[]>;
  markRead(id: string, userId: string): Promise<Notification | null>;
  markAllRead(userId: string): Promise<number>;
  countUnread(userId: string): Promise<number>;
}
