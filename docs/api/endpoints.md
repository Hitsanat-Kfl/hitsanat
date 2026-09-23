# API Endpoints Specification

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Complete REST Resource Inventory**  

---

## 1. Summary of Endpoints by Module

| Module | Base Route | Key Operations |
| :--- | :--- | :--- |
| **Members** | `/api/v1/members` | Stage 1 creation, Stage 2 enrichment, role allocation, family assignment |
| **Families** | `/api/v1/families` | Family CRUD, Father/Mother assignment, roster retrieval |
| **Children** | `/api/v1/children` | Child registration, group classification (`Kutr 1/2`), birthday queries |
| **Parents** | `/api/v1/parents` | Parent CRUD, child-parent linking (Max 1 Father, 1 Mother) |
| **Sub-Departments** | `/api/v1/sub-departments` | List sub-departments, member rosters, scoped dashboard data |
| **Attendance** | `/api/v1/attendance` | Session rosters, auto-seeded record verification, transport attendance |
| **Academic** | `/api/v1/academic` | Curriculum management, assessment setup, student scores |
| **Planning** | `/api/v1/annual-plans` | Master plan creation, activity weights, sub-dept distribution, weekly roll-up |
| **Events** | `/api/v1/events` | Special event scheduling, multi-member program assignment, countdowns |
| **Reports** | `/api/v1/reports` | Periodic reports (Weekly, Monthly, Quarterly, Half-Year, Annual) |
| **Announcements** | `/api/v1/announcements` | Announcement publishing, public feed, Telegram triggers |
| **Public Portfolio**| `/api/v1/public` | Public stats, event countdowns, published news (No login required) |
| **Users** | `/api/v1/users` | Account CRUD, stats, password reset, deactivation (BR-008) |
| **System Metadata** | `/api/v1/system-metadata` | Seed/migration status rows for the Super Admin dashboard (SUPER_ADMIN only) |
| **Audit Logs** | `/api/v1/audit-logs` | Administrative action trail (SUPER_ADMIN/CHAIRPERSON only) |
| **Notifications** | `/api/v1/notifications` | In-app notification feed (approval requests, meeting reminders, reactivation events) |
| **Approvals Inbox** | `/api/v1/approvals` | Unified pending-approval feed for executive dashboards (ADR-0018) |

---

## 2. Granular Endpoint Catalog

### 2.1 Member Management (`/api/v1/members`)
- `GET /api/v1/members`: Query members with filters (`search`, `subDept`, `familyId`, `yearOfStudy`, `isActive`).
- `POST /api/v1/members/stage-1`: Fast initial member creation by Secretary (`FullName`, `ChristianName`, `Phone`, `YearOfStudy`, `AcademicDepartment`, `Campus`, `Gender`).
- `PUT /api/v1/members/:id/stage-2`: Enrich profile (Sub-department allocations, family link, photo upload, telegram handle).
- `POST /api/v1/members/:id/roles`: Assign global or sub-department leadership roles.
- `GET /api/v1/members/:id`: Fetch complete member profile with assignments and activity history.

### 2.2 Children & Parents (`/api/v1/children`, `/api/v1/parents`)
- `GET /api/v1/children`: List children with filters (`group`, `location`, `birthdayMonth`, `search`).
- `POST /api/v1/children`: Register a child with collection location and cohort group.
- `GET /api/v1/children/:id`: Get child profile, test history, attendance stats, and linked parents.
- `POST /api/v1/children/:id/parents`: Link child to a parent (`relation`: `Father` or `Mother`). Returns `409 Conflict` if duplicate relation exists.
- `PUT /api/v1/children/:id/reclassify`: Reclassify child between `Kutr 1` and `Kutr 2`.
- `GET /api/v1/parents`: Search parents by name or phone.

### 2.3 Planning & Strategy (`/api/v1/annual-plans`)
- `GET /api/v1/annual-plans`: List annual plans by academic year.
- `POST /api/v1/annual-plans`: Create master plan with title and academic year.
- `POST /api/v1/annual-plans/:id/goals`: Add a master goal (e.g. Goal 1: Spiritual Education).
- `POST /api/v1/annual-plans/goals/:goalId/activities`: Add an activity with Budget, People, Time; auto-calculates weight %.
- `POST /api/v1/annual-plans/activities/:activityId/distribute`: Distribute activity to a sub-department.
- `GET /api/v1/annual-plans/my-sub-department`: Fetch scoped distributed plan for the logged-in sub-department leader.
- `POST /api/v1/annual-plans/weekly-tasks`: Schedule a weekly execution task.
- `POST /api/v1/annual-plans/weekly-tasks/:id/progress`: Record weekly execution results and progress percentage.

### 2.4 Attendance Tracking (`/api/v1/attendance`)
- `GET /api/v1/attendance/sessions`: Query Saturday & Sunday sessions.
- `GET /api/v1/attendance/sessions/:sessionId/roster`: Get auto-seeded attendance roster for a session.
- `PUT /api/v1/attendance/records/:recordId`: Update attendance status (`Present`, `Absent`, `Excused`).
- `POST /api/v1/attendance/sessions/:sessionId/batch-verify`: Batch confirm attendance for a location or cohort.
- `POST /api/v1/attendance/transport-assignment`: Assign 2+ members to a Saturday collection point.

### 2.5 Events & Reports (`/api/v1/events`, `/api/v1/reports`)
- `GET /api/v1/events`: List events with filters (`type`, `upcoming`, `published`).
- `POST /api/v1/events`: Create special event (Timket, Hosaena, Awdemerit, Adar).
- `POST /api/v1/events/:id/assign-program`: Assign program segment to a sub-department with $\ge 2$ members.
- `PATCH /api/v1/events/:id/approve`: Approve event and toggle the publish flag (triggers website countdown and Telegram broadcast). **CHAIRPERSON or SUB_CHAIRPERSON only** (ADR-0018).
- `GET /api/v1/reports`: List generated periodic reports.
- `POST /api/v1/reports/generate`: Generate and consolidate a Weekly, Monthly, Quarterly, Half-Year, or Annual report.
- `PATCH /api/v1/reports/:id/approve`: Executive sign-off; archives the approved report (`ApprovePeriodicReportUseCase`). **CHAIRPERSON or SUB_CHAIRPERSON only** (ADR-0018).

### 2.5a Unified Approvals Inbox (`/api/v1/approvals`)
> **Authorization:** All endpoints restricted to `CHAIRPERSON` and `SUB_CHAIRPERSON` (ADR-0018); read access also granted to `SUPER_ADMIN`.

Aggregated read-only view over the three approval domains (plan changes §2.22, report sign-offs §2.5, event approvals §2.5) for the executive dashboards' Approvals Inbox:

- `GET /api/v1/approvals?status=pending`: Unified pending-approval feed across domains, with `?domain=plan|report|event` filter. Each item carries `domain`, `resourceId`, `submittedBy`, `submittedAt`, and a `reviewHref` pointing to the owning module endpoint.
- `GET /api/v1/approvals/summary`: Counts per domain and per status for badge/indicator widgets.

> Review actions are **not** exposed here; they remain on the owning module endpoints above so that domain-specific validation, comments, and audit trails stay in one place.

### 2.6 Public & Announcements (`/api/v1/announcements`, `/api/v1/public`)
> **Authorization:** Create/publish restricted to `EKD_LEADER` and `CHAIRPERSON` (FR-11.1); `SUPER_ADMIN` per §4.3 bypass.

- `GET /api/v1/announcements`: List announcements with audience filters.
- `POST /api/v1/announcements`: Create and publish announcement (triggers Telegram webhook).
- `GET /api/v1/public/stats`: Public sanitized statistics (Active members count, Children count, Events count).
- `GET /api/v1/public/events/upcoming`: Public upcoming events with countdown timestamps.
- `GET /api/v1/public/announcements`: Public announcements for the portfolio website.

### 2.7 User Management (`/api/v1/users`)
> **Authorization:** BR-008 — Restricted to `SUPER_ADMIN` and `CHAIRPERSON` global roles.

- `POST /api/v1/users`: Create a new user account with name, email, password, and role (BR-007 member link required for leadership).
- `GET /api/v1/users`: List user accounts with pagination and filters (`search`, `role`, `status=ACTIVE|DEACTIVATED`).
- `GET /api/v1/users/stats`: Authoritative account lifecycle counts — `{ total, active, deactivated, byRole }` (FR-13.4).
- `GET /api/v1/users/:id`: Get a specific user's details.
- `PATCH /api/v1/users/:id`: Update user details (name, email, role, member link); revalidates BR-007/BR-009 (FR-13.7).
- `POST /api/v1/users/:id/reset-password`: Reset a user's password to a temporary value.
- `POST /api/v1/users/:id/deactivate`: Deactivate a user account (bans Supabase Auth account).
- `POST /api/v1/users/:id/reactivate`: Restore a deactivated account (FR-13.6).
- `POST /api/v1/users/:id/revoke-sessions`: Force sign-out of live sessions (FR-13.13).

### 2.7a System Metadata (`/api/v1/system-metadata`)
> **Authorization:** `SUPER_ADMIN` only.

- `GET /api/v1/system-metadata`: Key-value seed/migration status rows (`schema_tag`, `seed_status`) used by the Super Admin System Status panel (FR-13.4).

### 2.8 Audit Logs (`/api/v1/audit-logs`)
> **Authorization:** Restricted to `SUPER_ADMIN` and `CHAIRPERSON` global roles.

- `GET /api/v1/audit-logs`: List recent audit log entries with `?limit=N` query parameter. Returns entries with: id, action, resourceType, resourceId, payloadDiff, ipAddress, timestamp. `payloadDiff` is a text field (`email=...; role=...`).

**Logged Actions:**
| Action | Description |
| :--- | :--- |
| `USER_CREATED` | New user account provisioned |
| `USER_UPDATED` | User details modified (field-level diff) |
| `USER_DEACTIVATED` | User account deactivated |
| `USER_REACTIVATED` | Deactivated account restored (FR-13.6) |
| `PASSWORD_RESET` | User password reset |
| `SESSIONS_REVOKED` | Live sessions force-signed-out (FR-13.13) |
| `BYPASS_ACTION` | Write performed under the SUPER_ADMIN permission bypass (FR-13.12) |

### 2.9 Leadership Meetings (`/api/v1/meetings`)
> **Authorization:** Restricted to `CHAIRPERSON`, `SUB_CHAIRPERSON`, and `SECRETARY` for create/update/delete; all leadership roles for read access.

- `POST /api/v1/meetings`: Create a new meeting (title, datetime, location, agenda, invitees, recurring config).
- `GET /api/v1/meetings`: List meetings with optional filters (`?status=upcoming|completed|cancelled`, `?department=timihrt`).
- `GET /api/v1/meetings/:id`: Get meeting details including attendees and minutes.
- `PATCH /api/v1/meetings/:id`: Update meeting details (CHAIRPERSON, SUB_CHAIRPERSON, or SECRETARY — BR-019).
- `DELETE /api/v1/meetings/:id`: Cancel a meeting (CHAIRPERSON, SUB_CHAIRPERSON, or SECRETARY — BR-019).
- `POST /api/v1/meetings/:id/attendance`: Mark attendance for meeting attendees.
- `POST /api/v1/meetings/:id/minutes`: Record meeting minutes with action items.
- `GET /api/v1/meetings/:id/minutes`: Retrieve meeting minutes.

### 2.10 Bulk Import/Export (`/api/v1/bulk-import`)
> **Authorization:** Restricted to `SECRETARY`, `CHAIRPERSON`, and `SUPER_ADMIN`.

- `POST /api/v1/bulk-import/members`: Import members from CSV/Excel data array.
- `POST /api/v1/bulk-import/children`: Import children from CSV/Excel data array.
- `POST /api/v1/bulk-import/parents`: Import parents from CSV/Excel data array.
- `GET /api/v1/bulk-import/members/export`: Export members as CSV download.
- `GET /api/v1/bulk-import/children/export`: Export children as CSV download.
- `GET /api/v1/bulk-import/parents/export`: Export parents as CSV download.
- `GET /api/v1/bulk-import/jobs`: List import job history with status.

### 2.11 Member Transfers (`/api/v1/member-transfers`)
> **Authorization:** Restricted to `SECRETARY`.

- `POST /api/v1/member-transfers`: Transfer member between sub-departments (memberId, fromSubDepartment, toSubDepartment, reason).
- `GET /api/v1/member-transfers`: List transfer history with filters (`?memberId=`, `?subDepartment=`).
- `GET /api/v1/member-transfers/:id`: Get transfer details.

### 2.12 Registration Analytics (`/api/v1/analytics/registration`)
> **Authorization:** Restricted to `SECRETARY`, `CHAIRPERSON`, `SUPER_ADMIN`.

- `GET /api/v1/analytics/registration/trends`: Registration trend data over time (daily/weekly/monthly).
- `GET /api/v1/analytics/registration/demographics`: Gender, campus, year_of_study breakdown.
- `GET /api/v1/analytics/registration/sub-departments`: Sub-department distribution counts.
- `GET /api/v1/analytics/registration/growth`: Growth metrics (new vs inactive members).

### 2.13 Batch Operations (`/api/v1/batch`)
> **Authorization:** Restricted to `SECRETARY`.

- `POST /api/v1/batch/activate`: Activate multiple members by IDs array.
- `POST /api/v1/batch/deactivate`: Deactivate multiple members by IDs array.
- `POST /api/v1/batch/assign-subdepartment`: Assign multiple members to a sub-department.
- `POST /api/v1/batch/update-status`: Update status for multiple members.

### 2.14 Data Quality (`/api/v1/data-quality`)
> **Authorization:** Restricted to `SECRETARY`.

- `GET /api/v1/data-quality/check`: Run data quality check and return issues.
- `GET /api/v1/data-quality/issues`: List all unresolved data quality issues.
- `PATCH /api/v1/data-quality/issues/:id/resolve`: Mark issue as resolved.
- `GET /api/v1/data-quality/scores`: Field completeness scores per entity type.

### 2.15 Parent Contact Directory (`/api/v1/parent-directory`)
> **Authorization:** Restricted to `SECRETARY`.

- `GET /api/v1/parent-directory`: List all parents with search (`?search=`, `?childName=`).
- `GET /api/v1/parent-directory/:id`: Get parent details with linked children.
- `GET /api/v1/parent-directory/export`: Export parent directory as CSV.

### 2.16 Family Tree (`/api/v1/family-tree`)
> **Authorization:** Restricted to `SECRETARY`.

- `GET /api/v1/family-tree/:familyId`: Get family tree visualization data (parents, children, relationships).
- `GET /api/v1/family-tree/member/:memberId`: Get family tree for a specific member.

### 2.17 Secretary Audit Trail (`/api/v1/secretary-audit`)
> **Authorization:** Restricted to `SECRETARY`.

- `GET /api/v1/secretary-audit`: List audit trail with filters (`?action=`, `?dateFrom=`, `?dateTo=`, `?actor=`).
- `GET /api/v1/secretary-audit/:id`: Get audit entry details with before/after values.

### 2.18 Report Card Generator (`/api/v1/report-cards`)
> **Authorization:** Restricted to `TIMIHRT_LEADER`.

- `POST /api/v1/report-cards/generate`: Generate single student report card (childId, academicYear, academicPeriod, templateId).
- `POST /api/v1/report-cards/batch`: Generate batch report cards for entire class (kutrGroup, academicYear, academicPeriod, templateId).
- `GET /api/v1/report-cards`: List generated report cards with filters (`?childId=`, `?academicYear=`, `?academicPeriod=`).
- `GET /api/v1/report-cards/:id`: Get report card details with grades and summary.
- `GET /api/v1/report-cards/:id/download`: Download report card as PDF or Excel file.
- `GET /api/v1/report-cards/templates`: List available report card templates.
- `GET /api/v1/report-cards/templates/:id`: Get template details.
- `POST /api/v1/report-cards/preview`: Preview report card data before generation (childId, academicYear, academicPeriod).

### 2.19 Kutitr Route Performance (`/api/v1/kutitr/routes`)
> **Authorization:** Restricted to `KUTITR_LEADER`.

- `GET /api/v1/kutitr/routes/performance`: Get route performance statistics with filters (`?route=`, `?dateFrom=`, `?dateTo=`, `?sessionType=`).
- `GET /api/v1/kutitr/routes/performance/:routeName`: Get detailed stats for specific route.
- `POST /api/v1/kutitr/routes/performance`: Record route performance data (routeName, sessionDate, sessionType, expectedChildren, pickedUpChildren, avgPickupTime).
- `GET /api/v1/kutitr/routes/issues`: List all route issues with filters (`?route=`, `?resolved=`, `?dateFrom=`, `?dateTo=`).
- `POST /api/v1/kutitr/routes/issues`: Log a new route issue (routeName, sessionDate, issueType, description, childId).
- `PATCH /api/v1/kutitr/routes/issues/:id/resolve`: Mark issue as resolved.

### 2.20 Parent Contact Quick View (`/api/v1/kutitr/parent-contacts`)
> **Authorization:** Restricted to `KUTITR_LEADER`.

- `GET /api/v1/kutitr/parent-contacts/route/:routeName`: Get parent contacts for children on specific route.
- `GET /api/v1/kutitr/parent-contacts/search`: Search parent contacts by child or parent name (`?search=`).
- `GET /api/v1/kutitr/parent-contacts/child/:childId`: Get parent contacts for specific child.

### 2.21 Emergency Contact Database (`/api/v1/kutitr/emergency-contacts`)
> **Authorization:** Restricted to `KUTITR_LEADER`.

- `GET /api/v1/kutitr/emergency-contacts`: List all emergency contacts with search (`?search=`, `?route=`, `?collectionPoint=`).
- `GET /api/v1/kutitr/emergency-contacts/:childId`: Get emergency contacts for specific child.
- `GET /api/v1/kutitr/emergency-contacts/export`: Export emergency contacts as CSV.

### 2.22 Ekd Plan Approval Workflow (`/api/v1/ekd/approvals`)
> **Authorization:** Restricted to `EKD_LEADER` (submit) and `CHAIRPERSON`/`SUB_CHAIRPERSON` (review — ADR-0018).

- `GET /api/v1/ekd/approvals`: List all approval requests with filters (`?status=`, `?submittedBy=`).
- `POST /api/v1/ekd/approvals`: Submit plan change for approval (planId, changeType, changeDescription, currentValue, proposedValue).
- `GET /api/v1/ekd/approvals/:id`: Get approval request details.
- `PATCH /api/v1/ekd/approvals/:id/review`: Review approval request (status: approved/rejected/revision_needed, reviewComments). **Chairperson or Sub-Chairperson (ADR-0018).**
- `PATCH /api/v1/ekd/approvals/:id/revise`: Revise rejected approval for resubmission. **Ekd Leader only.**

### 2.23 Ekd Progress Heatmap (`/api/v1/ekd/progress-heatmap`)
> **Authorization:** Restricted to `EKD_LEADER`.

- `GET /api/v1/ekd/progress-heatmap`: Get heatmap data for all sub-departments (`?year=`, `?quarter=`).
- `GET /api/v1/ekd/progress-heatmap/:subDeptId`: Get heatmap data for specific sub-department.
- `POST /api/v1/ekd/progress-heatmap`: Update progress for a sub-department/goal combination (subDeptId, goalId, activityId, completionPercentage, notes).
- `GET /api/v1/ekd/progress-heatmap/summary`: Get summary statistics (average completion, most/least progress).

### 2.24 Notifications (`/api/v1/notifications`)
> **Authorization:** Authenticated leadership users; each user sees only their own feed.

In-app notification feed backing FR-17.1 (approval notifications) and FR-13.1.2 (meeting reminders). Telegram delivery remains with the standalone bot service (ADR-0006).

- `GET /api/v1/notifications`: List the current user's notifications with filters (`?unread=true`, `?type=`).
- `PATCH /api/v1/notifications/:id/read`: Mark a single notification as read.
- `POST /api/v1/notifications/read-all`: Mark all of the current user's notifications as read.
- `GET /api/v1/notifications/unread-count`: Unread count for badge indicators.

**Notification Types:**
| Type | Trigger | Recipients |
| :--- | :--- | :--- |
| `PLAN_APPROVAL_REQUESTED` | Ekd submits a plan change for review (FR-17.1) | CHAIRPERSON, SUB_CHAIRPERSON |
| `PLAN_APPROVAL_DECIDED` | Executive approves/rejects/requests revision | Submitting Ekd Leader |
| `REPORT_AWAITING_SIGNOFF` | Periodic report generated | CHAIRPERSON, SUB_CHAIRPERSON |
| `EVENT_AWAITING_APPROVAL` | Event created pending publish approval | CHAIRPERSON, SUB_CHAIRPERSON |
| `MEETING_REMINDER_24H` / `MEETING_REMINDER_1H` | Scheduled reminder job (FR-13.1.2) | Meeting invitees |
| `USER_REACTIVATED` | Account restored (FR-13.6) | CHAIRPERSON, SUPER_ADMIN |
