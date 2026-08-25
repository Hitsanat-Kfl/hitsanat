# Environment Variables Reference

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

## 1. Complete Environment Variables Taxonomy

| Variable Name | Required In | Description / Sample Value | Security Sensitivity |
| :--- | :---: | :--- | :---: |
| `NODE_ENV` | All | `development` \| `test` \| `production` | Low |
| `PORT` | API | HTTP port for Express server (e.g. `4000`) | Low |
| `DATABASE_URL` | API, DB | PostgreSQL connection URI (`postgresql://user:pass@host:5432/db`) | **CRITICAL SECRET** |
| `BETTER_AUTH_SECRET` | API, Auth | 32-character random secret key for session cookie signing | **CRITICAL SECRET** |
| `BETTER_AUTH_URL` | API, Auth | Base URL for auth callbacks (`https://api-hitsanat.onrender.com`) | Medium |
| `CLIENT_URL` | API | Admin portal URL for CORS whitelist (`https://admin-hitsanat.vercel.app`) | Medium |
| `NEXT_PUBLIC_API_URL` | Admin, Portfolio | Public API endpoint base URL (`https://api-hitsanat.onrender.com/api/v1`) | Low |
| `NEXT_PUBLIC_APP_URL` | Admin | Admin application URL | Low |
| `NEXT_PUBLIC_SITE_URL`| Portfolio | Public portfolio website URL | Low |
| `TELEGRAM_BOT_TOKEN` | Telegram | Bot token provided by BotFather | **CRITICAL SECRET** |
| `TELEGRAM_GROUP_ID` | Telegram | Target church Telegram group/channel chat ID | Medium |
