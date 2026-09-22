import { and, count, desc, eq, getDb } from "@repo/database";
import { annualMasterPlans, planApprovals } from "@repo/database/schema";
import type { PlanApproval } from "@repo/domain";
import { BusinessRuleViolationError, PlanApprovalStatus, ValidationError } from "@repo/domain";
import {
  notifyPlanApprovalDecided,
  notifyPlanApprovalRequested,
} from "../../notifications-link.js";

const VALID_STATUSES = ["Pending", "Approved", "Rejected", "Revision_Needed"];

function toPlanApproval(row: typeof planApprovals.$inferSelect): PlanApproval {
  return {
    id: row.id,
    annualPlanId: row.annualPlanId,
    requestedBy: row.requestedBy,
    changeSummary: row.changeSummary,
    status: row.status as PlanApproval["status"],
    reviewComments: row.reviewComments ?? undefined,
    reviewedBy: row.reviewedBy ?? undefined,
    reviewedAt: row.reviewedAt ? new Date(row.reviewedAt) : undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export class SubmitPlanApprovalUseCase {
  /**
   * FR-17.1: Ekd leader submits plan changes for executive approval.
   * Rejected/revision-needed changes must be revised before resubmission.
   */
  async execute(input: {
    annualPlanId: string;
    requestedBy: string;
    changeSummary: string;
    /** Display name of the requester, used for notification text. */
    requestedByName?: string;
  }): Promise<PlanApproval> {
    if (!input.changeSummary?.trim()) {
      throw new ValidationError("changeSummary is required");
    }

    const db = getDb();

    // One open (Pending) request per plan at a time.
    const openRequests = await db
      .select({ value: count() })
      .from(planApprovals)
      .where(
        and(eq(planApprovals.annualPlanId, input.annualPlanId), eq(planApprovals.status, "Pending"))
      );
    if ((openRequests[0]?.value ?? 0) > 0) {
      throw new BusinessRuleViolationError(
        "BR-025: a pending approval request already exists for this plan"
      );
    }

    const [row] = await db
      .insert(planApprovals)
      .values({
        annualPlanId: input.annualPlanId,
        requestedBy: input.requestedBy,
        changeSummary: input.changeSummary.trim(),
        status: "Pending",
      })
      .returning();

    // FR-17.1 / §2.24: notify Chairperson + Sub-Chairperson (fire-and-forget).
    notifyPlanApprovalRequested({
      approvalId: row.id,
      planId: row.annualPlanId,
      requestedByName: input.requestedByName ?? "Ekd Leader",
      changeSummary: row.changeSummary,
    });

    return toPlanApproval(row);
  }
}

export class ListPlanApprovalsUseCase {
  async execute(params: { annualPlanId?: string; status?: string }): Promise<PlanApproval[]> {
    const db = getDb();
    const filters = [];
    if (params.annualPlanId) filters.push(eq(planApprovals.annualPlanId, params.annualPlanId));
    if (params.status) {
      if (!VALID_STATUSES.includes(params.status)) {
        throw new ValidationError(`Invalid status: ${params.status}`);
      }
      filters.push(eq(planApprovals.status, params.status));
    }
    const rows = await db
      .select()
      .from(planApprovals)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(planApprovals.createdAt))
      .limit(100);
    return rows.map(toPlanApproval);
  }
}

export class ReviewPlanApprovalUseCase {
  /**
   * FR-17.1: Chairperson approves/rejects with comments. Rejected changes
   * require revision before resubmission. Approving sets the plan's
   * approvedBy/approvedAt and moves it to Active.
   */
  async execute(input: {
    approvalId: string;
    reviewedBy: string;
    decision: "Approved" | "Rejected" | "Revision_Needed";
    reviewComments?: string;
  }): Promise<PlanApproval> {
    if (
      input.decision !== PlanApprovalStatus.APPROVED &&
      input.decision !== PlanApprovalStatus.REJECTED &&
      input.decision !== PlanApprovalStatus.REVISION_NEEDED
    ) {
      throw new ValidationError("decision must be one of: Approved, Rejected, Revision_Needed");
    }
    if (input.decision !== "Approved" && !input.reviewComments?.trim()) {
      throw new ValidationError("reviewComments are required for Rejected/Revision_Needed");
    }

    const db = getDb();
    const existing = await db
      .select()
      .from(planApprovals)
      .where(eq(planApprovals.id, input.approvalId))
      .limit(1);
    if (existing.length === 0) {
      throw new ValidationError(`Plan approval not found: ${input.approvalId}`);
    }
    if (existing[0].status !== "Pending") {
      throw new BusinessRuleViolationError(
        "BR-025: only pending approval requests can be reviewed"
      );
    }

    const [row] = await db
      .update(planApprovals)
      .set({
        status: input.decision,
        reviewComments: input.reviewComments?.trim(),
        reviewedBy: input.reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(planApprovals.id, input.approvalId))
      .returning();

    // On approval, stamp the plan itself (BR-025: changes take effect).
    if (input.decision === "Approved") {
      await db
        .update(annualMasterPlans)
        .set({ approvedBy: input.reviewedBy, approvedAt: new Date(), status: "Active" })
        .where(eq(annualMasterPlans.id, row.annualPlanId));
    }

    // FR-17.1 / §2.24: notify the submitting Ekd leader of the decision
    // (fire-and-forget; audit records the actual acting executive per ADR-0018).
    notifyPlanApprovalDecided({
      approvalId: row.id,
      requestedById: existing[0].requestedBy,
      decision: input.decision,
      reviewComments: input.reviewComments,
    });

    return toPlanApproval(row);
  }
}
