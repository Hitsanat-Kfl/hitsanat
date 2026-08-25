# Deployment: Vercel Setup for Next.js Apps

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.2  
**Target Applications:** `apps/admin`, `apps/portfolio`  

---

## 1. Project Configuration on Vercel

Two separate Vercel projects are created from the GitHub repository:

### 1.1 Project 1: `admin-hitsanat` (`apps/admin`)
- **Root Directory:** `apps/admin`
- **Framework Preset:** Next.js
- **Build Command:** `cd ../.. && pnpm --filter @hitsanat/admin build`
- **Output Directory:** `.next`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: `https://api.hitsanat.org/api/v1`
  - `NEXT_PUBLIC_APP_URL`: `https://admin.hitsanat.org`

### 1.2 Project 2: `portfolio-hitsanat` (`apps/portfolio`)
- **Root Directory:** `apps/portfolio`
- **Framework Preset:** Next.js
- **Build Command:** `cd ../.. && pnpm --filter @hitsanat/portfolio build`
- **Output Directory:** `.next`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: `https://api.hitsanat.org/api/v1`
  - `NEXT_PUBLIC_SITE_URL`: `https://hitsanat.org`
