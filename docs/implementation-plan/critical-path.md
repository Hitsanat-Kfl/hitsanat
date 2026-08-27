# Critical Path

## Hitsanat Kifl Children's Ministry Management System
**Purpose:** Identify the longest dependency chain that determines minimum project duration

---

## 1. Critical Path Diagram

```
Phase 0: Architecture & Planning
  ARCH-001 (Schema: Identity) ──────────────────────────┐
  ARCH-002 (Schema: Beneficiaries) ─────────────────────┤
  ARCH-003 (Schema: Planning) ──────────────────────────┤
  ARCH-004 (Schema: Attendance) ────────────────────────┤
  ARCH-005 (Schema: Academic) ──────────────────────────┤
  ARCH-006 (API Contracts) ← ARCH-001–005 ──────────────┘
      │
      ▼
Phase 1: Engineering Foundation
  FND-001 (Migration: Identity) ← ARCH-001 ─────────────┐
  FND-007 (packages/domain) ← ARCH-007 ─────────────────┤
  FND-008 (packages/permissions) ← ARCH-008 ────────────┤
      │                                                   │
      ▼                                                   │
Phase 2: Authentication                                    │
  AUTH-001 (Better Auth) ← FND-001 ──────────────────────┤
  AUTH-003 (RBAC Middleware) ← FND-008, AUTH-001 ────────┤
  AUTH-004 (Auth Endpoints) ← AUTH-001, AUTH-003 ────────┘
      │
      ▼
Phase 3: Organization Structure
  ORG-001 (Member Stage 1) ← FND-001, AUTH-003 ─────────┐
  ORG-002 (Member Stage 2) ← ORG-001 ───────────────────┤
  ORG-004 (Family CRUD) ← FND-001, AUTH-003 ────────────┤
      │                                                   │
      ▼                                                   │
Phase 4: Children & Parents                               │
  MBR-001 (Child CRUD) ← FND-002, AUTH-003 ─────────────┤
  MBR-003 (Child-Parent Linking) ← MBR-001 ─────────────┤
      │                                                   │
      ▼                                                   │
Phase 5: Planning                                         │
  PLN-001 (Weight Engine) ← FND-007 ────────────────────┤
  PLN-003 (Annual Plan API) ← FND-003, PLN-001 ─────────┤
  PLN-004 (Plan Distribution) ← PLN-003 ────────────────┤
  PLN-005 (Weekly Plans) ← PLN-004 ─────────────────────┘
      │
      ▼
Phase 6: Operational Tracking
  OPS-001 (Session Management) ← FND-004, AUTH-003 ─────┐
  OPS-002 (Auto-Seeding) ← OPS-001 ────────────────────┤
  OPS-003 (Verification) ← OPS-002 ────────────────────┤
      │                                                   │
      ▼                                                   │
Phase 7: Reporting                                        │
  RPT-001 (Aggregation) ← PLN-002, OPS-002 ────────────┤
  RPT-002 (Report API) ← RPT-001 ──────────────────────┘
      │
      ▼
Phase 8: Portfolio & Public
  PTF-001 (Announcements) ← FND-005, AUTH-003 ─────────┐
  PTF-002 (Public API) ← PTF-001 ──────────────────────┤
  PTF-004 (Portfolio Home) ← PTF-002 ──────────────────┤
      │                                                   │
      ▼                                                   │
Phase 9: Hardening                                        │
  HRD-001 (Cross-Module Tests) ← All phases ────────────┤
  HRD-002 (Security Audit) ← All phases ────────────────┘
      │
      ▼
Phase 10: Deployment
  DEP-001 (Railway API) ← Phase 9 ─────────────────────┐
  DEP-004 (Vercel Portfolio) ← DEP-001 ────────────────┤
  DEP-006 (CORS) ← DEP-001, DEP-004, DEP-005 ─────────┤
  DEP-008 (Production Verification) ← DEP-006 ─────────┘
```

---

## 2. Critical Path Tasks (Sequential Chain)

The longest dependency chain through the project:

| # | Task | Phase | Description |
|:---:|:---|:---|:---|
| 1 | ARCH-001 | Phase 0 | Database Schema Contract: Identity |
| 2 | FND-001 | Phase 1 | Database Migration: Identity Tables |
| 3 | AUTH-001 | Phase 2 | Better Auth Configuration |
| 4 | AUTH-003 | Phase 2 | Scoped RBAC Middleware |
| 5 | AUTH-004 | Phase 2 | Auth API Endpoints |
| 6 | ORG-001 | Phase 3 | Member API: Stage 1 Registration |
| 7 | ORG-002 | Phase 3 | Member API: Stage 2 Enrichment |
| 8 | PLN-001 | Phase 5 | Weight Calculation Engine |
| 9 | PLN-003 | Phase 5 | Annual Plan API |
| 10 | PLN-004 | Phase 5 | Plan Distribution |
| 11 | OPS-001 | Phase 6 | Session Management API |
| 12 | OPS-002 | Phase 6 | Attendance Auto-Seeding |
| 13 | RPT-001 | Phase 7 | Report Aggregation Logic |
| 14 | PTF-002 | Phase 8 | Public API |
| 15 | HRD-001 | Phase 9 | Cross-Module Integration Tests |
| 16 | DEP-001 | Phase 10 | Railway API Deployment |
| 17 | DEP-008 | Phase 10 | Production Verification |

---

## 3. Parallelization Opportunities

### High Parallelization (can run simultaneously)

**Phase 0:** All schema contracts (ARCH-001 to ARCH-005) are independent
**Phase 1:** All migrations (FND-001 to FND-005) are independent
**Phase 2:** Auth config (AUTH-001) and RBAC (AUTH-003) can overlap
**Phase 3:** Member endpoints (ORG-001) and Family endpoints (ORG-004) are independent
**Phase 5:** Weight engine (PLN-001) and Roll-up engine (PLN-002) are independent
**Phase 8:** Portfolio UI (PTF-004 to PTF-007) can all run in parallel

### Cross-Lane Parallelization

| While Core does... | Backend does... | Frontend 2 does... | Backend Support does... |
|:---|:---|:---|:---|
| Schema contracts | Review contracts | Wait | Wait |
| Migrations | — | — | Seed scripts |
| Auth architecture | Auth endpoints | Login page | Auth tests |
| Weight engine | Plan API | Planning UI | Plan queries |
| Auto-seeding logic | Session API | Checksheets UI | Integration tests |
| Security audit | Error handling | Accessibility | Documentation |
| Deployment | — | Verify deployment | Verify deployment |

---

## 4. Bottleneck Analysis

| Bottleneck | Impact | Mitigation |
|:---|:---|:---|
| Core is on critical path for every phase | Delays Core = delays entire project | Core should delegate CRUD tasks, focus on architecture and critical-path items |
| AUTH-003 (RBAC) gates all protected features | Auth delay cascades to all phases | Prioritize AUTH-001 and AUTH-003 early |
| PLN-001 (Weight Engine) is complex | Planning phase depends on it | Start PLN-001 as soon as FND-007 is ready |
| Phase 9 (Hardening) depends on all phases | Any delay in earlier phases delays hardening | Run hardening tasks in parallel where possible |
| Phase 10 (Deployment) is sequential | Deployment must happen last | Start deployment configuration early (DEP-002 can start anytime) |

---

## 5. Fast-Track Opportunities

1. **Phase 0 + Phase 1 overlap:** Start migrations (FND-001) as soon as the corresponding schema contract (ARCH-001) is complete, without waiting for all Phase 0 tasks
2. **Phase 2 + Phase 3 overlap:** Start Member API (ORG-001) as soon as AUTH-003 is complete, without waiting for all Phase 2 tasks
3. **Phase 5 + Phase 6 overlap:** Start Session Management (OPS-001) as soon as AUTH-003 is complete, without waiting for Phase 5
4. **Phase 8 parallel with Phase 7:** Portfolio UI (PTF-004) can start as soon as Public API (PTF-002) is ready, without waiting for Phase 7
5. **DEP-002 anytime:** Database provisioning (DEP-002) can start at any time
