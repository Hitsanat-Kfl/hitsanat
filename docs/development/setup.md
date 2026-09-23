# Developer Local Environment Setup Guide

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 3.0  
**Target Environment:** Windows, macOS, Linux  

---

## 1. Prerequisites

Ensure the following tools are installed on your workstation:
1. **Node.js:** v20+ (v24.x LTS recommended). Run `node -v` to verify.
2. **pnpm:** v9.x or later (`corepack enable && corepack prepare pnpm@latest --activate`).
3. **Docker & Docker Compose:** Docker Desktop (Windows/macOS) or Docker Engine (Linux).
4. **Git:** v2.40+.

---

## 2. Quickstart Step-by-Step

### Step 1: Clone the Repository
```bash
git clone https://github.com/Hitsanat-Kfl/hitsanat.git
cd hitsanat
```

### Step 2: Install Monorepo Dependencies
```bash
pnpm install
```

### Step 3: Configure Environment Variables
Copy the root example environment file:
```bash
cp .env.example .env
```
Fill in `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `DATABASE_URL` (see `docs/deployment/environment-variables.md`).

For the Next.js apps, create `.env.local` files with the public variables:
```bash
# apps/admin/.env.local and apps/portfolio/.env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 4: Start Local PostgreSQL via Docker
```bash
docker compose up -d postgres postgres_test
```

### Step 5: Run Database Migrations & Seed Reference Data
```bash
pnpm --filter @repo/database db:migrate
pnpm --filter @repo/database db:seed:all
```

### Step 6: Start All Applications in Development Mode
```bash
pnpm dev
```

---

## 3. Local Service URLs

| Service | URL |
| :--- | :--- |
| **Public Portfolio Website** | `http://localhost:3000` |
| **Express API Backend** | `http://localhost:3001/api/v1` |
| **Swagger API Explorer** | `http://localhost:3001/docs` |
| **API Health Check** | `http://localhost:3001/health` |
| **Admin Management Portal** | `http://localhost:3002` |

---

## 4. Verify the Stack

```bash
# API health
curl http://localhost:3001/health

# All workspaces typecheck
pnpm typecheck

# Quality gate before pushing
pnpm prepare
```
