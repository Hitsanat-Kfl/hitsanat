import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import {
  cancelMeeting,
  createMeeting,
  getMeeting,
  listMeetings,
  recordMeetingAttendance,
  recordMinutes,
  updateMeeting,
} from "./meetings.controller.js";

export const meetingsRouter: Router = Router();

// All meeting endpoints require a valid session.
meetingsRouter.use(requireAuth());

// Read access: all leadership roles (executive + sub-dept officers are
// invitees, so they must be able to see meetings).
meetingsRouter.get(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  listMeetings
);
meetingsRouter.get(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  getMeeting
);

// Create: CHAIRPERSON, SUB_CHAIRPERSON, SECRETARY (FR-13.1.1 / BR-019).
meetingsRouter.post(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  createMeeting
);

// Minutes: same trio as creation (BR-019 allows officers to record minutes).
meetingsRouter.post(
  "/:id/minutes",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  recordMinutes
);

// Update & cancel: the BR-019 trio (CHAIRPERSON, SUB_CHAIRPERSON, SECRETARY)
// per docs/api/endpoints.md §2.9 and business-rules.md BR-019.
meetingsRouter.patch(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  updateMeeting
);
meetingsRouter.delete(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  cancelMeeting
);

// Attendance: mark invitee attendance (POST /meetings/:id/attendance, §2.9).
// Same BR-019 trio as create/manage.
meetingsRouter.post(
  "/:id/attendance",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  recordMeetingAttendance
);
