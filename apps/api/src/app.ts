import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { getAuth } from "@repo/auth";
import { env } from "./config/index.js";
import { openApiSpec, swaggerJsonHandler } from "./infrastructure/swagger.js";
import { healthRouter } from "./presentation/routes/health.router.js";
import { memberRouter } from "./modules/member/presentation/member.router.js";

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

  // Better Auth handlers
  app.all("/api/v1/auth/*", async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
    }

    try {
      // Cast to any to resolve type mismatch between Express Request and Web API Request
      // Better Auth expects standard Web API Request but Express has a different shape
      const response = await getAuth().handler({
        method: req.method,
        headers,
        url: url.toString(),
        body: req.body,
      } as any);

      res.status(response.status);
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }

      const body = await response.text();
      res.send(body);
    } catch (error) {
      console.error("Auth handler error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

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

  // Member routes
  app.use(`${env.API_PREFIX}/members`, memberRouter);

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
