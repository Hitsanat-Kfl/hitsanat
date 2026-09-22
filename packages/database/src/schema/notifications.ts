import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Notifications table (FR-17.1 / FR-13.1.2 / endpoints.md §2.24)
 * In-app notification feed for leadership users. Each row targets a single
 * recipient user; Telegram delivery remains with the standalone bot service
 * (ADR-0006). Notification types mirror docs/api/endpoints.md §2.24:
 *   PLAN_APPROVAL_REQUESTED | PLAN_APPROVAL_DECIDED | REPORT_AWAITING_SIGNOFF
 *   EVENT_AWAITING_APPROVAL | MEETING_REMINDER_24H | MEETING_REMINDER_1H
 *   USER_REACTIVATED
 */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Recipient auth user id. */
    userId: uuid("user_id").notNull(),
    /** Notification type discriminator (see module docs). */
    type: varchar("type", { length: 48 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    /** Domain-specific pointer, e.g. plan approval id, meeting id, report id. */
    resourceType: varchar("resource_type", { length: 32 }),
    resourceId: uuid("resource_id"),
    /** Optional deep-link path for the admin UI. */
    link: text("link"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    { notificationsUserIdx: index("notifications_user_idx").on(table.userId) },
    {
      notificationsUserReadIdx: index("notifications_user_read_idx").on(table.userId, table.readAt),
    },
  ]
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
