# Swagger UI & API Explorer

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Swagger UI Route:** `/api/docs`  
**JSON Spec Route:** `/api/docs/openapi.json`  

---

## 1. Swagger UI Setup in Express

The Swagger UI is served via `swagger-ui-express` directly from `apps/api`:

```typescript
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from './openapi-generator';

const openApiDoc = generateOpenApiDocument();

// Serve interactive Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc, {
  customSiteTitle: 'Hitsanat Kifl API Documentation',
  customCss: '.swagger-ui .topbar { background-color: #1e293b; }',
}));

// Expose raw OpenAPI JSON
app.get('/api/docs/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiDoc);
});
```

---

## 2. Environment Exposure & Security Safeguards

- **Development & Staging:** Full, unauthenticated access to `/api/docs` for rapid frontend-backend development and testing.
- **Production:** 
  - Swagger UI is enabled by default to allow technical leads and developers to verify live contracts.
  - Sensitive internal diagnostics and admin debug endpoints are tagged with `x-internal: true` and excluded from the public OpenAPI documentation build.
  - Rate limiting is applied to `/api/docs` to prevent scraping abuse.
