import { Router } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import {
  createUser,
  deactivateUser,
  getUser,
  getUserStats,
  listUsers,
  reactivateUser,
  resetPassword,
  revokeUserSessions,
  updateUser,
} from "./users.controller.js";

export const usersRouter: Router = Router();

/**
 * BR-008: All user-management endpoints are restricted to SUPER_ADMIN
 * and CHAIRPERSON. requireAuth must run first to populate sessionUser.
 */
usersRouter.use(requireAuth());
usersRouter.use(
  requireScopePermission({
    allowedGlobalRoles: ["SUPER_ADMIN", "CHAIRPERSON"],
  })
);

usersRouter.post("/", createUser);
usersRouter.get("/", listUsers);
// FR-13.4: lifecycle counts independent of list page size
usersRouter.get("/stats", getUserStats);
usersRouter.get("/:id", getUser);
usersRouter.patch("/:id", updateUser);
usersRouter.post("/:id/reset-password", resetPassword);
usersRouter.post("/:id/deactivate", deactivateUser);
// PE-01 / FR-13.6: restore a deactivated account (unban).
usersRouter.post("/:id/reactivate", reactivateUser);
// PE-08 / FR-13.13: force sign-out of live sessions.
usersRouter.post("/:id/revoke-sessions", revokeUserSessions);
