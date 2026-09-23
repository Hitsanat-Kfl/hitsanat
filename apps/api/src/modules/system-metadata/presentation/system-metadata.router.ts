import { requireAuth, requireScopePermission } from "@repo/auth";
import type { Router } from "express";
import { Router as routerFactory } from "express";
import { listSystemMetadata } from "./system-metadata.controller.js";

export const systemMetadataRouter: Router = routerFactory();

/**
 * FR-13.4: Super Admin dashboard seed/migration status only.
 */
systemMetadataRouter.use(requireAuth());
systemMetadataRouter.use(
  requireScopePermission({
    allowedGlobalRoles: ["SUPER_ADMIN"],
  })
);

systemMetadataRouter.get("/", listSystemMetadata);
