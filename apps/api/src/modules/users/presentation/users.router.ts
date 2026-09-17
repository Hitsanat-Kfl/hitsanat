import { Router } from "express";
import { requireAuth, requireScopePermission } from "@repo/auth";
import {
  createUser,
  deactivateUser,
  getUser,
  listUsers,
  resetPassword,
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
usersRouter.get("/:id", getUser);
usersRouter.patch("/:id", updateUser);
usersRouter.post("/:id/reset-password", resetPassword);
usersRouter.post("/:id/deactivate", deactivateUser);
