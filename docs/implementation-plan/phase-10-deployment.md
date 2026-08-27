# Phase 10 — Deployment & Production Readiness

## Objective

Deploy the complete system to production infrastructure: Railway (API + Database + Telegram), Vercel (Portfolio + Admin). Configure CI/CD, monitoring, environment variables, and verify production readiness.

## Scope

### Included
- Railway deployment (API, Telegram, PostgreSQL)
- Vercel deployment (Portfolio, Admin)
- Environment variable configuration
- CORS configuration
- Production database setup
- CI/CD pipeline verification
- Health check verification
- Domain configuration
- Deployment verification testing

### Out of Scope
- New features
- Schema changes
- Performance optimization (Phase 9)

---

## Dependencies

- Phase 9 complete (all hardening and testing)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Deployment architecture, CI/CD, infrastructure, Railway/Vercel deployment |
| Israel | Backend Support | SUPPORT — Deployment documentation, production verification |
| Eyob | Frontend Developer | SUPPORT — Portfolio deployment verification |
| TBD | Frontend Developer | SUPPORT — Admin deployment verification |

---

## Tasks

### DEP-001
**Railway: API Service Deployment**

- **Description:** Deploy `apps/api` to Railway. Configure build command, start command, environment variables, and health check endpoint per `docs/deployment/railway.md`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** Phase 9 complete
- **Deliverable:** Deployed API service on Railway
- **Acceptance Criteria:**
  - API builds successfully on Railway
  - Health check endpoint responds at `https://api.hitsanat.org/health`
  - Swagger UI accessible at `https://api.hitsanat.org/docs`
  - All environment variables configured
  - Database migration runs on deploy
- **Reviewer:** Core

### DEP-002
**Railway: PostgreSQL Database**

- **Description:** Configure Railway-managed PostgreSQL database. Set up connection pooling, TLS, and backup strategy per `docs/deployment/railway.md`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** None
- **Deliverable:** Production PostgreSQL on Railway
- **Acceptance Criteria:**
  - PostgreSQL 15 running on Railway
  - Connection via `postgres.railway.internal:5432`
  - TLS enabled
  - All migrations applied
  - Seed data loaded (sub_departments)
- **Reviewer:** Core

### DEP-003
**Railway: Telegram Bot Service**

- **Description:** Deploy `apps/telegram` to Railway as a background worker. Configure build, start, and environment variables per OD-01.
- **Lane:** Core
- **Priority:** Medium
- **Dependencies:** DEP-001, PTF-003
- **Deliverable:** Deployed Telegram worker on Railway
- **Acceptance Criteria:**
  - Telegram service builds and starts
  - Connects to PostgreSQL via private network
  - Bot token configured
  - Posts announcements to Telegram group
- **Reviewer:** Core

### DEP-004
**Vercel: Portfolio Deployment**

- **Description:** Deploy `apps/portfolio` to Vercel. Configure build command, output directory, and environment variables per `docs/deployment/vercel.md`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** DEP-001
- **Deliverable:** Deployed Portfolio on Vercel
- **Acceptance Criteria:**
  - Portfolio builds successfully on Vercel
  - Accessible at `https://hitsanat.org`
  - API URL points to production API
  - Environment variables configured
  - ISR/SSG working correctly
- **Reviewer:** Core, Frontend 1

### DEP-005
**Vercel: Admin Deployment**

- **Description:** Deploy `apps/admin` to Vercel. Configure build command, output directory, and environment variables per `docs/deployment/vercel.md`.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** DEP-001
- **Deliverable:** Deployed Admin on Vercel
- **Acceptance Criteria:**
  - Admin builds successfully on Vercel
  - Accessible at `https://admin.hitsanat.org`
  - API URL points to production API
  - Auth callback URL configured
  - Environment variables configured
- **Reviewer:** Core, Frontend 2

### DEP-006
**CORS & Security Configuration**

- **Description:** Configure CORS policies for production: allow only Vercel domains to access API. Verify Helmet security headers.
- **Lane:** Core
- **Priority:** Critical
- **Dependencies:** DEP-001, DEP-004, DEP-005
- **Deliverable:** CORS and security configuration
- **Acceptance Criteria:**
  - CORS allows `https://hitsanat.org` and `https://admin.hitsanat.org`
  - Other origins rejected
  - Helmet security headers present
  - HTTPS enforced
- **Reviewer:** Core

### DEP-007
**CI/CD Pipeline Verification**

- **Description:** Verify the full CI/CD pipeline works end-to-end: push → CI → deploy. Test with a small change.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** DEP-001, DEP-004, DEP-005
- **Deliverable:** Verified CI/CD pipeline
- **Acceptance Criteria:**
  - Push to main triggers CI
  - CI passes (format, lint, typecheck, test, build)
  - Vercel auto-deploys on merge
  - Railway deploys on merge
  - No manual intervention required
- **Reviewer:** Core

### DEP-008
**Production Verification Testing**

- **Description:** Run end-to-end smoke tests against production environment. Verify all critical user flows work.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** DEP-001, DEP-004, DEP-005
- **Deliverable:** Production verification report
- **Acceptance Criteria:**
  - Health check responds
  - Login flow works on production admin
  - Member registration works
  - Attendance checksheet works
  - Public portfolio loads
  - Event countdowns display
  - Announcements publish
- **Reviewer:** Core

### DEP-009
**Domain & DNS Configuration**

- **Description:** Configure custom domains: `hitsanat.org`, `admin.hitsanat.org`, `api.hitsanat.org`. Set up DNS records and SSL certificates.
- **Lane:** Core
- **Priority:** High
- **Dependencies:** DEP-004, DEP-005, DEP-001
- **Deliverable:** Domain configuration
- **Acceptance Criteria:**
  - `hitsanat.org` points to Vercel Portfolio
  - `admin.hitsanat.org` points to Vercel Admin
  - `api.hitsanat.org` points to Railway API
  - SSL certificates active
  - DNS propagation complete
- **Reviewer:** Core

### DEP-010
**Deployment Documentation**

- **Description:** Update deployment documentation with final production configuration, environment variables, and operational procedures.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** DEP-001 through DEP-009
- **Deliverable:** Updated deployment docs
- **Acceptance Criteria:**
  - Environment variables documented
  - Deployment steps documented
  - Rollback procedures documented
  - Monitoring setup documented
  - Incident response procedures documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- DEP-001 and DEP-002 (independent Railway services)
- DEP-004 and DEP-005 (independent Vercel deployments)
- DEP-010 (documentation)

**Must happen sequentially:**
- DEP-003 depends on DEP-001 (Telegram needs API)
- DEP-006 depends on DEP-001, DEP-004, DEP-005
- DEP-007 depends on DEP-001, DEP-004, DEP-005
- DEP-008 depends on DEP-006
- DEP-009 depends on DEP-004, DEP-005, DEP-001

---

## Deliverables

1. Deployed API on Railway
2. Production PostgreSQL on Railway
3. Deployed Telegram worker on Railway
4. Deployed Portfolio on Vercel
5. Deployed Admin on Vercel
6. CORS and security configuration
7. Verified CI/CD pipeline
8. Production verification report
9. Domain configuration
10. Updated deployment documentation

---

## Exit Criteria

- [ ] API accessible at `https://api.hitsanat.org`
- [ ] Portfolio accessible at `https://hitsanat.org`
- [ ] Admin accessible at `https://admin.hitsanat.org`
- [ ] Health check responds correctly
- [ ] Authentication works in production
- [ ] All CRUD operations work in production
- [ ] Attendance checksheets work on mobile in production
- [ ] Public portfolio loads without authentication
- [ ] Event countdowns display correctly
- [ ] Announcements publish to Telegram
- [ ] CI/CD pipeline deploys automatically
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] All smoke tests pass
- [ ] Documentation complete
