# CI/CD: Continuous Deployment & Release Pipeline

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

## 1. Automated Continuous Deployment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Lead
    participant GitHub as GitHub Actions (CI)
    participant Vercel as Vercel (Frontend Hosting)
    participant Render as Render (API Hosting)
    participant Supabase as Supabase PostgreSQL

    Dev->>GitHub: Merges Approved PR into main
    GitHub->>GitHub: Runs Full Quality Pipeline
    
    par Frontend Deployments
        GitHub->>Vercel: Triggers Production Build
        Vercel-->>Vercel: Deploys apps/admin to admin-hitsanat.vercel.app
        Vercel-->>Vercel: Deploys apps/portfolio to hitsanat.vercel.app
    and Backend API Deployment
        GitHub->>Render: Triggers Webhook Deploy
        Render->>Supabase: Runs pnpm db:migrate (Automatic Migration)
        Render-->>Render: Starts Express Server at api-hitsanat.onrender.com
    end
```

---

## 2. Preview Environments
- **Vercel Previews:** Every Pull Request automatically receives isolated preview URLs for `apps/admin` and `apps/portfolio` to facilitate visual review.
- **Rollback Strategy:** Vercel and Render provide instant 1-click rollbacks to the last known healthy deployment if runtime regressions occur.
