# ADR-0017: Resilient Cloud Deployment Topology (Vercel & Railway)

**Status:** Accepted  
**Deciders:** Project Manager, Abrham (Core Lead)  
**Date:** August 2026 (Updated to v2.2)  

---

## Context
Initial ministry operational requirements necessitate zero-downtime, always-on availability for Saturday morning attendance taking and choir coordination at Haramaya University Gibi Gubae, without cold-start delays or complex multi-host orchestration.

---

## Decision
Deploy the Hitsanat Kifl system across a coordinated high-performance cloud topology:
- **Frontend Applications (`apps/admin`, `apps/portfolio`):** Deployed on **Vercel** for industry-standard Next.js 15 App Router rendering, global Edge CDN distribution, and instant static asset caching.
- **Backend API (`apps/api`), Telegram Worker (`apps/telegram`), and Database:** Deployed on **Railway**:
  - **Always-On:** 24/7 continuous uptime with **zero sleeping** (eliminating Render's 50s cold-start delays).
  - **Internal Private Networking:** Database communication runs over `postgres.railway.internal`, closing database ports from the public internet.
  - **Multi-Service Project Canvas:** Runs the Express REST API and the Telegram Bot Worker side-by-side within a single unified project dashboard.
- **Portability Invariant:** Standard Docker/Nixpacks containers and PostgreSQL ANSI SQL ensure 100% portability to any self-hosted VPS (Docker Compose / Coolify) in the future.

---

## Consequences
### Positive:
- **Zero Cold Starts:** Immediate $<50\text{ ms}$ response times during Saturday morning field operations.
- **Integrated Telegram Bot:** Supports background long-polling workers without paying for enterprise add-ons.
- **High Security:** PostgreSQL database is shielded behind Railway private networking.
- **Low Predictable Cost:** Well within free credits or standard base allowance ($\approx \$2.50 – \$3.00/\text{month}$).
