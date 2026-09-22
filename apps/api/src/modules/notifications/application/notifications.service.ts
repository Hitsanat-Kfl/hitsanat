import type { CreateNotification, Notification } from "@repo/domain";
import { NotificationType } from "@repo/domain";
import type { NotificationsRepository } from "../domain/repositories/notifications.repository.js";

/** Recipient role sets per docs/api/endpoints.md §2.24. */
export const EXECUTIVE_RECIPIENT_ROLES = ["CHAIRPERSON", "SUB_CHAIRPERSON"] as const;

/**
 * Domain event payloads → notification rows. Fan-out to executive
 * recipients is resolved by the caller (needs the users table); this
 * service keeps the type-specific titles/bodies in one place.
 */
export class NotificationsService {
  constructor(private readonly repo: NotificationsRepository) {}

  async createMany(items: CreateNotification[]): Promise<Notification[]> {
    if (items.length === 0) return [];
    return this.repo.createMany(items);
  }

  planApprovalRequested(input: {
    recipientIds: string[];
    approvalId: string;
    planId: string;
    requestedByName: string;
    changeSummary: string;
  }): CreateNotification[] {
    return input.recipientIds.map((userId) => ({
      userId,
      type: NotificationType.PLAN_APPROVAL_REQUESTED,
      title: "Plan change awaiting review",
      body: `${input.requestedByName} submitted a plan change: ${input.changeSummary}`.slice(
        0,
        500
      ),
      resourceType: "plan_approval",
      resourceId: input.approvalId,
      link: "/chairperson/approvals",
    }));
  }

  planApprovalDecided(input: {
    recipientIds: string[];
    approvalId: string;
    decision: string;
    reviewComments?: string;
  }): CreateNotification[] {
    return input.recipientIds.map((userId) => ({
      userId,
      type: NotificationType.PLAN_APPROVAL_DECIDED,
      title: `Plan change ${input.decision.toLowerCase()}`,
      body: input.reviewComments?.trim()
        ? `Review comments: ${input.reviewComments}`.slice(0, 500)
        : `Your plan change request was ${input.decision.toLowerCase()}.`,
      resourceType: "plan_approval",
      resourceId: input.approvalId,
      link: "/ekd/approvals",
    }));
  }

  reportAwaitingSignoff(input: {
    recipientIds: string[];
    submissionId: string;
    reportType: string;
    periodLabel: string;
    submittedByName: string;
  }): CreateNotification[] {
    return input.recipientIds.map((userId) => ({
      userId,
      type: NotificationType.REPORT_AWAITING_SIGNOFF,
      title: "Report awaiting executive sign-off",
      body: `${input.reportType} report — ${input.periodLabel} submitted by ${input.submittedByName}.`,
      resourceType: "report_submission",
      resourceId: input.submissionId,
      link: "/chairperson",
    }));
  }

  eventAwaitingApproval(input: {
    recipientIds: string[];
    eventId: string;
    eventName: string;
  }): CreateNotification[] {
    return input.recipientIds.map((userId) => ({
      userId,
      type: NotificationType.EVENT_AWAITING_APPROVAL,
      title: "Event awaiting publish approval",
      body: `Event "${input.eventName}" is pending publish approval.`,
      resourceType: "event",
      resourceId: input.eventId,
      link: "/chairperson",
    }));
  }

  meetingReminder(input: {
    recipientIds: string[];
    meetingId: string;
    meetingTitle: string;
    scheduledAt: Date;
    window: "24H" | "1H";
  }): CreateNotification[] {
    const type =
      input.window === "24H"
        ? NotificationType.MEETING_REMINDER_24H
        : NotificationType.MEETING_REMINDER_1H;
    const when = input.scheduledAt.toLocaleString("en-GB", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
    return input.recipientIds.map((userId) => ({
      userId,
      type,
      title: `Meeting reminder (${input.window === "24H" ? "24 hours" : "1 hour"})`,
      body: `"${input.meetingTitle}" starts ${when}.`,
      resourceType: "meeting",
      resourceId: input.meetingId,
      link: `/meetings/${input.meetingId}`,
    }));
  }
}
