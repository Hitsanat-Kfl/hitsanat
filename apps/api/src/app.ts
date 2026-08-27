import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/index.js";
import { openApiSpec, swaggerJsonHandler } from "./infrastructure/swagger.js";
import { healthRouter } from "./presentation/routes/health.router.js";

export function createApp(): Express {
  const app = express();

  // Global Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Documentation (OpenAPI / Swagger)
  app.get("/docs.json", swaggerJsonHandler);
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: "Hitsanat Kifl API Documentation",
    })
  );

  // Health check endpoint at root level and versioned prefix
  app.use("/health", healthRouter);
  app.use(`${env.API_PREFIX}/health`, healthRouter);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: "Not Found",
      message: `Cannot ${req.method} ${req.path}`,
    });
  });

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled API Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message,
    });
  });

  return app;
}

export const app = createApp();
