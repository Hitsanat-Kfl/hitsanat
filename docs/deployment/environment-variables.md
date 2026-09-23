# Environment Variables Reference

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 3.0  
**Source of Truth:** Root `.env.example` (local) and service-level `.env.example` files

---

## 1. Complete Environment Variables Taxonomy

### 1.1 Application & API (root `.env.example`)

| Variable Name | Required In | Description / Sample Value | Security Sensitivity |
| :--- | :---: | :--- | :---: |
| `NODE_ENV` | All | `development` \| `test` \| `production` | Low |
| `PORT` | API | HTTP port for Express server (default `3001`; Railway may auto-assign `$PORT`) | Low |
| `API_PREFIX` | API | Route prefix (`/api/v1`) | Low |
| `CORS_ORIGIN` | API | Comma-separated allowed origins (`*` or `https://admin.hitsanat.org,https://hitsanat.org`) | Medium |

### 1.2 Supabase Auth (root `.env.example`)

| Variable Name | Required In | Description / Sample Value | Security Sensitivity |
| :--- | :---: | :--- | :---: |
| `SUPABASE_URL` | API, DB seeds | Supabase project URL (`https://your-project.supabase.co`) | Medium |
| `SUPABASE_ANON_KEY` | API, Admin, Portfolio | Public anon key for client-side auth | Medium |
| `SUPABASE_SERVICE_ROLE_KEY` | DB seeds, Admin user mgmt | Server-only service role key for `supabase.auth.admin` | **CRITICAL SECRET** |

### 1.3 Frontend (Next.js `.env.local`)

| Variable Name | Required In | Description / Sample Value | Security Sensitivity |
| :--- | :---: | :--- | :---: |
| `NEXT_PUBLIC_SUPABASE_URL` | Admin, Portfolio | Same as `SUPABASE_URL`, exposed to the browser | Medium |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Admin, Portfolio | Same as `SUPABASE_ANON_KEY`, exposed to the browser | Medium |
| `NEXT_PUBLIC_API_URL` | Admin, Portfolio | API base URL (`http://localhost:3001` locally; `https://api.hitsanat.org` in production) | Low |

### 1.4 Database (root `.env.example`)

| Variable Name | Required In | Description / Sample Value | Security Sensitivity |
| :--- | :---: | :--- | :---: |
| `DATABASE_URL` | API, DB | PostgreSQL connection URI (Supabase pooler or Railway/Docker) | **CRITICAL SECRET** |
| `TEST_DATABASE_URL` | Integration tests | Disposable/CI PostgreSQL URI for Vitest integration suite | **CRITICAL SECRET** |
| `PLAYWRIGHT_TEST_BASE_URL` | E2E tests | Base URL for Playwright (`http://localhost:3000`) | Low |

### 1.5 Telegram Worker (`apps/telegram/.env.example`)

| Variable Name | Required In | Description / Sample Value | Security Sensitivity |
| :--- | :---: | :--- | :---: |
| `TELEGRAM_BOT_TOKEN` | Telegram | Bot token provided by BotFather | **CRITICAL SECRET** |
| `TELEGRAM_CHAT_ID` | Telegram | Target church Telegram group/channel chat ID | Medium |
| `TELEGRAM_POLL_INTERVAL_MS` | Telegram | Long-poll interval in milliseconds (default `30000`) | Low |
| `DATABASE_URL` | Telegram | Same PostgreSQL URI as the API (private network in production) | **CRITICAL SECRET** |

---

## 2. Local Development Blueprint

Copy the root example and fill in real values:

```bash
cp .env.example .env
```

For the Admin and Portfolio apps, create `.env.local` with the `NEXT_PUBLIC_*` variables listed above (they are not read from the root `.env` by Next.js).

---

## 3. Security Notes

1. **Never commit** `.env`, `.env.local`, or service account keys.
2. `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — server-side only.
3. `DATABASE_URL` and `TEST_DATABASE_URL` are secrets even when pointing at local Docker.
4. In production, prefer platform secret stores (Railway/Vercel environment variables) over files.
