# Deployment: Railway Setup for Express API & Services

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.2  
**Target Services:** `apps/api`, `apps/telegram`, PostgreSQL / Redis  
**Cloud Platform:** [Railway](https://railway.com) (Always-On / Private Networking)

---

## 1. Multi-Service Architecture on Railway

Railway hosts the entire backend and background service ecosystem within a single unified project canvas:

```mermaid
graph TD
    subgraph Railway Project Canvas
        subgraph Private Internal Network
            RailwayAPI[apps/api<br/>Express.js REST API<br/>Private: api.railway.internal<br/>Public: api.hitsanat.org]
            RailwayWorker[apps/telegram<br/>Telegram Bot Worker<br/>Private: telegram.railway.internal]
            RailwayDB[(PostgreSQL 15 Database<br/>Private: postgres.railway.internal:5432)]
        end
    end

    RailwayAPI -->|Internal DB Connection| RailwayDB
    RailwayWorker -->|Internal DB Connection| RailwayDB
    RailwayAPI -.->|Internal Event Trigger| RailwayWorker
```

---

## 2. Service 1: `apps/api` (Express REST API)

### 2.1 Configuration
- **Root Directory:** `/` (Monorepo root)
- **Builder:** Nixpacks
- **Build Command:**
  ```bash
  pnpm install --frozen-lockfile && pnpm --filter @hitsanat/database db:migrate && pnpm --filter @hitsanat/api build
  ```
- **Start Command:**
  ```bash
  node apps/api/dist/server.js
  ```
- **Port:** Configured via `PORT` env var (defaults to `4000` or Railway auto-assigned `$PORT`).
- **Health Check Path:** `/health`
- **Public Domain:** `api.hitsanat.org` or `hitsanat-api.up.railway.app`
- **Restart Policy:** `ON_FAILURE` (Max 10 retries)

### 2.2 Required Environment Variables
```ini
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://${PGUSER}:${PGPASSWORD}@postgres.railway.internal:5432/${PGDATABASE}
DIRECT_URL=postgresql://${PGUSER}:${PGPASSWORD}@postgres.railway.internal:5432/${PGDATABASE}
BETTER_AUTH_SECRET=your_super_secret_key_here
BETTER_AUTH_URL=https://api.hitsanat.org
CORS_ORIGIN=https://admin.hitsanat.org,https://hitsanat.org
```

---

## 3. Service 2: `apps/telegram` (Telegram Bot Worker)

### 3.1 Configuration
- **Root Directory:** `/` (Monorepo root)
- **Builder:** Nixpacks
- **Build Command:**
  ```bash
  pnpm install --frozen-lockfile && pnpm --filter @hitsanat/telegram build
  ```
- **Start Command:**
  ```bash
  node apps/telegram/dist/index.js
  ```
- **Networking:** Private only (No public domain required).
- **Restart Policy:** `ALWAYS`

### 3.2 Required Environment Variables
```ini
NODE_ENV=production
DATABASE_URL=postgresql://${PGUSER}:${PGPASSWORD}@postgres.railway.internal:5432/${PGDATABASE}
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHANNEL_ID=@hitsanat_kifl_official
```

---

## 4. Key Advantages of Railway for Hitsanat Kifl

1. **Zero Cold Starts (Always-On):**
   - Unlike Render free tier which sleeps after 15 minutes, Railway runs 24/7. Saturday morning attendance queries respond instantly ($<50\text{ ms}$).
2. **Private Internal Networking:**
   - Database and background worker traffic runs on isolated internal hostnames (`postgres.railway.internal`), keeping ports closed from the public internet.
3. **Automated Migrations on Deploy:**
   - Drizzle migrations run automatically in the build pipeline before the new Express container traffic switch occurs.
4. **Predictable Low Cost:**
   - Resource consumption across all services is $\approx \$2.50 – \$3.50/\text{month}$, fully covered by Railway's free credit or base Hobby plan.
