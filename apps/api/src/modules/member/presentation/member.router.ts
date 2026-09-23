import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import { createStage1, getById, list, update, updateStage2 } from "./member.controller.js";

export const memberRouter: Router = Router();

/**
 * BR-001 member registration is a Secretary/leadership action. Reads and
 * writes are gated by resource+action so BR-035 temporary grants can
 * unblock a selected user when the designated role holder is unavailable.
 */
memberRouter.use(requireAuth());

memberRouter.post(
  "/stage1",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    resource: "members",
    action: "C",
  }),
  createStage1
);
memberRouter.patch(
  "/:id/stage2",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    resource: "members",
    action: "U",
  }),
  updateStage2
);
memberRouter.put(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    resource: "members",
    action: "U",
  }),
  update
);
memberRouter.get(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    resource: "members",
    action: "R",
  }),
  list
);
memberRouter.get(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    resource: "members",
    action: "R",
  }),
  getById
);
