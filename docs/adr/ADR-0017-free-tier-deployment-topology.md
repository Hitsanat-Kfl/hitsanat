# ADR-0017: Free-Tier Resilient Deployment Topology (Vercel, Render, Supabase)

**Status:** Accepted  
**Deciders:** Project Manager, Abrham (Core Lead)  
**Date:** August 2026  

---

## Context
Initial ministry operational budgets require zero hosting costs during development and initial production rollout, while preserving high availability during critical operating windows (Saturday and Sunday mornings).

---

## Decision
Deploy the initial system across a coordinated free-tier ecosystem:
- **Frontend (`apps/admin`, `apps/portfolio`):** Deployed on Vercel Hobby Tier.
- **Backend (`apps/api`):** Deployed as a stateless Web Service on Render Free Tier with scheduled health ping keep-alives during weekend ministry hours.
- **Database:** Hosted on Supabase Free Tier PostgreSQL 15.
- **Portability Invariant:** The architecture avoids proprietary platform locks, enabling effortless migration to a self-hosted VPS or dedicated container runtime if ministry usage expands.

---

## Consequences
### Positive:
- $0.00/month initial operational hosting costs.
- High global CDN performance for the public portfolio website via Vercel.
- Total database portability via standard PostgreSQL ANSI SQL.
