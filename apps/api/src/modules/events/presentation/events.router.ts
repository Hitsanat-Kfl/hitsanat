import { requireAuth, requireScopePermission } from "@repo/auth";
import { Router } from "express";
import {
  approveEvent,
  assignProgram,
  createEvent,
  getEvent,
  listEventAttendance,
  listEvents,
  recordEventAttendance,
  updateEventAttendance,
} from "./events.controller.js";

export const eventsRouter: Router = Router();

// All event endpoints require a valid session.
eventsRouter.use(requireAuth());

// Event CRUD (CORE-037) — leadership users.
eventsRouter.post(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
    requiredSubDeptCode: "EKD",
    allowedSubDeptRoles: ["Leader", "Sub-Leader"],
  }),
  createEvent
);
eventsRouter.get(
  "/",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  listEvents
);
eventsRouter.get(
  "/:id",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  getEvent
);

// Program Assignment (CORE-037) — Ekd assigns program segments.
eventsRouter.post(
  "/:id/assign-program",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
    requiredSubDeptCode: "EKD",
    allowedSubDeptRoles: ["Leader", "Sub-Leader"],
  }),
  assignProgram
);

// Executive approval & publish flag (endpoints.md §2.5, ADR-0018).
eventsRouter.patch(
  "/:id/approve",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON"],
  }),
  approveEvent
);

// Event Attendance (BES-016)
eventsRouter.post(
  "/:id/attendance",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  recordEventAttendance
);
eventsRouter.get(
  "/:id/attendance",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  listEventAttendance
);
eventsRouter.put(
  "/:id/attendance/:attendanceId",
  requireScopePermission({
    allowedGlobalRoles: ["CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"],
  }),
  updateEventAttendance
);
