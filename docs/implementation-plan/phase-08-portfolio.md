# Phase 8 — Portfolio & Public Features

## Objective

Implement the public-facing portfolio website and announcement system. This phase delivers the zero-authentication public showcase that parents, community members, and the general public interact with.

## Scope

### Included
- Public API endpoints (stats, events, announcements)
- Portfolio home page with ministry overview
- Event countdown displays
- Announcement feed
- Live sanitized statistics
- Announcement publishing workflow (Admin → Portfolio + Telegram)
- Telegram bot service (apps/telegram)

### Out of Scope
- Admin features (earlier phases)
- Authentication (Phase 2 — already complete)
- Planning (Phase 5 — already complete)

---

## Dependencies

- Phase 6 complete (events, announcements data)
- Phase 7 complete (reports data for statistics)

---

## Lanes

| Person | Role | Responsibility |
|:---|:---|:---|
| Abrham | Core + Backend | PRIMARY — Telegram service architecture, public API security, announcement API |
| Israel | Backend Support | SUPPORT — Announcement CRUD, Telegram worker, tests |
| Eyob | Frontend Developer | PRIMARY — Portfolio home page, event countdown displays |
| TBD | Frontend Developer | PRIMARY — Announcement feed, public stats display |

---

## Tasks

### PTF-001
**Announcement API: CRUD & Publishing**

- **Description:** Implement announcement endpoints: `POST /api/v1/announcements`, `GET /api/v1/announcements`, `PUT /api/v1/announcements/:id/publish`. Publishing triggers public sync per FR-11.1.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** FND-005, AUTH-003
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Announcement CRUD (title, content, target_audience)
  - Target audience: Public, Members, Parents
  - Publish endpoint sets is_published=true, published_at
  - RBAC: Ekd and Chairperson can publish
  - Telegram broadcast flag
- **Reviewer:** Core

### PTF-002
**Public API: Stats & Events**

- **Description:** Implement public (no-auth) endpoints: `GET /api/v1/public/stats`, `GET /api/v1/public/events`, `GET /api/v1/public/announcements`. Sanitized data per FR-11.3.
- **Lane:** Backend
- **Priority:** High
- **Dependencies:** PTF-001
- **Deliverable:** Endpoints + integration tests
- **Acceptance Criteria:**
  - Public stats (active members, enrolled children, completed events)
  - No PII exposed (FR-11.3)
  - Published events with countdown data
  - Published announcements
  - No authentication required
  - Rate limiting applied
- **Reviewer:** Core

### PTF-003
**Telegram Bot Service**

- **Description:** Create `apps/telegram` standalone worker service. Polls or listens for published announcements and posts to Telegram group per FR-12.1 and FR-12.2. Deploy on Railway per OD-01.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** PTF-001
- **Deliverable:** Telegram worker service + tests
- **Acceptance Criteria:**
  - Standalone Node.js service
  - Polls for published announcements
  - Formats messages for Telegram
  - Posts to Hitsanat Kifl Telegram group
  - Handles connection errors gracefully
  - Docker configuration for Railway
- **Reviewer:** Core

### PTF-004
**Portfolio Home Page**

- **Description:** Build the portfolio home page in `apps/portfolio`. Ministry overview, welcome message, Ethiopian calendar display.
- **Lane:** Frontend 1
- **Priority:** High
- **Dependencies:** PTF-002
- **Deliverable:** Home page + Playwright E2E + a11y test
- **Acceptance Criteria:**
  - Ministry overview section
  - Welcome message in Amharic
  - Ethiopian calendar display
  - Mobile-responsive
  - Accessible (WCAG 2.1 AA)
  - Zero authentication required
- **Reviewer:** Core, Frontend 1

### PTF-005
**Event Countdown Displays**

- **Description:** Build event countdown components in `apps/portfolio`. Display countdowns for upcoming feasts and events per FR-11.2.
- **Lane:** Frontend 1
- **Priority:** High
- **Dependencies:** PTF-002
- **Deliverable:** Countdown components + tests
- **Acceptance Criteria:**
  - Countdown timer for upcoming events
  - Event type display (Special, Monthly, Ad-hoc)
  - Ethiopian calendar date display
  - Auto-refresh when event passes
  - Mobile-responsive
- **Reviewer:** Core, Frontend 1

### PTF-006
**Announcement Feed**

- **Description:** Build the announcement feed in `apps/portfolio`. Display published announcements sorted by date per FR-11.2.
- **Lane:** Frontend 1
- **Priority:** High
- **Dependencies:** PTF-002
- **Deliverable:** Announcement feed + tests
- **Acceptance Criteria:**
  - Announcements sorted by published_at (newest first)
  - Target audience filtering
  - Title and content display
  - Published date in Ethiopian calendar
  - Mobile-responsive
- **Reviewer:** Core, Frontend 1

### PTF-007
**Public Stats Display**

- **Description:** Build the public stats section in `apps/portfolio`. Display sanitized aggregate statistics per FR-11.3.
- **Lane:** Frontend 1
- **Priority:** Medium
- **Dependencies:** PTF-002
- **Deliverable:** Stats component + tests
- **Acceptance Criteria:**
  - Active student members count
  - Enrolled children count
  - Completed events count
  - No PII exposed
  - Animated counters (optional)
  - Mobile-responsive
- **Reviewer:** Core, Frontend 1

### PTF-008
**Portfolio E2E & Accessibility Tests**

- **Description:** Write Playwright E2E tests for portfolio pages and axe-core accessibility tests per ADR-0010.
- **Lane:** Frontend 1
- **Priority:** High
- **Dependencies:** PTF-004, PTF-005, PTF-006
- **Deliverable:** E2E test suite + a11y test suite
- **Acceptance Criteria:**
  - Home page E2E test
  - Event countdown E2E test
  - Announcement feed E2E test
  - axe-core WCAG 2.1 AA tests pass
  - Mobile viewport tests
- **Reviewer:** Core, Frontend 1

### PTF-009
**Portfolio Integration Tests**

- **Description:** Write integration tests for public API endpoints and announcement publishing workflow.
- **Lane:** Backend Support
- **Priority:** High
- **Dependencies:** PTF-001, PTF-002
- **Deliverable:** Integration test suite
- **Acceptance Criteria:**
  - Public stats endpoint tested
  - Public events endpoint tested
  - Public announcements endpoint tested
  - No PII in public responses verified
  - Rate limiting tested
- **Reviewer:** Core

### PTF-010
**OpenAPI Public & Announcement Documentation**

- **Description:** Update Swagger/OpenAPI specification with public and announcement endpoint documentation.
- **Lane:** Backend Support
- **Priority:** Medium
- **Dependencies:** PTF-001, PTF-002
- **Deliverable:** Updated OpenAPI spec
- **Acceptance Criteria:**
  - Public endpoints documented
  - Announcement endpoints documented
  - Authentication requirements clear (public = none)
  - Error responses documented
- **Reviewer:** Core

---

## Parallel Work

**Can run in parallel:**
- PTF-001 and PTF-004 (independent backend and frontend)
- PTF-005 and PTF-006 (independent portfolio components)
- PTF-008 and PTF-009 (independent test suites)

**Must happen sequentially:**
- PTF-002 depends on PTF-001
- PTF-004, PTF-005, PTF-006 depend on PTF-002
- PTF-008 depends on PTF-004, PTF-005, PTF-006

---

## Deliverables

1. Announcement CRUD and publishing API
2. Public API (stats, events, announcements)
3. Telegram bot service
4. Portfolio home page
5. Event countdown displays
6. Announcement feed
7. Public stats display
8. Portfolio E2E and accessibility tests
9. Integration test suite
10. OpenAPI documentation

---

## Exit Criteria

- [ ] Announcement publishing works end-to-end
- [ ] Public API returns sanitized data (no PII)
- [ ] Telegram service posts announcements
- [ ] Portfolio home page functional
- [ ] Event countdowns display correctly
- [ ] Announcement feed works
- [ ] Public stats display correctly
- [ ] Zero authentication required for portfolio
- [ ] All E2E tests pass
- [ ] All accessibility tests pass (WCAG 2.1 AA)
- [ ] All integration tests pass
- [ ] OpenAPI documentation updated
- [ ] CI passes
- [ ] `pnpm prepare` passes
