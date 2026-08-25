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
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { logger } from '@hitsanat/logger';
import { globalErrorHandler } from './shared/middlewares/error-handler';
import { registerModuleRoutes } from './modules';
import { setupSwaggerDocs } from './shared/docs/swagger';

export function createServer() {
  const app = express();

  // 1. Core Security & Parsing Middlewares
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  // 2. Health Check (Render keep-alive)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // 3. API Documentation
  setupSwaggerDocs(app);

  // 4. Feature Module Routes
  registerModuleRoutes(app);

  // 5. Global Error Handling Middleware
  app.use(globalErrorHandler);

  return app;
}
```

---

## 2. Statelessness & Process Management

- The API contains **zero state** in local RAM or local filesystem.
- Graceful shutdown handles `SIGTERM` and `SIGINT` signals, closing active database connections before terminating.
