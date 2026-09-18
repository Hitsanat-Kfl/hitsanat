import { requireAuth, requireScopePermission } from "@repo/auth";
import type { Router } from "express";
import { Router as routerFactory } from "express";
import { listAuditLogs } from "./audit.controller.js";

export const auditRouter: Router = routerFactory();

/**
 * The audit trail exposes who did what — readable only by the same roles
 * that can perform administrative actions.
 */
auditRouter.use(requireAuth());
auditRouter.use(
  requireScopePermission({
    allowedGlobalRoles: ["SUPER_ADMIN", "CHAIRPERSON"],
  })
);

auditRouter.get("/", listAuditLogs);
