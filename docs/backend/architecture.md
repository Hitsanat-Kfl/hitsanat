# Backend Architecture Specification

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Framework:** Express.js + TypeScript (ADR-0008)  
**Database Tooling:** Drizzle ORM + PostgreSQL  

---

## 1. Clean Architecture & Modular Monolith

The backend application (`apps/api`) encapsulates all domain business logic inside clean, decoupled layers:

```mermaid
graph TD
    subgraph Express Interface / Presentation
        Router[Express Routers & Middlewares]
        OpenAPIHandler[Swagger / OpenAPI Schema Engine]
    end

    subgraph Application Layer
        Commands[Command & Query Handlers]
        DTOs[Zod Validated DTOs]
    end

    subgraph Pure Domain Core
        Entities[Domain Entities & Aggregates]
        Engines[Planning Calculation & Weight Engines]
        DomainEvents[Domain Events & Invariants]
    end

    subgraph Infrastructure
        DrizzleAdapter[Drizzle Repositories]
        PostgresDB[(Supabase PostgreSQL)]
        CalendarAdapter[Ethiopian Calendar Adapter]
    end

    Router --> Commands
    Commands --> Entities
    Commands --> Engines
    Commands --> DrizzleAdapter
    DrizzleAdapter --> PostgresDB
```

### Core Invariant:
Business rules and domain engines never import Express, HTTP request objects, or database-specific query builders directly. They operate on pure TypeScript domain models.
