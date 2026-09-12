import { Router } from "express";
import {
  assignTransport,
  batchVerifyAttendance,
  createSession,
  listSessions,
  seedAttendance,
  verifyAttendance,
} from "./attendance.controller.js";

export const attendanceRouter: Router = Router();

// Session Management (CORE-033)
attendanceRouter.post("/sessions", createSession);
attendanceRouter.get("/sessions", listSessions);

// Auto-Seeding (CORE-034)
attendanceRouter.post("/sessions/:id/seed", seedAttendance);

// Verification (CORE-035)
attendanceRouter.put("/records/:recordId", verifyAttendance);
attendanceRouter.put("/sessions/:id/records", batchVerifyAttendance);

// Transport Assignment (CORE-036)
attendanceRouter.post("/sessions/:id/transport", assignTransport);

// TODO OPS-005 (Backend Support - Israel): Academic Assessment API
// POST /api/v1/academic/assessments - Create assessment
// POST /api/v1/academic/scores - Record score
// GET /api/v1/academic/scores - Query scores

// TODO OPS-007 (Backend Support - Israel): Event Attendance API
// POST /api/v1/events/:id/attendance - Record event attendance
// PUT /api/v1/events/:id/attendance/:id - Update event attendance

// TODO OPS-012 (Backend Support - Israel): Integration Tests
// Test full attendance lifecycle: session creation → auto-seeding → verification → batch confirm
// Verify BR-020 auto-seeding, BR-014 multi-member constraint, BR-022 Kutitr authority

// TODO OPS-013 (Backend Support - Israel): OpenAPI Operations Documentation
// Document all attendance, transport, academic, and event endpoints
