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
- `GET /api/v1/reports`: List generated periodic reports.
- `POST /api/v1/reports/generate`: Generate and consolidate a Weekly, Monthly, Quarterly, Half-Year, or Annual report.

### 2.6 Public & Announcements (`/api/v1/announcements`, `/api/v1/public`)
- `GET /api/v1/announcements`: List announcements with audience filters.
- `POST /api/v1/announcements`: Create and publish announcement (triggers Telegram webhook).
- `GET /api/v1/public/stats`: Public sanitized statistics (Active members count, Children count, Events count).
- `GET /api/v1/public/events/upcoming`: Public upcoming events with countdown timestamps.
- `GET /api/v1/public/announcements`: Public announcements for the portfolio website.
