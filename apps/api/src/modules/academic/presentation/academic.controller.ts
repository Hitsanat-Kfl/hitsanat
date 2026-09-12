import type { Request, Response } from "express";
import { CreateAssessmentUseCase } from "../application/use-cases/create-assessment.use-case.js";
import { ListAssessmentsUseCase } from "../application/use-cases/list-assessments.use-case.js";
import { ListScoresUseCase } from "../application/use-cases/list-scores.use-case.js";
import { RecordScoreUseCase } from "../application/use-cases/record-score.use-case.js";
import { DrizzleAcademicRepository } from "../infrastructure/repositories/academic.repository.js";

const academicRepository = new DrizzleAcademicRepository();

export async function createAssessment(req: Request, res: Response) {
  try {
    const useCase = new CreateAssessmentUseCase(academicRepository);
    const assessment = await useCase.execute(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listAssessments(req: Request, res: Response) {
  try {
    const useCase = new ListAssessmentsUseCase(academicRepository);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const subjectTopic = req.query.subjectTopic as string | undefined;
    const assessmentType = req.query.assessmentType as string | undefined;
    const result = await useCase.execute({ page, limit, subjectTopic, assessmentType });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function recordScore(req: Request, res: Response) {
  try {
    const useCase = new RecordScoreUseCase(academicRepository);
    const score = await useCase.execute({
      academicAssessmentId: req.params.assessmentId as string,
      ...req.body,
    });
    res.status(201).json({ success: true, data: score });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, error: message });
  }
}

export async function listScoresByAssessment(req: Request, res: Response) {
  try {
    const useCase = new ListScoresUseCase(academicRepository);
    const scores = await useCase.executeByAssessment(req.params.assessmentId as string);
    res.status(200).json({ success: true, data: scores });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}

export async function listScoresByChild(req: Request, res: Response) {
  try {
    const useCase = new ListScoresUseCase(academicRepository);
    const scores = await useCase.executeByChild(req.params.childId as string);
    res.status(200).json({ success: true, data: scores });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
}
