# Deployment: Render Setup for Express API

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Target Application:** `apps/api`  

---

## 1. Web Service Configuration on Render

- **Environment:** Node.js 24
- **Branch:** `main`
- **Build Command:**
  ```bash
  pnpm install --frozen-lockfile && pnpm --filter @hitsanat/database db:migrate && pnpm --filter @hitsanat/api build
  ```
- **Start Command:**
  ```bash
  node apps/api/dist/server.js
  ```
- **Health Check Path:** `/health`
- **Auto-Deploy:** Enabled on merge to `main`.

---

## 2. Cold-Start Mitigation & Weekend Uptime

Render free tier instances sleep after 15 minutes of inactivity. To ensure zero lag during ministry operations:
- A scheduled cron / GitHub Actions pinger pings `https://api-hitsanat.onrender.com/health` every 10 minutes on Saturday (7:00 AM - 1:00 PM EAT) and Sunday (7:00 AM - 1:00 PM EAT).
