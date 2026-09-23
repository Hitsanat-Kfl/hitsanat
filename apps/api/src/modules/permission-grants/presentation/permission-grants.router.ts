import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import {
  createPermissionGrant,
  listPermissionGrants,
  revokePermissionGrant,
} from "./permission-grants.controller.js";

export const permissionGrantsRouter: Router = Router();

/**
 * BR-035 / ADR-0019: temporary permission grants are SUPER_ADMIN-only.
 * Controllers re-check the session role as a defensive double guard.
 */
permissionGrantsRouter.use(requireAuth());
permissionGrantsRouter.use(requireScopePermission({ allowedGlobalRoles: ["SUPER_ADMIN"] }));

permissionGrantsRouter.post("/", createPermissionGrant);
permissionGrantsRouter.get("/", listPermissionGrants);
permissionGrantsRouter.post("/:id/revoke", revokePermissionGrant);
