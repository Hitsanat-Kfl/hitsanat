import { Router } from "express";
import {
  assignProgram,
  createEvent,
  getEvent,
  listEventAttendance,
  listEvents,
  recordEventAttendance,
  updateEventAttendance,
} from "./events.controller.js";

export const eventsRouter: Router = Router();

// Event CRUD (CORE-037)
eventsRouter.post("/", createEvent);
eventsRouter.get("/", listEvents);
eventsRouter.get("/:id", getEvent);

// Program Assignment (CORE-037)
eventsRouter.post("/:id/assign-program", assignProgram);

// Event Attendance (BES-016)
eventsRouter.post("/:id/attendance", recordEventAttendance);
eventsRouter.get("/:id/attendance", listEventAttendance);
eventsRouter.put("/:id/attendance/:attendanceId", updateEventAttendance);
