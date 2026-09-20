import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/index.js";
import { openApiSpec, swaggerJsonHandler } from "./infrastructure/swagger.js";
import { auditRouter } from "./modules/audit/presentation/audit.router.js";
import { announcementsRouter } from "./modules/announcements/presentation/announcements.router.js";
import { academicRouter } from "./modules/academic/presentation/academic.router.js";
import { attendanceRouter } from "./modules/attendance/presentation/attendance.router.js";
import { childRouter } from "./modules/child/presentation/child.router.js";
import { eventsRouter } from "./modules/events/presentation/events.router.js";
import { familyRouter } from "./modules/family/presentation/family.router.js";
import { memberRouter } from "./modules/member/presentation/member.router.js";
import { planningRouter } from "./modules/planning/presentation/planning.router.js";
import { publicRouter } from "./modules/public/presentation/public.router.js";
import { reportsRouter } from "./modules/reports/presentation/reports.router.js";
import { subDepartmentRouter } from "./modules/sub-department/presentation/sub-department.router.js";
import { usersRouter } from "./modules/users/presentation/users.router.js";
import { authRouter } from "./presentation/routes/auth.router.js";
import { healthRouter } from "./presentation/routes/health.router.js";
import { errorHandler, notFoundHandler } from "./shared/middleware/error-handler.js";
import { publicRateLimiter } from "./shared/middleware/rate-limiter.js";
import { breakGlassAuditMiddleware } from "./shared/middleware/break-glass-audit.js";

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

  // PE-07 / FR-13.12: audit write actions performed under the SUPER_ADMIN
  // permission bypass ("break-glass" actions). Runs after body parsing so
  // req.sessionUser (set by requireAuth inside routers) is available.
  app.use(breakGlassAuditMiddleware);

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

  // Auth session endpoint (Supabase JWT verification)
  app.use(`${env.API_PREFIX}/auth`, authRouter);

  // User management (BR-008: SUPER_ADMIN & CHAIRPERSON only)
  app.use(`${env.API_PREFIX}/users`, usersRouter);

  // System audit trail (SUPER_ADMIN & CHAIRPERSON only)
  app.use(`${env.API_PREFIX}/audit-logs`, auditRouter);

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

  // Academic routes
  app.use(`${env.API_PREFIX}/academic`, academicRouter);

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
