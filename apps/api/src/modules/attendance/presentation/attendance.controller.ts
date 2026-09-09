import type { Request, Response } from "express";
import { DrizzleAttendanceRepository } from "../infrastructure/repositories/attendance.repository.js";
import { CreateSessionUseCase } from "../application/use-cases/create-session.use-case.js";
import { ListSessionsUseCase } from "../application/use-cases/list-sessions.use-case.js";
import { SeedAttendanceUseCase } from "../application/use-cases/seed-attendance.use-case.js";
import { VerifyAttendanceUseCase } from "../application/use-cases/verify-attendance.use-case.js";
import { AssignTransportUseCase } from "../application/use-cases/assign-transport.use-case.js";

const attendanceRepository = new DrizzleAttendanceRepository();

export async function createSession(req: Request, res: Response) {
  try {
    const useCase = new CreateSessionUseCase(attendanceRepository);
    const session = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listSessions(req: Request, res: Response) {
  try {
    const useCase = new ListSessionsUseCase(attendanceRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const sessionType = req.query.sessionType as string | undefined;
    const result = await useCase.execute({ page, limit, sessionType });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function seedAttendance(req: Request, res: Response) {
  try {
    const useCase = new SeedAttendanceUseCase(attendanceRepository);
    const records = await useCase.execute(req.params.id as string, req.body.recordedBy || "system");
    res.status(201).json({ success: true, data: records });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function verifyAttendance(req: Request, res: Response) {
  try {
    const useCase = new VerifyAttendanceUseCase(attendanceRepository);
    const record = await useCase.executeSingle(
      req.params.recordId as string,
      req.body.status,
      req.body.recordedBy || "system"
    );
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function batchVerifyAttendance(req: Request, res: Response) {
  try {
    const useCase = new VerifyAttendanceUseCase(attendanceRepository);
    const records = await useCase.executeBatch(req.body.records);
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function assignTransport(req: Request, res: Response) {
  try {
    const useCase = new AssignTransportUseCase(attendanceRepository);
    const records = await useCase.execute({
      sessionId: req.params.id as string,
      assignments: req.body.assignments,
      assignedBy: req.body.assignedBy || "system",
    });
    res.status(201).json({ success: true, data: records });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}
