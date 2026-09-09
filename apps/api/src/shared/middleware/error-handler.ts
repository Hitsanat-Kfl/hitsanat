import type { Request, Response, NextFunction } from "express";
import { ApiError, type ProblemDetail } from "../errors/api-error.js";

/**
 * RFC 7807 Error Handler Middleware
 * Converts errors to standardized Problem Detail responses
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error("API Error:", err);

  if (err instanceof ApiError) {
    const problem: ProblemDetail = {
      type: err.type,
      title: err.message,
      status: err.status,
      errors: err.errors,
    };
    res.status(err.status).json(problem);
    return;
  }

  // Generic error handling
  const status = 500;
  const problem: ProblemDetail = {
    type: `https://hitsanat.kfl/errors/${status}`,
    title: "Internal Server Error",
    status,
    detail: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message,
  };
  res.status(status).json(problem);
}

/**
 * 404 Handler Middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  const problem: ProblemDetail = {
    type: "https://hitsanat.kfl/errors/404",
    title: "Not Found",
    status: 404,
    detail: `Cannot ${req.method} ${req.path}`,
  };
  res.status(404).json(problem);
}
