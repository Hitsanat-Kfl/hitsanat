import type { BaseEntity } from "../base.js";

export enum MeetingStatus {
  SCHEDULED = "Scheduled",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum InviteeResponseStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  DECLINED = "Declined",
  ATTENDED = "Attended",
  ABSENT = "Absent",
}

export interface Meeting extends BaseEntity {
  title: string;
  description?: string;
  scheduledAt: Date;
  durationMinutes: number;
  location?: string;
  agenda?: string;
  status: MeetingStatus;
  minutes?: string;
  minutesRecordedBy?: string;
  minutesRecordedAt?: Date;
  createdBy: string;
}

export interface MeetingInvitee extends BaseEntity {
  meetingId: string;
  userId: string;
  memberId?: string;
  responseStatus: InviteeResponseStatus;
}

export type CreateMeeting = Omit<Meeting, "id" | "createdAt" | "updatedAt">;
export type UpdateMeeting = Partial<Omit<Meeting, "id" | "createdAt" | "createdBy">>;
export type CreateMeetingInvitee = Omit<MeetingInvitee, "id" | "createdAt">;

/**
 * Plan approval workflow (FR-17.1 / BR-025).
 * EKD_LEADER submits plan changes; CHAIRPERSON reviews with comments.
 */
export enum PlanApprovalStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  REVISION_NEEDED = "Revision_Needed",
}

export interface PlanApproval extends BaseEntity {
  annualPlanId: string;
  requestedBy: string;
  changeSummary: string;
  status: PlanApprovalStatus | string;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export type CreatePlanApproval = Omit<PlanApproval, "id" | "createdAt" | "updatedAt">;
