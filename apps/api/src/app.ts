import { getAuth } from "@repo/auth";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/index.js";
import { openApiSpec, swaggerJsonHandler } from "./infrastructure/swagger.js";
import { announcementsRouter } from "./modules/announcements/presentation/announcements.router.js";
import { attendanceRouter } from "./modules/attendance/presentation/attendance.router.js";
import { childRouter } from "./modules/child/presentation/child.router.js";
import { eventsRouter } from "./modules/events/presentation/events.router.js";
import { familyRouter } from "./modules/family/presentation/family.router.js";
import { memberRouter } from "./modules/member/presentation/member.router.js";
import { planningRouter } from "./modules/planning/presentation/planning.router.js";
import { publicRouter } from "./modules/public/presentation/public.router.js";
import { reportsRouter } from "./modules/reports/presentation/reports.router.js";
import { subDepartmentRouter } from "./modules/sub-department/presentation/sub-department.router.js";
import { healthRouter } from "./presentation/routes/health.router.js";
import { errorHandler, notFoundHandler } from "./shared/middleware/error-handler.js";
import { authRateLimiter, publicRateLimiter } from "./shared/middleware/rate-limiter.js";

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

  // Better Auth handlers with rate limiting
  app.all("/api/v1/auth/*", authRateLimiter, async (req, res) => {
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
        // biome-ignore lint/suspicious/noExplicitAny: Better Auth Web API Request type mismatch
      } as any);

      res.status(response.status);
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }

      const body = await response.text();
      res.send(body);
    } catch (error) {
      console.error("Auth handler error:", error);
      res.status(500).json({
        type: "https://hitsanat.kfl/errors/500",
        title: "Internal Server Error",
        status: 500,
      });
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

  // Family routes
  app.use(`${env.API_PREFIX}/families`, familyRouter);

  // Children & Parents routes
  app.use(`${env.API_PREFIX}/children`, childRouter);

  // Sub-Department routes
  app.use(`${env.API_PREFIX}/sub-departments`, subDepartmentRouter);

  // Planning routes
  app.use(`${env.API_PREFIX}/annual-plans`, planningRouter);

  // Attendance routes
  app.use(`${env.API_PREFIX}/attendance`, attendanceRouter);

  // Events routes
  app.use(`${env.API_PREFIX}/events`, eventsRouter);

  // Reports routes
  app.use(`${env.API_PREFIX}/reports`, reportsRouter);

  // Announcements routes
  app.use(`${env.API_PREFIX}/announcements`, announcementsRouter);

  // Public routes with rate limiting (no auth required)
  app.use(`${env.API_PREFIX}/public`, publicRateLimiter, publicRouter);

  // 404 Handler
  app.use(notFoundHandler);

  // Global Error Handler (RFC 7807)
  app.use(errorHandler);

  return app;
}

export const app = createApp();
