import { Router } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import {
  cancelMeeting,
  createMeeting,
  getMeeting,
  listMeetings,
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

// Update & cancel: CHAIRPERSON only (FR-13.1.1: update/cancel restricted).
meetingsRouter.patch(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON"],
  }),
  updateMeeting
);
meetingsRouter.delete(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON"],
  }),
  cancelMeeting
);
