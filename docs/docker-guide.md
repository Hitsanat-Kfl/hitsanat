# Docker Setup — Hitsanat Kifl

## Prerequisites

- Docker Desktop installed and running
- Verify: `docker --version` and `docker compose version`

---

## What Docker Runs

Docker runs the **entire project stack** — database, API, admin panel, and portfolio site. One command starts everything.

| Service | Container | Port | URL | Description |
|:--------|:----------|:-----|:----|:------------|
| `postgres` | hitsanat-postgres | 5432 | — | PostgreSQL 16 dev database (`hitsanat_dev`) |
| `postgres_test` | hitsanat-postgres-test | 5433 | — | PostgreSQL 16 test database (`hitsanat_test`) |
| `api` | hitsanat-api | 3001 | http://localhost:3001 | Express.js API backend |
| `admin` | hitsanat-admin | 3002 | http://localhost:3002 | Next.js admin panel |
| `portfolio` | hitsanat-portfolio | 3000 | http://localhost:3000 | Next.js public website |

All 5 services are defined in `docker-compose.yml`. Each app (`api`, `admin`, `portfolio`) has its own multi-stage Dockerfile in `docker/`.

---

## Quick Start

```bash
cd C:\Users\hp\Desktop\Hitsanat

# Start ALL services (database + API + admin + portfolio)
docker compose up

# Start in background
docker compose up -d
```

First run builds images from the Dockerfiles in `docker/`. Subsequent starts are fast.

To start only specific services:
```bash
# Only database + API (skip admin and portfolio)
docker compose up postgres api

# Only the database
docker compose up postgres
```

---

## Verify Everything is Running

After `docker compose up`, check all 5 services:

```bash
docker compose ps
```

Expected output — all should show `Up`:
```
NAME                 STATUS       PORTS
hitsanat-postgres    Up (healthy) 0.0.0.0:5432->5432/tcp
hitsanat-postgres-test Up (healthy) 0.0.0.0:5433->5432/tcp
hitsanat-api         Up           0.0.0.0:3001->3001/tcp
hitsanat-admin       Up           0.0.0.0:3002->3002/tcp
hitsanat-portfolio   Up           0.0.0.0:3000->3000/tcp
```

Open in browser:
- Portfolio: http://localhost:3000
- API health: http://localhost:3001/health
- Admin: http://localhost:3002

---

## Day-to-Day Commands

```bash
# Check running services
docker compose ps

# View all logs
docker compose logs -f

# View only API logs
docker compose logs -f api

# View only database logs
docker compose logs -f postgres

# Stop everything
docker compose down

# Stop and wipe database (fresh start)
docker compose down -v

# Restart only the API after code changes
docker compose restart api

# Rebuild images (after dependency changes)
docker compose up --build
```

---

## Running Code Inside Containers

```bash
# Shell into the API container
docker compose exec api sh

# Run dev server inside API container
docker compose exec api pnpm --filter @repo/api dev

# Run tests inside API container
docker compose exec api pnpm test

# Open psql in the dev database
docker compose exec postgres psql -U postgres -d hitsanat_dev

# List tables in the database
docker compose exec postgres psql -U postgres -d hitsanat_dev -c "\dt"
```

---

## Database

Connection from host (e.g., DBeaver, pgAdmin, TablePlus):

```
Host:     localhost
Port:     5432
User:     postgres
Password: postgrespassword
Database: hitsanat_dev
```

Test database uses the same credentials on port **5433** with database `hitsanat_test`.

---

## How the Dockerfiles Work

Each app (`api`, `admin`, `portfolio`) has a multi-stage Dockerfile in `docker/`:

1. **base** — Node 22 Alpine + pnpm 9.15.9 via corepack
2. **builder** — copies full monorepo, installs deps, builds the app
3. **runner** — copies built output, runs `pnpm start`

The API Dockerfile waits for postgres healthcheck before starting.

---

## Troubleshooting

| Problem | Fix |
|:--------|:----|
| `port already in use` | `docker compose down` first, or stop other services on that port |
| API starts but can't connect to DB | Wait for postgres healthcheck — `docker compose ps` shows "healthy" |
| Stale schema after model changes | `docker compose down -v && docker compose up` |
| Build fails | `docker compose build --no-cache` |
| Container keeps restarting | `docker compose logs <service>` to see the error |
