import { Router } from "express";
import {
  createAssessment,
  listAssessments,
  listScoresByAssessment,
  listScoresByChild,
  recordScore,
} from "./academic.controller.js";

export const academicRouter: Router = Router();

// Assessment CRUD
academicRouter.post("/assessments", createAssessment);
academicRouter.get("/assessments", listAssessments);

// Score Recording
academicRouter.post("/assessments/:assessmentId/scores", recordScore);
academicRouter.get("/assessments/:assessmentId/scores", listScoresByAssessment);

// Score Queries
academicRouter.get("/children/:childId/scores", listScoresByChild);
