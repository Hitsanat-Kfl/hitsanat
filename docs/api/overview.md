# API Design Overview & Standards

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Base URL:** `https://api.hitsanat.org/api/v1` (Production) / `http://localhost:4000/api/v1` (Development)  
**API Specification:** RESTful JSON + OpenAPI 3.1 (Swagger UI at `/api/docs`)  

---

## 1. RESTful Architectural Conventions

```mermaid
graph LR
    Request[HTTP Request] --> GlobalMiddlewares[CORS / Helmet / Logger]
    GlobalMiddlewares --> AuthGuard[Better Auth Session Guard]
    AuthGuard --> ScopeGuard[Scoped Permission Guard]
    ScopeGuard --> ZodValidator[Zod Schema Validation]
    ZodValidator --> Controller[Express Controller]
    Controller --> UseCase[Application Use Case]
    UseCase --> JSONResponse[Standard JSON Envelope Response]
```

### 1.1 URL Versioning & Resource Naming
- All routes are prefixed with `/api/v1/`.
- Resource paths use lowercase plural nouns (e.g. `/api/v1/members`, `/api/v1/children`, `/api/v1/annual-plans`).
- Nested relationships use logical hierarchical URIs:
  - `/api/v1/children/:id/parents`
  - `/api/v1/annual-plans/:id/goals`
  - `/api/v1/annual-plans/:id/activities`
  - `/api/v1/program-sessions/:id/attendance`

---

## 2. Standard API Response Envelope

Every endpoint responds with a standardized JSON envelope structure:

### 2.1 Success Response (`HTTP 200 OK` / `HTTP 201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-08-25T17:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 142,
      "totalPages": 8
    }
  }
}
```

### 2.2 Error Response (`HTTP 4xx` / `HTTP 5xx`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided input data failed validation checks.",
    "details": [
      {
        "field": "phoneNumber",
        "message": "Phone number must be a valid Ethiopian mobile format."
      }
    ]
  },
  "meta": {
    "timestamp": "2026-08-25T17:30:00.000Z"
  }
}
```

---

## 3. Querying, Pagination, Filtering & Sorting

- **Pagination:** Default pagination uses `page` (default: 1) and `limit` (default: 20, max: 100).
- **Sorting:** Specified via `sort` parameter (e.g., `sort=full_name:asc` or `sort=created_at:desc`).
- **Date Filtering:** Query parameters accept Ethiopian calendar filters (`ethiopianYear=2016&ethiopianMonth=Tikimt`) or standard ISO date ranges (`startDate=2026-09-01&endDate=2026-09-30`).
