import { Router } from "express";
import { createEvent, listEvents, getEvent, assignProgram } from "./events.controller.js";

export const eventsRouter: Router = Router();

// Event CRUD (CORE-037)
eventsRouter.post("/", createEvent);
eventsRouter.get("/", listEvents);
eventsRouter.get("/:id", getEvent);

// Program Assignment (CORE-037)
eventsRouter.post("/:id/assign-program", assignProgram);

// TODO OPS-007 (Backend Support - Israel): Event Attendance API
// POST /api/v1/events/:id/attendance - Record event attendance
// PUT /api/v1/events/:id/attendance/:id - Update event attendance

// TODO OPS-012 (Backend Support - Israel): Integration Tests
// Test event creation, program assignment, multi-member constraint

// TODO OPS-013 (Backend Support - Israel): OpenAPI Operations Documentation
// Document all event endpoints
