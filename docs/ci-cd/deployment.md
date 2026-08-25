# CI/CD: Continuous Deployment & Release Pipeline

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.2  

---

## 1. Automated Continuous Deployment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Lead
    participant GitHub as GitHub Actions (CI)
    participant Vercel as Vercel (Frontend Hosting)
    participant Railway as Railway (Backend, Bot & DB)

    Dev->>GitHub: Merges Approved PR into main
    GitHub->>GitHub: Runs Full Quality Pipeline (pnpm prepare)
    
    par Frontend Deployments
        GitHub->>Vercel: Triggers Production Build
        Vercel-->>Vercel: Deploys apps/admin to admin.hitsanat.org
        Vercel-->>Vercel: Deploys apps/portfolio to hitsanat.org
    and Backend & Database Deployment
        GitHub->>Railway: Triggers Auto-Deploy via GitHub Integration
        Railway->>Railway: Runs pnpm db:migrate (Automatic DB Migration)
        Railway-->>Railway: Starts Express Server at api.hitsanat.org & Telegram Worker
    end
```

---

## 2. Preview Environments & Rollback Safety
- **Vercel Previews:** Every Pull Request automatically receives isolated preview URLs for `apps/admin` and `apps/portfolio` to facilitate UI review.
- **Railway Ephemeral PR Environments:** Railway automatically provisions isolated preview backend containers if required for complex feature testing.
- **Rollback Strategy:** Both Vercel and Railway provide instant 1-click rollbacks to the last known healthy deployment if runtime regressions occur.
