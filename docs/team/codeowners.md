# GitHub CODEOWNERS Specification

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Config File:** `.github/CODEOWNERS`  

---

## 1. Ownership Rules & Path Mapping

This file defines the code review ownership rules enforced by GitHub on Pull Requests:

```text
# Global Fallback - Core Lead has overall technical oversight
* @abrham-core-lead

# Frontend Applications & UI
/apps/admin/                @frontend-lead @frontend-dev-2 @abrham-core-lead
/apps/portfolio/            @frontend-lead @frontend-dev-2 @abrham-core-lead
/packages/ui/               @frontend-lead @frontend-dev-2 @abrham-core-lead

# Backend API & Worker
/apps/api/                  @abrham-core-lead @israel-backend
/apps/telegram/             @abrham-core-lead @israel-backend

# Core Architectural Packages (Strict Core Ownership)
/packages/database/         @abrham-core-lead
/packages/domain/           @abrham-core-lead
/packages/auth/             @abrham-core-lead
/packages/permissions/      @abrham-core-lead
/packages/calendar/         @abrham-core-lead
/packages/validation/       @abrham-core-lead @frontend-lead @israel-backend

# Infrastructure & CI/CD
/.github/                   @abrham-core-lead
/docker-compose.yml         @abrham-core-lead
/turbo.json                 @abrham-core-lead
/biome.json                 @abrham-core-lead
/docs/                      @abrham-core-lead
```
