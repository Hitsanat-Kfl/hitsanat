# Milestones

## Hitsanat Kifl Children's Ministry Management System
**Purpose:** Major project checkpoints with acceptance criteria

---

## M0 — Repository Ready
**Phase:** 0 (Architecture & Planning)
**Exit Criteria:**
- [ ] All database schema contracts verified
- [ ] OpenAPI specifications complete for all modules
- [ ] Shared package interfaces defined
- [ ] Module structure template created
- [ ] Test infrastructure validated
- [ ] No blocking OPEN DECISIONS

---

## M1 — Foundation Complete
**Phase:** 1 (Engineering Foundation)
**Exit Criteria:**
- [ ] All database migrations applied
- [ ] `packages/domain` compiled and tested
- [ ] `packages/permissions` compiled and tested
- [ ] `packages/validation` compiled and tested
- [ ] Sub-departments seeded (5 departments)
- [ ] Module skeleton structure created
- [ ] CI passes

---

## M2 — Authentication Ready
**Phase:** 2 (Authentication & Authorization)
**Exit Criteria:**
- [ ] Better Auth configured
- [ ] Auth tables migrated
- [ ] RBAC middleware enforces scoped permissions
- [ ] Login endpoint works end-to-end
- [ ] Admin login page functional
- [ ] Route guards prevent unauthorized access
- [ ] Non-leadership members locked out (ADR-0007)
- [ ] All auth tests pass

---

## M3 — Organization Ready
**Phase:** 3 (Organization Structure)
**Exit Criteria:**
- [ ] Member Stage 1 & 2 registration works
- [ ] Family Father/Mother assignment enforced
- [ ] Multi-department membership works
- [ ] Sub-department rosters display correctly
- [ ] Registration wizard functional in admin UI
- [ ] Member list and detail pages work
- [ ] All integration tests pass

---

## M4 — Beneficiaries Ready
**Phase:** 4 (Member Management: Children & Parents)
**Exit Criteria:**
- [ ] Child registration works end-to-end
- [ ] Parent CRUD works
- [ ] Child-parent linking enforces cardinality (BR-010)
- [ ] Kutr group classification enforced (BR-012)
- [ ] Collection routes constrained (BR-013)
- [ ] Sibling association works
- [ ] All integration tests pass

---

## M5 — Planning Ready
**Phase:** 5 (Planning)
**Exit Criteria:**
- [ ] Weight formula produces sum = 100.00%
- [ ] Annual plan creation works end-to-end
- [ ] Plan distribution to sub-departments works
- [ ] Weekly execution planning works
- [ ] Progress roll-up aggregation works
- [ ] Planning matrix UI displays correctly
- [ ] Sub-department execution view works
- [ ] All integration tests pass

---

## M6 — Operational Tracking Ready
**Phase:** 6 (Operational Tracking)
**Exit Criteria:**
- [ ] Attendance auto-seeding works (ADR-0002)
- [ ] Attendance verification works (Present/Absent/Excused)
- [ ] Transport routes enforce ≥2 members (BR-014)
- [ ] Kutitr has exclusive transport authority (BR-022)
- [ ] Academic scoring works for Timihrt
- [ ] Event creation and program assignment works
- [ ] Attendance checksheets work on mobile
- [ ] All integration tests pass

---

## M7 — Reporting Ready
**Phase:** 7 (Reporting & Dashboard)
**Exit Criteria:**
- [ ] Weekly, Monthly, Quarterly, Annual reports generate correctly
- [ ] Sub-department submissions work
- [ ] Executive dashboard displays cross-departmental overview
- [ ] Sub-department dashboards scoped correctly
- [ ] Performance metrics calculated accurately
- [ ] All integration tests pass

---

## M8 — Public Portfolio Ready
**Phase:** 8 (Portfolio & Public Features)
**Exit Criteria:**
- [ ] Announcement publishing works end-to-end
- [ ] Public API returns sanitized data (no PII)
- [ ] Telegram service posts announcements
- [ ] Portfolio home page functional
- [ ] Event countdowns display correctly
- [ ] Announcement feed works
- [ ] All E2E tests pass
- [ ] All accessibility tests pass (WCAG 2.1 AA)

---

## M9 — Production Hardened
**Phase:** 9 (Integration, Security & Hardening)
**Exit Criteria:**
- [ ] Cross-module integration tests pass
- [ ] Security audit findings remediated
- [ ] Error handling standardized
- [ ] Rate limiting implemented
- [ ] Performance targets met
- [ ] Admin accessibility passes WCAG 2.1 AA
- [ ] Portfolio accessibility passes WCAG 2.1 AA
- [ ] Biome passes on all files

---

## M10 — Production Deployed
**Phase:** 10 (Deployment & Production Readiness)
**Exit Criteria:**
- [ ] API accessible at `https://api.hitsanat.org`
- [ ] Portfolio accessible at `https://hitsanat.org`
- [ ] Admin accessible at `https://admin.hitsanat.org`
- [ ] Authentication works in production
- [ ] All CRUD operations work in production
- [ ] Public portfolio loads without authentication
- [ ] Telegram posts announcements
- [ ] CI/CD pipeline deploys automatically
- [ ] All smoke tests pass
- [ ] SSL certificates active

---

## Milestone Timeline (Estimated)

```
Week 1-2:   M0 — Repository Ready
Week 3-4:   M1 — Foundation Complete
Week 5-6:   M2 — Authentication Ready
Week 7-9:   M3 — Organization Ready
Week 10-11: M4 — Beneficiaries Ready
Week 12-14: M5 — Planning Ready
Week 15-17: M6 — Operational Tracking Ready
Week 18-19: M7 — Reporting Ready
Week 20-21: M8 — Public Portfolio Ready
Week 22-23: M9 — Production Hardened
Week 24:    M10 — Production Deployed
```

**Note:** These are estimates. Actual timing depends on team velocity and Open Decision resolution speed.
