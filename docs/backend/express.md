# Backend: Express.js Server Setup & Middleware Pipeline

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**HTTP Framework:** Express.js 4/5 + TypeScript  

---

## 1. Server Lifecycle & Bootstrap (`apps/api/src/server.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/index.js';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler';

export function createApp(): Express {
  const app = express();

  // 1. Core Security & Parsing Middlewares
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Health Check (Railway keep-alive)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // 3. API Documentation (Swagger UI at /docs, OpenAPI JSON at /docs.json)
  app.get('/docs.json', swaggerJsonHandler);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  // 4. Feature Module Routes
  registerModuleRoutes(app);

  // 5. 404 + Global Error Handling Middleware (RFC 7807)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
```

---

## 2. Statelessness & Process Management

- The API contains **zero state** in local RAM or local filesystem.
- Graceful shutdown handles `SIGTERM` and `SIGINT` signals, closing active database connections before terminating.
