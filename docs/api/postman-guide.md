# Postman API Testing Guide

## Hitsanat Kifl Children's Ministry Management System

---

## 1. Quick Start

### Import the Collection

1. Open Postman
2. Click **Import** (top-left)
3. Select **File** → choose `tests/postman/hitsanat-api.postman_collection.json`
4. The collection "Hitsanat Kifl API" appears in your workspace

### Set the Base URL

The collection variable `baseUrl` defaults to `http://localhost:3001`.

To change it:
1. Click the **Environments** tab (left sidebar)
2. Create a new environment (e.g. "Local Docker")
3. Add variable: `baseUrl` = `http://localhost:3001`
4. Select it in the top-right environment dropdown

---

## 2. Authentication Flow

The API uses cookie-based sessions (Better Auth). To authenticate:

1. Open **Authentication → POST /auth/sign-in/email**
2. Set your credentials in the request body:
   ```json
   {
     "email": "leader@hitsanat.org",
     "password": "your-password"
   }
   ```
3. Click **Send**
4. The test script automatically captures the `sessionCookie` variable from the `Set-Cookie` header
5. All subsequent requests use this cookie via the collection-level auth

To verify your session:
1. Open **Authentication → GET /auth/session**
2. Click **Send** — you should see your user profile and roles

---

## 3. Testing Endpoints by Module

### Members

| Request | What it does | Expected Status |
|:--------|:-------------|:----------------|
| `GET /members` | List all members (supports `?search=`, `?subDept=`) | `200` |
| `POST /members/stage-1` | Create a new member (fast creation) | `201` or `409` |
| `GET /members/:id` | Get full member profile | `200` |
| `PUT /members/:id/stage-2` | Enrich member with sub-dept allocations | `200` |
| `POST /members/:id/roles` | Assign leadership role | `200` or `409` |

**Workflow:**
1. Create a member via `POST /members/stage-1` → note the returned ID
2. Enrich via `PUT /members/:id/stage-2`
3. Assign role via `POST /members/:id/roles`
4. Verify via `GET /members/:id`

### Children

| Request | What it does | Expected Status |
|:--------|:-------------|:----------------|
| `GET /children` | List children (filters: `?group=Kutr 1`, `?location=`) | `200` |
| `POST /children` | Register a child | `201` |
| `GET /children/:id` | Get child profile + attendance stats | `200` |
| `POST /children/:id/parents` | Link parent to child (`Father` or `Mother`) | `201` or `409` |
| `PUT /children/:id/reclassify` | Move between Kutr 1 ↔ Kutr 2 | `200` |

### Attendance

| Request | What it does | Expected Status |
|:--------|:-------------|:----------------|
| `GET /attendance/sessions` | List Saturday & Sunday sessions | `200` |
| `GET /attendance/sessions/:id/roster` | Get seeded roster for a session | `200` |
| `PUT /attendance/records/:id` | Mark Present/Absent/Excused | `200` |
| `POST /attendance/sessions/:id/batch-verify` | Batch confirm attendance | `200` |
| `POST /attendance/transport-assignment` | Assign members to collection point | `201` |

### Planning

| Request | What it does | Expected Status |
|:--------|:-------------|:----------------|
| `GET /annual-plans` | List annual plans | `200` |
| `POST /annual-plans` | Create master plan | `201` |
| `POST /annual-plans/:id/goals` | Add a goal (Spiritual Education, etc.) | `201` |
| `POST /annual-plans/goals/:id/activities` | Add activity with Budget/People/Time | `201` |
| `POST /annual-plans/activities/:id/distribute` | Distribute to a sub-department | `200` |
| `GET /annual-plans/my-sub-department` | Get scoped plan for logged-in leader | `200` |
| `POST /annual-plans/weekly-tasks` | Schedule a weekly execution task | `201` |
| `POST /annual-plans/weekly-tasks/:id/progress` | Record progress + percentage | `200` |

### Events

| Request | What it does | Expected Status |
|:--------|:-------------|:----------------|
| `GET /events` | List events (`?type=`, `?upcoming=true`) | `200` |
| `POST /events` | Create special event (Timket, Hosaena, etc.) | `201` |
| `POST /events/:id/assign-program` | Assign program to sub-dept (≥2 members) | `200` |

### Public (No Auth Required)

| Request | What it does | Expected Status |
|:--------|:-------------|:----------------|
| `GET /public/stats` | Active members, children, events count | `200` |
| `GET /public/events/upcoming` | Upcoming events with countdown | `200` |
| `GET /public/announcements` | Published announcements | `200` |

---

## 4. Environment Variables

The collection uses these variables (auto-set by test scripts):

| Variable | Set by | Description |
|:---------|:-------|:------------|
| `baseUrl` | Manual | API base URL (default: `http://localhost:3001`) |
| `sessionCookie` | `POST /auth/sign-in/email` test | Auth session token |
| `memberId` | `POST /members/stage-1` test | Created member ID |
| `childId` | `POST /children` test | Created child ID |
| `parentId` | `POST /parents` test | Created parent ID |
| `familyId` | `POST /families` test | Created family ID |
| `planId` | `POST /annual-plans` test | Created plan ID |
| `goalId` | `POST /annual-plans/:id/goals` test | Created goal ID |
| `activityId` | `POST /annual-plans/goals/:id/activities` test | Created activity ID |
| `weeklyTaskId` | `POST /annual-plans/weekly-tasks` test | Created weekly task ID |
| `eventId` | `POST /events` test | Created event ID |
| `assessmentId` | `POST /academic/assessments` test | Created assessment ID |
| `sessionId` | Manual | Attendance session ID (from GET sessions) |
| `recordId` | Manual | Attendance record ID (from roster) |
| `subDeptId` | Manual | Sub-department ID (from GET sub-departments) |

**Tip:** After signing in and creating resources, check **Environment → Quick Look** (eye icon) to see all captured values.

---

## 5. Common Test Scenarios

### Scenario A: Full Member Lifecycle
```
1. POST /auth/sign-in/email        → authenticate
2. POST /members/stage-1           → create member
3. PUT /members/:id/stage-2        → enrich profile
4. POST /members/:id/roles         → assign role
5. GET /members/:id                → verify full profile
```

### Scenario B: Child Registration + Parent Linking
```
1. POST /parents                   → create parent
2. POST /children                  → register child
3. POST /children/:id/parents      → link Father
4. POST /children/:id/parents      → link Mother (409 if already exists)
5. GET /children/:id               → verify linked parents
```

### Scenario C: Attendance Session
```
1. GET /attendance/sessions        → find session ID
2. GET /attendance/sessions/:id/roster  → get roster
3. PUT /attendance/records/:recordId    → mark each member
4. POST /attendance/sessions/:id/batch-verify  → confirm
```

### Scenario D: Annual Plan → Weekly Task
```
1. POST /annual-plans              → create plan
2. POST /annual-plans/:id/goals    → add goal
3. POST /annual-plans/goals/:id/activities  → add activity
4. POST /annual-plans/activities/:id/distribute  → assign to sub-dept
5. POST /annual-plans/weekly-tasks → schedule task
6. POST /annual-plans/weekly-tasks/:id/progress  → record progress
```

---

## 6. Newman CLI (Automated Testing)

Run the collection from the command line:

```bash
# Install Newman globally
npm install -g newman

# Run all requests
newman run tests/postman/hitsanat-api.postman_collection.json

# Run with environment file
newman run tests/postman/hitsanat-api.postman_collection.json \
  --environment tests/postman/local.env.json

# Run with reporters
newman run tests/postman/hitsanat-api.postman_collection.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export tests/postman/report.html
```

---

## 7. Troubleshooting

| Problem | Solution |
|:--------|:---------|
| `401 Unauthorized` on all requests | Run `POST /auth/sign-in/email` first to get session cookie |
| `ECONNREFUSED` | Ensure Docker containers are running: `docker compose ps` |
| `404 Not Found` | Endpoint not implemented yet — check `docs/api/endpoints.md` |
| `500 Internal Server Error` | Check API logs: `docker compose logs api` |
| Variables not updating | Click the eye icon → check if `sessionCookie` is set |
| `409 Conflict` | Resource already exists (e.g., duplicate parent relation) — expected behavior |

---

## 8. File Locations

```
tests/postman/
  hitsanat-api.postman_collection.json   ← import this into Postman
docs/api/
  postman-guide.md                       ← this document
  endpoints.md                           ← full API spec
  authentication.md                      ← auth flow details
```
