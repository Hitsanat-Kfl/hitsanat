import { and, eq, getDb, inArray } from "@repo/database";
import { users } from "@repo/database/schema";
import { DrizzleNotificationsRepository } from "../infrastructure/repositories/notifications.repository.js";
import { NotificationsService } from "./notifications.service.js";

const notificationsRepository = new DrizzleNotificationsRepository();
const notificationsService = new NotificationsService(notificationsRepository);

/**
 * Active executive recipients (CHAIRPERSON + SUB_CHAIRPERSON) — the audience
 * for approval-request notifications per docs/api/endpoints.md §2.24 and
 * ADR-0018 (both roles receive the same notifications).
 */
export async function findExecutiveUserIds(): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(eq(users.status, "ACTIVE"), inArray(users.role, ["CHAIRPERSON", "SUB_CHAIRPERSON"]))
    );
  return rows.map((r) => r.id);
}

/**
 * Fire-and-forget notification helpers. Failures are logged, never thrown —
 * a notification outage must not fail the underlying business action.
 */
async function safeCreate(label: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch (error) {
    console.error(`[notifications] failed to create ${label}:`, error);
  }
}

export function notifyPlanApprovalRequested(input: {
  approvalId: string;
  planId: string;
  requestedByName: string;
  changeSummary: string;
}): Promise<void> {
  return safeCreate("PLAN_APPROVAL_REQUESTED", async () => {
    const recipientIds = await findExecutiveUserIds();
    await notificationsService.createMany(
      notificationsService.planApprovalRequested({ ...input, recipientIds })
    );
  });
}

export function notifyPlanApprovalDecided(input: {
  approvalId: string;
  requestedById: string;
  decision: string;
  reviewComments?: string;
}): Promise<void> {
  return safeCreate("PLAN_APPROVAL_DECIDED", async () => {
    if (!input.requestedById) return;
    await notificationsService.createMany(
      notificationsService.planApprovalDecided({
        recipientIds: [input.requestedById],
        approvalId: input.approvalId,
        decision: input.decision,
        reviewComments: input.reviewComments,
      })
    );
  });
}

export function notifyReportAwaitingSignoff(input: {
  submissionId: string;
  reportType: string;
  periodLabel: string;
  submittedByName: string;
}): Promise<void> {
  return safeCreate("REPORT_AWAITING_SIGNOFF", async () => {
    const recipientIds = await findExecutiveUserIds();
    await notificationsService.createMany(
      notificationsService.reportAwaitingSignoff({ ...input, recipientIds })
    );
  });
}

export function notifyEventAwaitingApproval(input: {
  eventId: string;
  eventName: string;
}): Promise<void> {
  return safeCreate("EVENT_AWAITING_APPROVAL", async () => {
    const recipientIds = await findExecutiveUserIds();
    await notificationsService.createMany(
      notificationsService.eventAwaitingApproval({ ...input, recipientIds })
    );
  });
}
