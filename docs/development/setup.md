# Developer Local Environment Setup Guide

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Target Environment:** Windows, macOS, Linux  

---

## 1. Prerequisites

Ensure the following tools are installed on your workstation:
1. **Node.js:** v24.x LTS (Run `node -v` to verify).
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
Copy the example environment files for each app:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/portfolio/.env.example apps/portfolio/.env
```

### Step 4: Start Local PostgreSQL via Docker
```bash
docker compose up -d
```

### Step 5: Run Database Migrations & Seed Reference Data
```bash
pnpm --filter @hitsanat/database db:migrate
pnpm --filter @hitsanat/database db:seed
```

### Step 6: Start All Applications in Development Mode
```bash
pnpm dev
```

- **Admin Management Portal:** `http://localhost:3000`
- **Public Portfolio Website:** `http://localhost:3001`
- **Express API Backend:** `http://localhost:4000/api/v1`
- **Swagger API Explorer:** `http://localhost:4000/api/docs`
