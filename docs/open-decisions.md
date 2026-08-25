# Open Architecture Decisions & Ambiguity Registry

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.2  
**Status:** Authoritative Ambiguity & Trade-off Record  

---

## 1. Registry of Open Decisions

In accordance with the Source-of-Truth governance rules, all unresolved technical, infrastructure, or operational questions are explicitly documented here rather than silently assumed.

---

### OD-01: Telegram Bot Deployment Platform & Runtime Model

- **Problem:** Where and how should the standalone Telegram Bot worker service (`apps/telegram`) be hosted within the infrastructure budget?
- **Source of Ambiguity:** Section 21 of the system specifications designated the Telegram deployment provider as an `OPEN DECISION`.
- **Affected Modules:** `apps/telegram`, `apps/api/src/modules/announcements`, `packages/domain/announcements`.
- **Options Evaluated:**
  1. **Option A (Render Background Worker):** Paid add-on on Render.
  2. **Option B (Railway Multi-Service Canvas):** Deploy `apps/telegram` alongside `apps/api` inside Railway project with private network access to PostgreSQL.
  3. **Option C (Serverless Webhook Handler inside Express API):** Convert Telegram integration to an incoming/outgoing webhook route inside `apps/api`.
- **Resolved Decision:** **Option B (Railway Multi-Service)**. Railway natively runs the Telegram worker service side-by-side with the Express API connected to the internal PostgreSQL instance.
- **Decision Status:** `RESOLVED (Adopted Option B via Railway)`

---

### OD-02: Public Swagger API Documentation Production Exposure

- **Problem:** Should `/api/docs` (Swagger UI) remain publicly accessible in the production cloud environment (`api.hitsanat.org`), or should it be restricted?
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
  1. **Option A (Railway S3-Compatible Storage / MinIO):** Self-host MinIO or use a lightweight S3-compatible bucket.
  2. **Option B (Cloudinary Free Tier):** Utilize Cloudinary for automated image optimization, facial cropping, and delivery.
  3. **Option C (Base64 / Local Storage):** Strongly discouraged.
- **Recommended Option:** **Option B** (Cloudinary Free Tier) provides automated responsive image resizing and CDN caching for mobile devices.
- **Decision Status:** `PROPOSED (Option B)`

---

### OD-04: Weekend Cold-Start Delays & Availability

- **Problem:** Preventing cold starts for ministry leaders arriving on Saturday/Sunday mornings at Gibi Gubae.
- **Source of Ambiguity:** Free-tier platforms like Render sleep after 15 minutes of inactivity.
- **Affected Modules:** `apps/api`, `apps/admin`.
- **Options Evaluated:**
  1. **Option A (External Keep-Alive Pings on Render):** Cron pings every 10 minutes.
  2. **Option B (Always-On Hosting on Railway):** Railway runs continuous 24/7 instances without sleeping.
- **Resolved Decision:** **Option B (Railway Always-On)** completely eliminates the cold-start problem. All requests respond immediately in $<50\text{ ms}$.
- **Decision Status:** `RESOLVED (Adopted Option B via Railway)`
