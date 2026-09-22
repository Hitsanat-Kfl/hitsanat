import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import {
  createAnnouncement,
  listAnnouncements,
  publishAnnouncement,
} from "./announcements.controller.js";

export const announcementsRouter: Router = Router();

// All announcement endpoints require a valid session.
announcementsRouter.use(requireAuth());

// Announcement CRUD (CORE-040)
announcementsRouter.post(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    requiredSubDeptCode: "EKD",
    allowedSubDeptRoles: ["Leader", "Sub-Leader"],
  }),
  createAnnouncement
);
announcementsRouter.get(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  listAnnouncements
);

// Publish (CORE-040) — RBAC: Ekd and Chairperson can publish (FR-11.1).
// Ekd leaders resolve via EKD sub-department scope (resolveUserScopes places
// only the four executive roles in globalRoles).
announcementsRouter.put(
  "/:id/publish",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
    requiredSubDeptCode: "EKD",
    allowedSubDeptRoles: ["Leader", "Sub-Leader"],
  }),
  publishAnnouncement
);
