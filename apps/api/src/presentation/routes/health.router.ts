import type { HealthResponse } from "@repo/schemas";
import { type Request, type Response, Router } from "express";
import { env } from "../../config/index.js";

export const healthRouter: Router = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  const responseData: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "hitsanat-api",
    version: "1.0.0",
    environment: env.NODE_ENV,
  };

  res.status(200).json(responseData);
});
