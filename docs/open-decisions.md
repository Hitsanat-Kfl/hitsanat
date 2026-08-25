# Open Architecture Decisions & Ambiguity Registry

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Status:** Authoritative Ambiguity & Trade-off Record  

---

## 1. Registry of Open Decisions

In accordance with the Source-of-Truth governance rules, all unresolved technical, infrastructure, or operational questions are explicitly documented here rather than silently assumed.

---

### OD-01: Telegram Bot Deployment Platform & Runtime Model

- **Problem:** Where and how should the standalone Telegram Bot worker service (`apps/telegram`) be hosted within the free-tier infrastructure budget?
- **Source of Ambiguity:** Section 21 of the system specifications explicitly designates the Telegram deployment provider as an `OPEN DECISION / TO BE DEFINED`.
- **Affected Modules:** `apps/telegram`, `apps/api/src/modules/announcements`, `packages/domain/announcements`.
- **Possible Options:**
  1. **Option A (Render Background Worker):** Deploy as a background worker on Render (Note: Render background workers require a paid plan on Render).
  2. **Option B (Fly.io Free Tier):** Deploy as a single small container on Fly.io's free allowance ($3\times 256\text{ MB}$ VMs).
  3. **Option C (Railway / Zeabur Free Tier):** Deploy as a persistent lightweight Node.js container on Railway/Zeabur free credit.
  4. **Option D (Serverless Webhook Handler inside Express API):** Convert Telegram integration to an incoming/outgoing webhook route inside `apps/api` instead of a separate long-polling bot worker.
- **Recommended Option:** **Option D** for free-tier simplicity during initial phases, or **Option B** if strict physical decoupling of the bot process is mandatory.
- **Decision Status:** `OPEN / TO BE DEFINED by Lead & PM`

---

### OD-02: Public Swagger API Documentation Production Exposure

- **Problem:** Should `/api/docs` (Swagger UI) remain publicly accessible in the production cloud environment (`api-hitsanat.onrender.com`), or should it be restricted?
- **Source of Ambiguity:** Section 12 states: *"Swagger must be available in development. Production exposure must be controlled according to the security requirements. Do not expose sensitive internal information through Swagger."*
- **Affected Modules:** `apps/api/src/shared/docs`, `apps/api/src/server.ts`.
- **Possible Options:**
  1. **Option A (Publicly Accessible in Production):** Expose `/api/docs` in production with internal sensitive endpoints filtered out using OpenAPI tags.
  2. **Option B (Basic Auth Gate in Production):** Protect `/api/docs` with a lightweight HTTP Basic Authentication username/password in production.
  3. **Option C (Disabled in Production):** Disable `/api/docs` entirely in production; available only in local and staging environments.
- **Recommended Option:** **Option B** (HTTP Basic Auth in production) allows developers and external integrators to inspect live contracts without exposing the API explorer to anonymous scrapers.
- **Decision Status:** `PROPOSED (Option B)`

---

### OD-03: Media Storage Provider for Member & Child Profile Photos

- **Problem:** Where should uploaded member profile photos and child images be stored without incurring cloud storage costs?
- **Source of Ambiguity:** Data models specify `photo_url` for members and children, but the cloud storage bucket provider is not locked in v2.1.
- **Affected Modules:** `members`, `children`, `packages/ui`.
- **Possible Options:**
  1. **Option A (Supabase Storage):** Utilize the 1 GB free bucket storage included with the Supabase project.
  2. **Option B (Cloudinary Free Tier):** Utilize Cloudinary for automated image optimization, facial cropping, and delivery.
  3. **Option C (Base64 / Local Storage):** Strongly discouraged.
- **Recommended Option:** **Option A** (Supabase Storage) keeps all persistence and bucket authorization within the existing Supabase infrastructure.
- **Decision Status:** `PROPOSED (Option A)`

---

### OD-04: Automated Saturday Keep-Alive Ping Source for Render Free Tier

- **Problem:** Render free-tier web services sleep after 15 minutes of inactivity. How should the `/health` keep-alive ping be automated on weekend mornings?
- **Source of Ambiguity:** Free-tier operational mitigation requires an external trigger to ensure zero cold-start delay for leaders on Saturday 8:00 AM.
- **Affected Modules:** `apps/api`, `.github/workflows/`.
- **Possible Options:**
  1. **Option A (GitHub Actions Scheduled Cron):** A simple GitHub Actions cron workflow running every 10 minutes on Saturdays and Sundays between 5:00 AM and 11:00 AM UTC.
  2. **Option B (Free External Uptime Monitor):** Use UptimeRobot or Cron-Job.org free accounts pointing to `https://api-hitsanat.onrender.com/health`.
- **Recommended Option:** **Option B** (UptimeRobot / Cron-Job.org) provides resilient external pinging independent of GitHub Actions runner quotas.
- **Decision Status:** `PROPOSED (Option B)`
