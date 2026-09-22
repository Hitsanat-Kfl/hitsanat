import { and, count, desc, eq, getDb, isNull } from "@repo/database";
import { notifications } from "@repo/database/schema";
import type { CreateNotification, Notification } from "@repo/domain";
import type { NotificationsRepository } from "../../domain/repositories/notifications.repository.js";

function toNotification(row: typeof notifications.$inferSelect): Notification {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    title: row.title,
    body: row.body ?? undefined,
    resourceType: row.resourceType ?? undefined,
    resourceId: row.resourceId ?? undefined,
    link: row.link ?? undefined,
    readAt: row.readAt ? new Date(row.readAt) : undefined,
    createdAt: new Date(row.createdAt),
  };
}

export class DrizzleNotificationsRepository implements NotificationsRepository {
  async createMany(items: CreateNotification[]): Promise<Notification[]> {
    if (items.length === 0) return [];
    const db = getDb();
    const rows = await db
      .insert(notifications)
      .values(
        items.map((item) => ({
          userId: item.userId,
          type: item.type,
          title: item.title,
          body: item.body,
          resourceType: item.resourceType,
          resourceId: item.resourceId,
          link: item.link,
        }))
      )
      .returning();
    return rows.map(toNotification);
  }

  async findManyByUserId(params: {
    userId: string;
    unreadOnly?: boolean;
    type?: string;
    limit: number;
  }): Promise<Notification[]> {
    const db = getDb();
    const filters = [eq(notifications.userId, params.userId)];
    if (params.unreadOnly) filters.push(isNull(notifications.readAt));
    if (params.type) filters.push(eq(notifications.type, params.type));

    const rows = await db
      .select()
      .from(notifications)
      .where(and(...filters))
      .orderBy(desc(notifications.createdAt))
      .limit(Math.min(Math.max(params.limit, 1), 100));
    return rows.map(toNotification);
  }

  async markRead(id: string, userId: string): Promise<Notification | null> {
    const db = getDb();
    const rows = await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return rows.length > 0 ? toNotification(rows[0]) : null;
  }

  async markAllRead(userId: string): Promise<number> {
    const db = getDb();
    const rows = await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))
      .returning({ id: notifications.id });
    return rows.length;
  }

  async countUnread(userId: string): Promise<number> {
    const db = getDb();
    const result = await db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
    return result[0]?.value ?? 0;
  }
}
