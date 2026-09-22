import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notifications.controller.js";

export const notificationsRouter: Router = Router();

// Every leadership user may read/manage their own feed; MEMBER_REGULAR has no
// admin portal access (ADR-0007) so the guard excludes it implicitly.
notificationsRouter.use(requireAuth());
notificationsRouter.use(
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  })
);

notificationsRouter.get("/", listNotifications);
notificationsRouter.get("/unread-count", getUnreadCount);
notificationsRouter.patch("/:id/read", markNotificationRead);
notificationsRouter.post("/read-all", markAllNotificationsRead);
