# Risk Management

## Hitsanat Kifl Children's Ministry Management System
**Purpose:** Identify, assess, and mitigate implementation risks

---

## 1. Risk Register

### RISK-001: Core Bottleneck

- **Risk:** Core is on the critical path for every phase. If Core is delayed or unavailable, the entire project stalls.
- **Impact:** Critical
- **Probability:** High
- **Mitigation:**
  - Core should delegate CRUD tasks to Backend Support
  - Core should focus on architecture, critical-path items, and reviews
  - Document all decisions in ADRs so work can continue if Core is temporarily unavailable
  - Establish clear API contracts early so other lanes can work independently
- **Owner:** Core (Abrham)

### RISK-002: Open Decision Delays

- **Risk:** 10 open decisions (DEC-001 through DEC-010) remain unresolved. Some block specific phases (DEC-007 blocks Phase 2, DEC-001 blocks Phase 5).
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Resolve DEC-007 (Auth Package) before Phase 2 starts
  - Resolve DEC-001 (Org Hierarchy) before Phase 5 starts
  - Set deadlines for each decision
  - Escalate unresolved decisions to project owner
- **Owner:** Core (Abrham)

### RISK-003: Planning Complexity

- **Risk:** The planning system (Phase 5) is the most complex module: 6 goals, 25 activities, 3-factor weight formula, plan distribution, weekly execution, progress roll-up. Any misunderstanding could cascade.
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Implement weight engine with extensive unit tests (all 25 activities)
  - Validate against Action PLN.xlsx baseline data
  - Get planning system requirements validated by Ekd leadership before implementation
  - Start with a minimal viable planning flow and iterate
- **Owner:** Core (Abrham)

### RISK-004: Free-Tier Limitations

- **Risk:** Vercel and Railway free tiers have limitations (build minutes, bandwidth, memory). High traffic or long builds could exceed limits.
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:**
  - Monitor usage from day one
  - Optimize build times (Turborepo caching)
  - Use Railway always-on (OD-04 resolved) to avoid cold starts
  - Have a budget for $5-10/month if needed
  - Plan for upgrade path if traffic exceeds free tier
- **Owner:** Core (Abrham)

### RISK-005: Cross-Lane Merge Conflicts

- **Risk:** Multiple lanes working on overlapping areas (e.g., Backend and Backend Support both modifying `apps/api/`) could cause merge conflicts.
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:**
  - Strict lane ownership enforced
  - Backend Support works only on assigned modules
  - Frequent rebasing from main
  - Core reviews all cross-lane PRs
  - Clear CODEOWNERS enforcement
- **Owner:** All lanes

### RISK-006: Authentication Package Risk

- **Risk:** Better Auth is referenced in ADRs but not yet installed or configured. It may have compatibility issues with Next.js 15 or PostgreSQL.
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Evaluate Better Auth compatibility before Phase 2
  - Have fallback options: NextAuth.js, Lucia Auth, custom sessions
  - DEC-007 tracks this decision
  - Install and test in a spike before committing
- **Owner:** Core (Abrham)

### RISK-007: Attendance Auto-Seeding Complexity

- **Risk:** Attendance auto-seeding (ADR-0002) is a domain event that must trigger correctly across modules. Implementation complexity is high.
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Implement as a synchronous service call initially (not async events)
  - Extensive integration testing
  - Idempotent implementation (safe to run multiple times)
  - Fallback: manual seeding if auto-seeding fails
- **Owner:** Core (Abrham)

### RISK-008: Mobile Performance on Saturday Mornings

- **Risk:** Attendance checksheets must work on mobile devices on Saturday mornings at Gibi Gubae. Network conditions may be poor.
- **Impact:** High
- **Probability:** Medium
- **Mitigation:**
  - Offline-first design for attendance checksheets
  - Optimistic UI updates
  - Minimal data transfer per interaction
  - Test on low-end Android devices
  - Consider PWA for offline support
- **Owner:** Frontend 2

### RISK-009: Telegram Bot Reliability

- **Risk:** Telegram bot service may fail to post announcements due to API rate limits, network issues, or bot token problems.
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:**
  - Retry logic with exponential backoff
  - Dead letter queue for failed posts
  - Monitoring and alerting on failure
  - Fallback: manual announcement posting
  - OD-01 resolved deployment on Railway (always-on)
- **Owner:** Backend Support

### RISK-010: Team Velocity Variability

- **Risk:** With 4 contributors at different skill levels, task completion speed may vary significantly. Backend Support tasks are designed to be simpler, but may still take longer than expected.
- **Impact:** Medium
- **Probability:** High
- **Mitigation:**
  - Clear task scoping with small deliverables
  - Regular standups to identify blockers early
  - Pair programming for complex tasks
  - Buffer time built into phase estimates
  - Core available for mentoring and guidance
- **Owner:** All lanes

---

## 2. Risk Matrix

| Risk | Impact | Probability | Severity | Priority |
|:---|:---:|:---:|:---:|:---:|
| RISK-001: Core Bottleneck | Critical | High | Critical | P0 |
| RISK-002: Open Decision Delays | High | Medium | High | P1 |
| RISK-003: Planning Complexity | High | Medium | High | P1 |
| RISK-004: Free-Tier Limitations | Medium | Low | Low | P3 |
| RISK-005: Cross-Lane Conflicts | Medium | Medium | Medium | P2 |
| RISK-006: Auth Package Risk | High | Medium | High | P1 |
| RISK-007: Auto-Seeding Complexity | High | Medium | High | P1 |
| RISK-008: Mobile Performance | High | Medium | High | P1 |
| RISK-009: Telegram Reliability | Medium | Low | Low | P3 |
| RISK-010: Team Velocity | Medium | High | Medium | P2 |

---

## 3. Mitigation Summary

### Immediate Actions (Before Phase 1)
1. Resolve DEC-007 (Auth Package) — evaluate Better Auth compatibility
2. Resolve DEC-009 (Date Input) — define Ethiopian calendar input UX
3. Resolve DEC-010 (Soft Delete) — define delete behavior

### Before Phase 2
4. Install and validate Better Auth package
5. Set up auth integration test environment

### Before Phase 5
6. Resolve DEC-001 (Org Hierarchy) — confirm 5 sub-departments is final
7. Resolve DEC-003 (Plan Modification) — define distribution modification rules
8. Resolve DEC-004 (Approval Workflow) — define plan status lifecycle
9. Validate planning weight formula with Action PLN.xlsx data

### Before Phase 8
10. Evaluate Telegram bot rate limits and reliability

### Ongoing
11. Monitor free-tier usage
12. Enforce lane ownership to prevent merge conflicts
13. Regular standups to track velocity and blockers
