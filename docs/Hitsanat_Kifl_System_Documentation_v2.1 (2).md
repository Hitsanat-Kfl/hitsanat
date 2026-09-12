# HITSANAT KIFL

### Children's Ministry Management System

**Haramaya University Gibi Gubae**

**Full System Documentation**
Version 2.1 | August 2026
_Prepared for: Hitsanat Kifl Leadership, Project Manager & Development Team_

---

## Version 2.1 — Update Summary

This version updates the original Version 1.0 documentation (June 2026) with decisions made in subsequent planning sessions. Key changes:

- Weekly schedule times updated: Saturday 8:00–11:30 (was 1:00–5:30), Sunday 8:00–10:00 (was 2:00–4:00)
- Tech stack finalized (Section 11 in v1.0 was "recommendations only" — now confirmed)
- Architecture approach formalized: Domain-Driven Design, Clean Architecture, Modular Monolith, Feature-Based Modules, with Architecture Decision Records
- Repository structure defined (Turborepo monorepo, 4 apps, multiple shared packages)
- Parent data model clarified: a child has at most one Father and one Mother record — never more than one of either
- Parent detail requirements expanded — full contact/address detail required, not just name and phone
- RBAC model formalized as scoped roles (department-level and sub-department-level), not a flat role field
- Member attendance auto-seeds from activity assignment rather than separate manual entry
- Telegram Bot confirmed as its own standalone application, not a route within the main backend
- Ethiopian calendar support confirmed as a core requirement, with dates stored as Gregorian and converted at the application boundary
- Twelve Architecture Decision Records (ADRs) documented — see Section 14
- Backend ownership updated: Abrham serves as Core Backend Lead; Israel contributes beginner-safe tasks under mandatory review
- **Access model clarified**: regular members (no leadership role) have _no_ admin/dashboard access at all — they only ever use the public portfolio website, with no login and no personalized content there. Only leadership (sub-department leaders and above) use the management system.
- Annual Action Plan expanded into a structured planning hierarchy: Annual → Quarterly → Monthly → Weekly, with special/event plans and sub-department distribution.
- Action Plan fields added: goals, main activities, expected results, annual targets, execution period, budget, human resources, time and weight.
- Backend framework changed from Fastify to Express.js with TypeScript.
- shadcn/ui customization formalized using preset `b1D0f7S7` with the Next.js template and shared `packages/ui`.
- Ethiopian calendar implementation formalized around `ethiopian-calendar-new` through the shared `packages/calendar` package.
- Docker added for reproducible local development, PostgreSQL and integration-test infrastructure.
- Biome added as the project linting, formatting and import-organization tool.
- Layered testing strategy added: Vitest, Playwright, React Testing Library, axe, Zod contract tests, real PostgreSQL integration tests, RBAC/security tests and smoke tests.
- Additional ADRs added for Express.js, shadcn/ui, testing, Ethiopian calendar tooling and Docker.

---

## 1. System Overview

The Hitsanat Kifl Digital System is a two-application platform designed to support the Children's Ministry of Haramaya University Gibi Gubae. The system serves members (university students), Kifl leadership, sub-department leaders, children, and parents.

### 1.1 Applications

| App                       | Type      | Purpose                                                                                    | Audience                                           |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Portfolio Website         | Public    | Showcase the Kifl, display activities, events, announcements and countdowns                | Public, Parents, Members (no login)                |
| Management System (Admin) | Private   | Manage members, children, families, sub-departments, attendance, scores, plans and reports | Leadership only (sub-department leaders and above) |
| Telegram Bot              | Automated | Post announcements, scheduled messages, and reminders                                      | Members, Public (via group)                        |

### 1.2 System Goals

- Digitize all Hitsanat Kifl operations and workflows
- Provide role-based access for every leader
- Track children's attendance, scores and progress
- Manage family and sub-department assignments
- Generate plans and reports at weekly, monthly, quarterly and annual levels
- Publish announcements and event countdowns to the public website
- Integrate with Telegram for announcements
- Support the Ethiopian calendar throughout (dates, holidays, birthdays, event scheduling)

### 1.3 Key Stakeholders

| Stakeholder            | Role in System                                                   |
| ---------------------- | ---------------------------------------------------------------- |
| Chairperson            | Full system access, overall oversight                            |
| Sub-Chairperson        | Deputy access, assists Chairperson                               |
| Secretary              | Member registration, records management                          |
| Sub-Department Leaders | Manage their own department dashboard                            |
| Regular Members        | No admin access — view the public portfolio site only            |
| Children               | Tracked for attendance and academic scores (data only, no login) |
| Parents                | Registered and linked to their children (data only, no login)    |
| Super Admin            | Full control of the system, including permissions                |
| Project Manager        | System oversight and development management                      |
| Developers             | Build and maintain the system                                    |

---

## 2. Organization Structure

### 2.1 Overview

Hitsanat Kifl is a sub-department of Haramaya University Gibi Gubae. All members are university students from 1st year through graduation (GC). Children and their parents are not members of the Kifl but are served by it.

### 2.2 Kifl Leadership

| Position        | Description                                            |
| --------------- | ------------------------------------------------------ |
| Chairperson     | Overall head of Hitsanat Kifl                          |
| Sub-Chairperson | Deputy to the Chairperson                              |
| Secretary       | Handles records, registration and administrative tasks |

### 2.3 Family System (ቤተሰብ)

- Each family has one Father (senior male member) and one Mother (senior female member)
- Remaining members are the "children" of that family
- A member can serve as a Father or Mother in one family while simultaneously being a child member in another family
- Existing members retain their family and sub-department assignments across academic years (no annual reset)
- New members (freshmen, transfer students, or upperclassmen) are assigned incrementally to families and sub-departments upon enrollment
- The term "Khnet" is reserved for church service titles (e.g. Deacon / 디ያቆን); operational family units are designated as Family (ቤተሰብ)

### 2.4 Sub-Departments

Every member must belong to at least one sub-department, and may belong to more than one. Sub-departments each have their own leadership structure.

| Sub-Department | Amharic | Role                                                                                                                                      |
| -------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Timihrt        | ትምህርት   | Prepares children's educational roadmap and assigns teachers from its own members; tracks academic results and exams                      |
| Mezmur         | መዝሙር    | Prepares song playlists and assigns Mezmur Astegni (song leaders) from its members                                                        |
| Kutitr         | ቁጥጥር     | Tracks children's attendance, manages transportation, tracks member activity and family-based organization                                |
| Ekd            | እቅድ     | Organizes events and activities; generates weekly, monthly, quarterly, half-year and full-year plans and reports from all sub-departments |
| Kinetibeb      | ኪነ-ጥበብ  | Prepares religious films, Yeteret Abat programs, and assigns members to the schedule; leads specific programs during special events       |

Each sub-department has: Leader, Sub-Leader, Secretary, and Regular Members.

### 2.5 Children Groups

Children are divided into two groups — Kutr 1 and Kutr 2 — classified based on criteria managed by Kutitr Kifl.

---

## 3. Weekly Workflow

> **Updated in v2.0** — schedule times revised

### 3.1 Saturday Program (8:00 AM – 11:30 AM)

| Segment                                                    | Responsible    |
| ---------------------------------------------------------- | -------------- |
| Transportation — members collect children from 5 locations | All Members    |
| Prayer                                                     | All Members    |
| Timihrt (Education)                                        | Timihrt Kifl   |
| Mezmur (Hymns & Songs)                                     | Mezmur Kifl    |
| Kinetibeb Program                                          | Kinetibeb Kifl |
| Attendance                                                 | Kutitr Kifl    |
| Closing Program                                            | All Members    |

### 3.2 Sunday Program (8:00 AM – 10:00 AM)

A shorter version of the weekly program. Parents bring children directly to church — no transportation/collection is required.

### 3.3 Child Collection Locations

1. Apartama
2. Gende Boy
3. Gende Je
4. Cobalt
5. Bate

---

## 4. Special Events & Activities

### 4.1 Annual Plan

Ekd Kifl creates and manages the annual master plan in the management system. All sub-departments operate according to this plan. The plan covers regular weekly programs and all special events.

### 4.2 Special Events

| Event                  | Amharic | Type                               | Description                                             |
| ---------------------- | ------- | ---------------------------------- | ------------------------------------------------------- |
| Timket                 | ጥምቀት    | Fixed (January)                    | Epiphany celebration with special training and programs |
| Hosaena                | ሆሳዕና    | Fixed (Spring)                     | Palm Sunday celebration with special training           |
| Awdemerit              | አውደምህረት | Monthly                            | Children perform Mezmur at the main church gathering    |
| Adar                   | አዳር     | Manually Scheduled                 | Special community gathering scheduled by Ekd Kifl       |
| Fresh Welcome          | -       | Annual (September)                 | Welcome event for new first-year university members     |
| Monthly Birthday Event | -       | Monthly, 15th (Ethiopian calendar) | Celebration for children with birthdays that month      |
| Welfare Programs       | -       | Year-round                         | Support and care programs for members in need           |

### 4.3 Special Event Workflow

- Ekd Kifl schedules the event in the management system
- All sub-departments receive their assigned program responsibilities for the event
- Extra training sessions are scheduled beyond the regular Saturday/Sunday program
- Attendance is tracked for all extra training sessions
- Each sub-department manages their assigned programs from their dashboard
- Kutitr Kifl tracks event attendance
- Every activity/event requires more than one member assigned — never a single owner
- Reports are submitted to Ekd Kifl after the event

### 4.4 Sub-Department Roles in Special Events

| Sub-Department | Role in Special Events                                      |
| -------------- | ----------------------------------------------------------- |
| Timihrt        | Handles education and teaching programs within the event    |
| Mezmur         | Leads music, hymns and performance programs                 |
| Kinetibeb      | Manages film screenings, Yeteret Abat and assigned programs |
| Ekd            | Organizes, plans and coordinates the entire event           |
| Kutitr         | Tracks attendance of members and children during the event  |

---

## 5. Portfolio Website

### 5.1 Overview

The portfolio website is the public face of Hitsanat Kifl, at https://hitsanat.vercel.app. It serves as an information and announcement platform for the public, parents, and members. **No login is required or offered to regular members — everyone sees the same public content.**

### 5.2 Pages

| Page             | Content                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Home             | Hero section, Foundation (Vision/Mission/Objectives), Activities, Sub-departments, Events with countdown, Announcements, Stats |
| About            | History and background of Hitsanat Kifl and its connection to Gibi Gubae                                                       |
| Vision & Mission | Detailed vision, mission and objectives                                                                                        |
| Activities       | Detailed list of all regular and special activities                                                                            |
| Programs         | Sub-department programs and their roles                                                                                        |
| Gallery          | Photos and videos from events and activities                                                                                   |
| Team             | Current Kifl leadership and sub-department leaders                                                                             |
| Contact          | Location, Telegram link, contact information                                                                                   |

### 5.3 Dynamic Content from Management System

- Announcements (special trainings, events, news)
- Special event countdowns (live countdowns to upcoming events)
- Adar and manually scheduled events (appear only when scheduled in the system)
- Leadership and team information
- Stats (member count, children count, events completed)

### 5.4 Event Countdown Feature

- Fixed Orthodox calendar events (Timket, Hosaena) auto-countdown based on dates
- Manually scheduled events (Adar, welfare programs) appear when Ekd Kifl schedules them
- Monthly Awdemerit countdown resets automatically each month
- Countdowns show days, hours and minutes remaining

### 5.5 Announcements

Announcements published in the management system appear automatically on the website and are also sent to the Hitsanat Kifl Telegram group. Announcements include: upcoming special trainings for members, upcoming special trainings for children, event notifications, and fresh student enrollment notices.

---

## 6. Management System

### 6.1 Overview

The management system is a private web application accessible **only to leadership** (sub-department leaders and above) — regular members never log in to it. It is the central hub for all Hitsanat Kifl operations. All dashboards are role-based — each leader sees only what is relevant to their role.

### 6.2 Core Modules

| Module                    | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Member Management         | Registration, profiles, role assignment, sub-department and family assignment                                   |
| Children Management       | Registration, group classification (Kutr 1 & 2), attendance, scores and exams                                   |
| Parent Management         | Registration, linked to children via foreign key                                                                |
| Family Management         | Family creation, Father/Mother assignment, member assignment                                                    |
| Sub-Department Management | Leader assignment, member management, department-specific workflows                                             |
| Attendance Tracking       | Saturday & Sunday attendance, special event and extra training attendance; auto-seeded from activity assignment |
| Academic Tracking         | Children's scores, mid exams, final exams and assignments                                                       |
| Annual Planning           | Master plan creation, tracking progress, plan distribution to sub-departments                                   |
| Events Management         | Create, schedule and manage special events and programs                                                         |
| Reports                   | Weekly, monthly, quarterly, half-year and full-year reports per sub-department                                  |
| Announcements             | Create and publish announcements to website and Telegram                                                        |

### 6.3 Sub-Department Dashboards

| Dashboard | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| Timihrt   | Education roadmap, teacher assignment, children scores                       |
| Mezmur    | Song playlist, Mezmur Astegni assignment                                     |
| Kutitr    | Attendance tracking, transportation assignment, family organization tracking |
| Ekd       | Annual plan, events, reports management                                      |
| Kinetibeb | Film library, Yeteret Abat schedule, member assignment                       |

---

## 7. Role-Based Dashboards

### 7.1 Chairperson Dashboard

- Full overview of all members, families and sub-departments
- All reports and annual plans
- Event management overview
- Announcement management
- System-wide statistics
- Member registration approval

### 7.2 Sub-Chairperson Dashboard

- Similar to Chairperson with delegated access
- Can act on behalf of Chairperson
- Access to all sub-department dashboards

### 7.3 Secretary Dashboard

- Member registration and profile management
- Children registration
- Parent registration and linking to children
- Family assignment management
- Sub-department assignment management
- Fresh student enrollment processing

### 7.4 Timihrt Leader Dashboard

- Education roadmap creation and management
- Teacher assignment from Timihrt members
- Children score and exam tracking
- Mid exam and final exam management
- Assignment tracking
- Reports for Ekd Kifl

### 7.5 Mezmur Leader Dashboard

- Song playlist management
- Mezmur Astegni (song leader) assignment
- Monthly Awdemerit preparation tracking
- Special event Mezmur program management
- Reports for Ekd Kifl

### 7.6 Kutitr Leader Dashboard

- Children attendance tracking (Saturday & Sunday)
- Member attendance tracking
- Transportation/collection location assignment
- Special event and training attendance tracking
- Family-based member organization overview
- Attendance reports for Ekd Kifl

### 7.7 Ekd Leader Dashboard

- Annual master plan creation and management
- Plan distribution to sub-departments
- Plan progress tracking (done/undone status collected from sub-departments)
- Special event creation and scheduling
- Program assignment to sub-departments for events
- Weekly, monthly, quarterly, half-year and full-year report generation
- Reports aggregated from all sub-departments
- Announcement creation and publishing

### 7.8 Kinetibeb Leader Dashboard

- Religious film library management
- Yeteret Abat schedule creation
- Member assignment to Kinetibeb schedule
- Special event program management
- Reports for Ekd Kifl

### 7.9 Regular Members

No dashboard. Regular members are not part of the admin/management system in any capacity — they access only the public portfolio website, same as any visitor.

### 7.10 Super Admin

- Full control over the entire system, including all leadership dashboards
- Manages the permission system itself

---

## 8. Data Models & Registration Forms

> **Updated in v2.0** — parent data clarified

### 8.1 Member Registration

Registration happens in two stages: (1) minimal required-field creation by the Secretary, (2) later enrichment — sub-department and family assignment, plus any auto-completed fields.

| Field                      | Type         | Notes                                                                    |
| -------------------------- | ------------ | ------------------------------------------------------------------------ |
| Full Name                  | Text         | Required — Stage 1                                                       |
| Christian Name (የክርስትና ስም) | Text         | Required — Stage 1                                                       |
| Year of Study              | Select       | 1st Year to GC — Stage 1                                                 |
| Academic Department        | Text         | Required — Stage 1                                                       |
| Phone Number               | Text         | Required — Stage 1                                                       |
| Campus                     | Text         | Required — Stage 1                                                       |
| Gender                     | Select       | Male / Female                                                            |
| Photo                      | Image Upload | Profile photo                                                            |
| Telegram Username          | Text         | For announcements                                                        |
| Family Assignment (Khnet)  | Foreign Key  | Stage 2 — manual or auto-generated                                       |
| Sub-Department(s)          | Multi-select | Stage 2 — at least one required, multiple allowed                        |
| Role                       | Select       | Chairperson, Sub-Chair, Secretary, Leader, Sub-Leader, Secretary, Member |
| Date Joined                | Date         | Auto-generated                                                           |

### 8.2 Child Registration

| Field                      | Type         | Notes                                            |
| -------------------------- | ------------ | ------------------------------------------------ |
| Full Name                  | Text         | Required                                         |
| Christian Name (የክርስትና ስም) | Text         | Required                                         |
| Address                    | Text         | Home address                                     |
| Gender                     | Select       | Male / Female                                    |
| Photo                      | Image Upload | Profile photo                                    |
| Date of Birth              | Date         | Required — drives monthly birthday event         |
| Kutr Group                 | Select       | Kutr 1 / Kutr 2                                  |
| Collection Location        | Select       | Apartama, Gende Boy, Gende Je, Cobalt, Bate      |
| Parent Link(s)             | Relation     | See Section 8.3 — at most one Father, one Mother |

### 8.3 Parent Detail

> **Clarified in v2.0**: a child may be linked to at most one Father and one Mother record — never more than one of either. Parent records require full contact detail, not just name and phone.

| Field            | Type        | Notes                                           |
| ---------------- | ----------- | ----------------------------------------------- |
| ID               | Primary Key | Auto-generated                                  |
| Child ID         | Foreign Key | Links to Child table                            |
| Relation         | Select      | Father / Mother — at most one of each per child |
| Full Name        | Text        | Required                                        |
| Phone Number     | Text        | Required                                        |
| Secondary Phone  | Text        | Optional                                        |
| Address          | Text        | Home address                                    |
| Occupation       | Text        | Optional                                        |
| Additional Notes | Text        | Optional                                        |

### 8.4 Family Table

| Field                | Type        | Notes                                |
| -------------------- | ----------- | ------------------------------------ |
| ID                   | Primary Key | Auto-generated                       |
| Family Name / Number | Text        | Required                             |
| Father (Member ID)   | Foreign Key | Senior male member                   |
| Mother (Member ID)   | Foreign Key | Senior female member                 |
| Academic Year        | Text        | e.g. 2025/2026 — reassigned annually |
| Members              | Relation    | Members linked to this family        |

### 8.5 Attendance Table

> **Updated in v2.0**: attendance records are auto-seeded (status "Expected") when a member or child is assigned to an activity; Kutitr confirms/corrects rather than entering from scratch.

| Field        | Type        | Notes                                           |
| ------------ | ----------- | ----------------------------------------------- |
| ID           | Primary Key | Auto-generated                                  |
| Person ID    | Foreign Key | Member or Child ID                              |
| Person Type  | Select      | Member / Child                                  |
| Date         | Date        | Session date                                    |
| Session Type | Select      | Saturday, Sunday, Special Event, Extra Training |
| Event ID     | Foreign Key | Linked to event if applicable                   |
| Status       | Select      | Expected / Present / Absent / Excused           |
| Recorded By  | Foreign Key | Kutitr member who recorded / confirmed          |

### 8.6 Academic Score Table

| Field           | Type        | Notes                            |
| --------------- | ----------- | -------------------------------- |
| ID              | Primary Key | Auto-generated                   |
| Child ID        | Foreign Key | Links to Child table             |
| Exam Type       | Select      | Mid Exam, Final Exam, Assignment |
| Subject         | Text        | e.g. Timihrt topic               |
| Score           | Number      | Numeric score                    |
| Max Score       | Number      | Maximum possible score           |
| Date            | Date        | Exam date                        |
| Academic Period | Text        | e.g. First Semester 2025/2026    |

---

## 9. Planning & Events Module

### 9.1 Planning Overview

The planning system is centered on an **Annual Master Plan** created and managed by Ekd Kifl. The Annual Master Plan is not a flat list of activities. It is the source plan from which work is classified, distributed to the responsible sub-departments, broken down into execution periods, monitored, and reported.

The planning hierarchy is:

```text
Annual Master Plan
  └── Goals
       └── Main Activities
            ├── Expected Results
            ├── Annual Targets
            ├── Quarterly Plans
            │    ├── Q1
            │    ├── Q2
            │    ├── Q3
            │    └── Q4
            ├── Monthly Plans
            ├── Weekly Plans
            ├── Special / Event Plans
            ├── Budget
            ├── Human Resources
            ├── Time
            ├── Weight
            └── Progress / Actual Result
```

The Action Plan spreadsheet supplied for the Children's Department establishes the planning structure around the following fields:

- Goal (ግብ)
- Main Activity (ዋና ተግባር)
- Expected Result (ውጤት)
- Annual Plan / Target (የዓመት ዕቅድ)
- Execution period
- Quarterly distribution
- Monthly distribution
- Budget (በጀት)
- Human resources / people (ሰው)
- Time (ጊዜ)
- Weight (ክብደት)

The application should preserve these concepts as structured data instead of treating the spreadsheet as one large record.

### 9.2 Annual Master Plan

- Created by Ekd Kifl at the beginning of each academic year.
- Defines the master goals, activities, expected results and annual targets.
- Includes planning period, resource requirements, budget, time and activity weight.
- Covers regular weekly programs and special events.
- Provides the source from which plans are distributed to sub-departments.
- Remains the authoritative annual planning record for progress and reporting.

### 9.3 Plan Classification

Each plan item can be classified by execution period:

| Plan Type | Purpose |
| --------- | ------- |
| Annual | Full academic-year target |
| Quarterly | Breaks annual targets into Q1–Q4 |
| Monthly | Breaks quarterly work into individual months |
| Weekly | Converts monthly work into actionable weekly activities |
| Special / Event | Work associated with a specific event or extra activity |

The system must support both **target distribution** and **execution tracking**. A weekly plan should be traceable back to its monthly, quarterly and annual source activity.

### 9.4 Plan Distribution to Sub-Departments

The Annual Master Plan is distributed to the responsible sub-departments.

Example:

```text
Annual Goal
    ↓
Main Activity
    ↓
Responsible Sub-Department
    ↓
Quarterly Target
    ↓
Monthly Target
    ↓
Weekly Activity
    ↓
Execution / Progress
```

A plan item may be assigned to one or more responsible sub-departments when the activity requires coordinated work. The system must preserve the assignment and responsibility boundary.

Sub-department leaders receive only the plans relevant to their assigned scope, while Ekd and authorized executive leadership can view the complete master plan.

### 9.5 Sub-Department Plan

After distribution, the responsible sub-department works from its assigned plan.

A sub-department plan should support:

- Assigned annual activity
- Assigned goal
- Expected result
- Annual target
- Quarterly target
- Monthly target
- Weekly activities
- Responsible members
- Required resources
- Budget
- Planned execution time
- Weight
- Status
- Progress percentage
- Actual result
- Challenges/issues
- Evidence or supporting records
- Submission to Ekd

The sub-department should not create an unrelated replacement plan. Its plan is a scoped execution plan derived from the Annual Master Plan.

### 9.6 Planning and Execution Workflow

```text
1. Ekd creates Annual Master Plan
             ↓
2. Define Goals and Main Activities
             ↓
3. Define Expected Results and Annual Targets
             ↓
4. Define Quarterly / Monthly Distribution
             ↓
5. Assign Responsible Sub-Departments
             ↓
6. Sub-Departments receive their plans
             ↓
7. Sub-Departments break work into Weekly Activities
             ↓
8. Members execute assigned activities
             ↓
9. Sub-Department records actual progress/results
             ↓
10. Ekd reviews and monitors progress
             ↓
11. Progress aggregates from Weekly → Monthly
    → Quarterly → Annual
             ↓
12. Reports are generated
```

### 9.7 Progress Tracking

Progress must be tracked at the lowest execution level and aggregated upward.

```text
Weekly Progress
      ↓
Monthly Progress
      ↓
Quarterly Progress
      ↓
Annual Progress
```

The system should distinguish between:

- Planned value
- Actual value
- Completion percentage
- Status
- Delayed work
- Not started
- In progress
- Completed
- Cancelled where applicable

Ekd can monitor the progress of all sub-departments, while a sub-department leader can update only the plans within their authorized scope.

### 9.8 Weekly Planning and Regular Programs

Weekly planning must connect to the established weekly ministry workflow.

**Saturday — 8:00 AM–11:30 AM**

- Transportation / child collection
- Prayer
- Timihrt
- Mezmur
- Kinetibeb
- Attendance
- Closing program

**Sunday — 8:00 AM–10:00 AM**

- Shorter weekly program
- Parents bring children directly to church

Weekly plan items can therefore be linked to regular program sessions, assigned members, children activities, attendance and responsible sub-departments.

### 9.9 Annual Plan Data Model

The planning domain should conceptually contain:

| Entity | Purpose |
| ------ | ------- |
| Annual Plan | Academic-year master planning container |
| Goal | High-level annual objective |
| Plan Activity | Main activity under a goal |
| Expected Result | Intended result of an activity |
| Plan Target | Planned quantity/value for a period |
| Plan Distribution | Assignment of a plan activity to a sub-department |
| Quarterly Plan | Quarterly breakdown |
| Monthly Plan | Monthly breakdown |
| Weekly Plan | Weekly executable activity |
| Plan Resource | Human/resource requirement |
| Plan Budget | Budget allocation |
| Plan Progress | Actual execution/progress |
| Plan Evidence | Supporting evidence or attachments |
| Plan Report | Aggregated planning performance report |

The exact database implementation should preserve referential integrity and the domain boundaries defined by the architecture.

### 9.10 Annual Plan Table

| Field | Type | Notes |
| ----- | ---- | ----- |
| ID | Primary Key | Auto-generated |
| Academic Year | Text | Academic year for the plan |
| Title | Text | Required |
| Description | Text | Optional |
| Status | Select | Draft / Distributed / Active / Completed / Archived |
| Created By | Foreign Key | Ekd or authorized leadership |
| Created At | DateTime | System generated |
| Approved By | Foreign Key | Authorized approver |
| Approved At | DateTime | Optional |

### 9.11 Plan Activity Table

| Field | Type | Notes |
| ----- | ---- | ----- |
| ID | Primary Key | Auto-generated |
| Annual Plan ID | Foreign Key | Parent annual plan |
| Goal | Text / Relation | Goal under the annual plan |
| Main Activity | Text | Required |
| Expected Result | Text | Required where applicable |
| Annual Target | Number / Text | Depends on activity measurement |
| Weight | Number | Activity importance/weight |
| Budget | Number | Planned budget |
| Human Resource | Number / Relation | People/resources required |
| Planned Time | Number / Text | Planned time |
| Status | Select | Draft / Active / Completed / etc. |

### 9.12 Plan Distribution Table

| Field | Type | Notes |
| ----- | ---- | ----- |
| ID | Primary Key | Auto-generated |
| Plan Activity ID | Foreign Key | Activity being distributed |
| Sub-Department ID | Foreign Key | Responsible department |
| Assigned By | Foreign Key | Ekd/authorized leader |
| Assigned At | DateTime | System generated |
| Status | Select | Assigned / Accepted / In Progress / Completed |

### 9.13 Plan Period Tables

Quarterly, monthly and weekly plans should retain a reference to their parent plan item so that the system can trace execution back to the Annual Master Plan.

```text
Annual Plan
   ↓
Plan Activity
   ↓
Plan Distribution
   ↓
Quarterly Plan
   ↓
Monthly Plan
   ↓
Weekly Plan
```

### 9.14 Progress and Reporting

Plan progress feeds the reporting module. Weekly and monthly execution records contribute to quarterly and annual summaries.

Reports should be able to show:

- Planned target
- Actual result
- Completion percentage
- Weight
- Weighted performance
- Budget planned/used where supported
- Responsible sub-department
- Delayed activities
- Completed activities
- Challenges
- Recommendations

This planning data forms the basis for weekly, monthly, quarterly, half-year and annual reports.

### 9.15 Event Table

| Field                   | Type          | Notes                                                                    |
| ----------------------- | ------------- | ------------------------------------------------------------------------ |
| ID                      | Primary Key   | Auto-generated                                                           |
| Event Name              | Text          | Required                                                                 |
| Event Type              | Select        | Regular, Special, Extra Training                                         |
| Date                    | Date/DateTime | Required — stored Gregorian, displayed via Ethiopian calendar conversion |
| Location                | Text          | Optional                                                                 |
| Scheduled By            | Foreign Key   | Ekd member who created                                                   |
| Sub-Department Programs | Relation      | Programs assigned per sub-dept — minimum 2 members per assignment        |
| Is Published             | Boolean       | Publish to website                                                       |
| Countdown Active        | Boolean       | Show countdown on website                                                |

### 9.16 Report Types

| Report           | Frequency      | Generated By | Content                                          |
| ---------------- | -------------- | ------------ | ------------------------------------------------ |
| Weekly Report    | Every week     | Ekd Kifl     | Activities completed, attendance summary, issues |
| Monthly Report   | Every month    | Ekd Kifl     | Monthly plan progress, events, scores summary    |
| Quarterly Report | Every 3 months | Ekd Kifl     | Quarter performance across all sub-departments   |
| Half-Year Report | Twice a year   | Ekd Kifl     | Mid-year comprehensive review                    |
| Annual Report    | Once a year    | Ekd Kifl     | Full year summary, achievements, recommendations |

## 10. Announcements & Integrations

### 10.1 Announcement Workflow

- Ekd Kifl or Chairperson creates an announcement in the management system
- Announcement is published to the portfolio website automatically
- Announcement is also sent to the Hitsanat Kifl Telegram group
- Announcements can target members only, children and parents, or the general public

### 10.2 Telegram Integration

> **Updated in v2.0**: the Telegram Bot is a standalone application, decoupled from the main backend via the Announcement record rather than a direct synchronous call.

- Management system connects to Telegram Bot API
- Announcements and training notices are pushed to the Telegram group
- Secretary writes/edits announcement text; admin sets a target day
- Bot calculates and auto-schedules the exact post time
- Special event reminders can be scheduled for automatic sending

### 10.3 Website Integration

- Management system exposes a public API consumed by the portfolio website
- Announcements, events, countdowns and team data sync automatically
- No manual update of the website needed after publishing in the system

---

## 11. Technology Stack (Finalized in v2.1)

The technology stack is confirmed as follows (v1.0 listed this section as recommendations only):

### 11.1 Frontend

- Next.js (React, TypeScript)
- Tailwind CSS
- shadcn/ui component library
- shadcn/ui initialized with the project preset `b1D0f7S7` using the Next.js template
- UI components are customized and shared through `packages/ui`
- TanStack Query for data fetching/caching
- Zod for validation, shared between frontend and backend
- Mobile-first design — primary users (leadership) may not have laptop access

### 11.2 Backend

- Express.js (TypeScript)
- Better Auth for authentication
- Drizzle ORM

### 11.3 Database

- PostgreSQL, hosted via Supabase

### 11.4 Shared Tooling

- Turborepo monorepo
- pnpm
- Zod (shared validation schemas)
- Biome for linting, formatting and import organization
- `ethiopian-calendar-new` behind the shared `packages/calendar` package for Ethiopian/Gregorian calendar support
- Docker for containerized local development, PostgreSQL and reproducible test environments

### 11.5 Architecture Approach

- Domain-Driven Design (DDD)
- Clean Architecture
- Modular Monolith
- Feature-Based Modules
- Architecture Decision Records (ADRs) for key decisions

Guiding principle: the software should adapt to the ministry — business requirements always take priority over technical convenience.

### 11.6 Testing Strategy

The system uses a layered testing strategy. Vitest is the primary test runner for unit and integration tests, while Playwright covers end-to-end workflows. React Testing Library is used for component behavior, and automated accessibility checks use axe. Integration tests use a real disposable PostgreSQL database rather than mocking database behavior.

- **Unit Tests — Vitest:** Domain logic, use cases, validation, calculation engines, calendar utilities and other isolated business logic
- **Integration Tests — Vitest + PostgreSQL:** Express routes, application services, Drizzle queries, transactions, authentication, authorization and module interactions
- **Component Tests — Vitest + React Testing Library:** Admin UI components, forms, tables, dialogs, calendar components and role-based UI behavior
- **End-to-End Tests — Playwright:** Complete leadership workflows across the admin application, including authentication, member management, planning, attendance and reporting
- **API/Contract Tests — Vitest + Zod:** Shared request/response contract validation between frontend and backend
- **Database Tests — Vitest + PostgreSQL:** Constraints, relationships, queries and transaction behavior against a real test database
- **Security/RBAC Tests — Vitest + Playwright:** Positive and negative permission cases for every leadership scope and denial of management-system access to regular members
- **Accessibility Tests — Playwright + axe:** Keyboard navigation, form labels, dialogs, ARIA behavior and other accessibility requirements
- **Smoke Tests — Playwright:** Basic production health and critical-path verification after deployment

### 11.7 Test Organization

Recommended test organization:

```text
tests/
  unit/
  integration/
  e2e/
  accessibility/
```

Tests may also remain colocated with the modules they cover when that improves maintainability. The important requirement is that test intent and scope remain explicit.

Integration tests should use a disposable PostgreSQL test database. Docker may provide the local test database so that CI and local development use a reproducible environment.

Critical E2E workflows should include:

- Leadership authentication
- Member registration and assignment
- Child and parent registration
- Family assignment
- Scoped RBAC enforcement
- Annual plan creation
- Plan distribution to a sub-department
- Quarterly/monthly/weekly plan execution
- Attendance recording
- Progress submission and aggregation
- Report generation
- Announcement publication

### 11.8 Repository Structure


```
apps/
  admin/      → leadership portal (executive + sub-dept leadership + super admin)
  api/        → Express.js + TypeScript backend
  portfolio/  → public site
  telegram/   → bot, separate deployable service
packages/
  auth/
  database/
  ui/
  validation/
  permissions/
  calendar/
  domain/
  config/
  logger/
  engines/
```

---

## 12. Development Team Structure

The backend team currently has two contributors with deliberately different responsibility levels:

| Contributor | Role                         | Ownership                                                                                                                                                                              |
| ----------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abrham      | Core Backend Lead            | Complete backend architecture, domain and database decisions, authentication/authorization, transactions, outbox/worker, security, task assignment, reviews, integration, and releases |
| Israel      | Beginner Backend Contributor | Low-risk tasks assigned by Abrham: Zod schemas, DTO mapping, simple read endpoints, seed/reference data, focused tests, documentation, and small established-pattern queries           |

Israel does not independently change authentication, permissions, migrations, transaction/outbox infrastructure, security controls, architecture boundaries, event contracts, or production configuration. Every Israel task uses a dedicated feature branch, a written acceptance checklist, and mandatory Abrham review; Israel may not self-merge.

Backend business modules live vertically under `apps/api/src/modules`. `packages/validation` is the stable frontend/backend contract seam, while `packages/database` centralizes Drizzle schema declarations and migration tooling without owning business behavior.

---

## 13. Development Phases

### Phase 1 — Foundation

- Member registration and authentication system
- Role-based access control
- Family management module
- Sub-department assignment module
- Basic Chairperson and Secretary dashboards

### Phase 2 — Children & Attendance

- Children registration module
- Parent registration and linking
- Attendance tracking (Saturday & Sunday)
- Kutitr dashboard
- Child group (Kutr 1 & 2) management

### Phase 3 — Sub-Department Workflows

- Timihrt dashboard — roadmap, teachers, scores
- Mezmur dashboard — playlist, Astegni assignment
- Kinetibeb dashboard — films, Yeteret Abat
- Academic score and exam tracking

### Phase 4 — Planning & Events

- Annual master plan creation and approval
- Goal and activity definition
- Annual target definition
- Quarterly plan distribution
- Monthly plan distribution
- Weekly plan creation and execution
- Plan distribution to sub-departments
- Sub-department plan dashboards
- Plan progress and actual-result tracking
- Budget, human-resource, time and weight tracking
- Special event management
- Extra training session scheduling
- Event attendance tracking
- Sub-department program assignment for events

### Phase 5 — Reports & Announcements

- Report generation (weekly, monthly, quarterly, half-year, annual)
- Announcement system
- Telegram integration
- Website API integration

### Phase 6 — Portfolio Website Updates

- Event countdown feature
- Dynamic announcements from management system
- Team/leadership page from system data
- Stats section from live data

---

## 14. Architecture Decision Records

### ADR-0001: Separate assignment/attendance tables per activity type

**Status:** Accepted
**Decision:** Use separate tables (`program_session_assignment` / `event_assignment`, `program_session_attendance` / `event_attendance`) rather than a single polymorphic table, to preserve database-level referential integrity.

### ADR-0002: Member attendance auto-seeds from assignment

**Status:** Accepted
**Decision:** Creating an assignment record automatically creates a matching attendance record with status "Expected." Kutitr confirms or corrects it rather than entering attendance from scratch.

### ADR-0003: Kutitr owns transport/location assignment

**Status:** Accepted
**Decision:** Members assigned to the 5 collection locations each Saturday are assigned by Kutitr leadership, consistent with Kutitr's broader responsibility for member activity tracking and transportation.

### ADR-0004: Ethiopian dates stored as Gregorian, converted at the domain boundary

**Status:** Accepted
**Decision:** All dates persist as Gregorian in the database. The shared `calendar` package handles Ethiopian/Gregorian conversion, holiday lookup, and birthday-month logic. UI and domain layers never do Ethiopian date math inline.

### ADR-0005: RBAC via scoped role tables, not a flat role enum

**Status:** Accepted
**Decision:** Permissions are resolved from sub-department membership roles plus department-level roles, not a single role field — since a member's access is scoped per sub-department and members can hold multiple simultaneous roles.

### ADR-0006: Telegram bot is a separate application, decoupled via events

**Status:** Accepted
**Decision:** The Telegram app reacts to published announcements rather than being called synchronously from the admin API, so it can be built, deployed, and scaled independently.

### ADR-0007: Regular members have no admin/dashboard access

**Status:** Accepted
**Decision:** Only leadership (sub-department leaders and above) authenticate into the management system. Regular members interact with Hitsanat Kifl only through the public portfolio website, with no login and no personalized view — identical experience to any public visitor.

### ADR-0008: Express.js as the Backend HTTP Framework

**Status:** Accepted

**Decision:** Use Express.js with TypeScript as the HTTP framework for the API.

**Reason:** The project standardizes the API layer on Express.js while retaining DDD, Clean Architecture, Modular Monolith and feature-based module boundaries.

**Consequence:** Express is limited to the interface/infrastructure layer. Domain and application logic remain framework-independent.

### ADR-0009: shadcn/ui with a Shared UI Package

**Status:** Accepted

**Decision:** Use shadcn/ui as the component foundation for the Next.js leadership interface, initialized with the project preset `b1D0f7S7` and the Next.js template.

**Initialization:**

```bash
pnpm dlx shadcn@latest init --preset b1D0f7S7 --template next
```

**Consequence:** Generated/customized UI components are maintained through `packages/ui` and reused by applications that need them. Product-specific components should compose the shared primitives rather than duplicating them.

### ADR-0010: Layered Testing Strategy

**Status:** Accepted

**Decision:** Use Vitest for unit and integration tests, Playwright for E2E and smoke tests, React Testing Library for component behavior, and axe for accessibility checks. Integration tests use a real disposable PostgreSQL database.

**Reason:** The system contains important domain rules, scoped authorization, database relationships, and multi-step leadership workflows that require testing beyond isolated unit tests.

**Consequence:** CI must run the appropriate unit, integration, component, E2E and security/RBAC suites for the affected applications/modules.

### ADR-0011: Shared Ethiopian Calendar Package

**Status:** Accepted

**Decision:** Use `ethiopian-calendar-new` behind the shared `packages/calendar` package.

**Reason:** Ethiopian/Gregorian conversion, holiday lookup and birthday-month logic are cross-cutting concerns and should not be implemented independently in UI components or business modules.

**Consequence:** Database dates remain Gregorian. Calendar conversion is centralized at the shared package/application boundary.

**Installation:**

```bash
pnpm add ethiopian-calendar-new
```

### ADR-0012: Docker for Reproducible Development and Testing

**Status:** Accepted

**Decision:** Use Docker to provide reproducible local development and test infrastructure, including PostgreSQL and required service dependencies.

**Consequence:** Developers and CI can run consistent database-backed integration tests without relying on a developer's locally installed PostgreSQL configuration.

---

## 15. Glossary

| Term                | Meaning                                                      |
| ------------------- | ------------------------------------------------------------ |
| Hitsanat Kifl       | Children's sub-department of Gibi Gubae                      |
| Gibi Gubae          | Main Orthodox student organization at Haramaya University    |
| Timihrt (ትምህርት)     | Education sub-department                                     |
| Mezmur (መዝሙር)       | Music/Hymns sub-department                                   |
| Kutitr (ቁጥጥር)        | Attendance and tracking sub-department                       |
| Ekd (እቅድ)           | Planning and events sub-department                           |
| Kinetibeb (ኪነ-ጥበብ)  | Films and programs sub-department                            |
| Khnet               | Family unit within the Kifl                                  |
| Mezmur Astegni      | Song leader assigned by Mezmur Kifl                          |
| Yeteret Abat        | A religious program prepared by Kinetibeb Kifl               |
| Awdemerit (አውደምህረት) | Main church gathering where children perform monthly         |
| Timket (ጥምቀት)       | Epiphany — major Orthodox celebration                        |
| Hosaena (ሆሳዕና)      | Palm Sunday celebration                                      |
| Adar (አደር)          | Special community gathering, manually scheduled              |
| Kutr 1 / Kutr 2     | Two classification groups for children                       |
| GC                  | Graduation — final year of university study                  |
| Fresh / Freshman    | First year university student                                |
| Ekd Kifl            | Planning department responsible for annual plans and reports |

---

_End of Document_
_Hitsanat Kifl — Haramaya University Gibi Gubae — Version 2.1 — August 2026_
