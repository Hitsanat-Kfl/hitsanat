import type { BaseEntity } from "../base.js";

/**
 * In-app notification (FR-17.1 / FR-13.1.2 / endpoints.md §2.24).
 * One row per recipient; Telegram delivery is handled by the standalone
 * bot service (ADR-0006).
 */
export enum NotificationType {
  PLAN_APPROVAL_REQUESTED = "PLAN_APPROVAL_REQUESTED",
  PLAN_APPROVAL_DECIDED = "PLAN_APPROVAL_DECIDED",
  REPORT_AWAITING_SIGNOFF = "REPORT_AWAITING_SIGNOFF",
  EVENT_AWAITING_APPROVAL = "EVENT_AWAITING_APPROVAL",
  MEETING_REMINDER_24H = "MEETING_REMINDER_24H",
  MEETING_REMINDER_1H = "MEETING_REMINDER_1H",
  USER_REACTIVATED = "USER_REACTIVATED",
}

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType | string;
  title: string;
  body?: string;
  resourceType?: string;
  resourceId?: string;
  link?: string;
  readAt?: Date;
}

export type CreateNotification = Omit<Notification, "id" | "createdAt" | "readAt">;
