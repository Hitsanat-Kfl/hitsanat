# System Architecture Document

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Architecture Patterns:** Modular Monolith, Domain-Driven Design (DDD), Clean Architecture, Feature-Based Modules  

---

## 1. High-Level Architectural Context (C4 Context Diagram)

```mermaid
C4Context
    title System Context Diagram for Hitsanat Kifl Management System

    Person(leader, "Ministry Leader", "Chairperson, Secretary, or Sub-Department Leader managing operations.")
    Person(member, "Regular Member", "University student servant (viewing public updates & announcements).")
    Person(public, "Parent / General Public", "Community member checking announcements and event countdowns.")

    Enterprise_Boundary(b0, "Hitsanat Kifl Digital Ecosystem") {
        System(adminApp, "Management Portal (apps/admin)", "Next.js 15 + shadcn/ui. Role-based administrative dashboard.")
        System(portfolioApp, "Portfolio Website (apps/portfolio)", "Next.js 15. Public showcase, event countdowns, announcements.")
        System(apiApp, "Core API Server (apps/api)", "Express.js + TypeScript + Drizzle ORM. Domain logic and data services.")
        System(tgApp, "Telegram Bot Service (apps/telegram)", "Standalone worker posting announcements and schedule reminders.")
    }

    SystemDb_Ext(supabaseDb, "PostgreSQL Database (Supabase)", "Managed relational database storing all core operational data.")
    System_Ext(telegramApi, "Telegram Bot API", "External messaging infrastructure for group notifications.")

    Rel(leader, adminApp, "Manages data, plans, and attendance via", "HTTPS")
    Rel(member, portfolioApp, "Views public programs and announcements", "HTTPS")
    Rel(public, portfolioApp, "Views public information and countdowns", "HTTPS")
    Rel(leader, tgApp, "Receives alerts in", "Telegram")

    Rel(adminApp, apiApp, "Calls secure endpoints using Better Auth session", "JSON / HTTPS")
    Rel(portfolioApp, apiApp, "Queries public announcements & stats", "JSON / HTTPS")
    Rel(apiApp, supabaseDb, "Executes queries and transactions via Drizzle", "PostgreSQL / TLS")
    Rel(tgApp, apiApp, "Polls or receives published announcement events", "Internal / API")
    Rel(tgApp, telegramApi, "Posts formatted messages to church group", "HTTPS")
```

---

## 2. Monorepo Repository Structure (Turborepo & pnpm)

The codebase is organized as a Turborepo monorepo with strict package boundaries:

```text
Hitsanat/
├── apps/
│   ├── admin/               # Next.js 15 Admin Portal (Leadership only)
│   ├── api/                 # Express.js + TypeScript Backend Service
│   ├── portfolio/           # Next.js 15 Public Showcase Website
│   └── telegram/            # Standalone Telegram Bot Notification Service
│
├── packages/
│   ├── auth/                # Better Auth configuration and session guards
│   ├── calendar/            # Ethiopian Calendar conversion (ethiopian-calendar-new)
│   ├── config/              # Shared TypeScript & Biome configuration
│   ├── database/            # Drizzle ORM schema declarations & migrations
│   ├── domain/              # Core business entities, value objects & calculation engines
│   ├── logger/              # Structured logging utility
│   ├── permissions/         # Scoped RBAC matrices, constants & evaluation helpers
│   ├── ui/                  # Shared shadcn/ui components (Preset: b1D0f7S7)
│   └── validation/          # Shared Zod schemas and API request/response contracts
│
├── docs/                    # Complete Technical Documentation System
├── turbo.json               # Monorepo task pipeline configuration
├── biome.json               # Code formatting, linting & import rules
├── docker-compose.yml       # Local PostgreSQL development container
└── package.json             # Root workspace configuration
```

---

## 3. Clean Architecture Layering in `apps/api`

The backend follows Clean Architecture principles, ensuring that business logic remains independent of frameworks, databases, and UI components:

```mermaid
graph TD
    subgraph Presentation Layer [1. Presentation Layer - Express.js]
        Controllers[Express Controllers & Routers]
        Middlewares[Auth & RBAC Middlewares]
        OpenAPI[Swagger / OpenAPI Documentation]
    end

    subgraph Application Layer [2. Application Layer]
        UseCases[Application Use Cases / Command Handlers]
        DTOs[Data Transfer Objects & Mappers]
        EventHandlers[Domain Event Handlers]
    end

    subgraph Domain Layer [3. Domain Layer - Enterprise Core]
        Aggregates[Domain Aggregates & Entities]
        ValueObjects[Value Objects]
        CalcEngines[Planning Weight & Roll-Up Engines]
        DomainServices[Domain Services & Business Invariants]
        RepoInterfaces[Repository Interfaces]
    end

    subgraph Infrastructure Layer [4. Infrastructure Layer]
        DrizzleRepos[Drizzle Repository Implementations]
        Postgres[Supabase PostgreSQL Database]
        CalendarAdapter[Ethiopian Calendar Adapter]
        AuthAdapter[Better Auth Adapter]
    end

    Controllers --> UseCases
    Middlewares --> UseCases
    UseCases --> Aggregates
    UseCases --> DomainServices
    UseCases --> RepoInterfaces
    DrizzleRepos -.->|Implements| RepoInterfaces
    DrizzleRepos --> Postgres
    Controllers --> OpenAPI
```

### Layer Responsibilities:
1. **Domain Layer (`packages/domain` & `apps/api/src/modules/*/domain`):**
   - Contains pure TypeScript business logic, entities, value objects, and domain exceptions.
   - Zero external framework dependencies (no Express, no Drizzle imports in domain logic).
2. **Application Layer (`apps/api/src/modules/*/application`):**
   - Coordinates use cases, transaction orchestration, domain event publishing, and DTO transformations.
3. **Infrastructure Layer (`apps/api/src/modules/*/infrastructure` & `packages/database`):**
   - Implements repository interfaces using Drizzle ORM, executes database transactions, handles external network services.
4. **Presentation Layer (`apps/api/src/modules/*/presentation`):**
   - Express route handlers, input validation via Zod, HTTP status code mapping, Swagger/OpenAPI docs generation.
