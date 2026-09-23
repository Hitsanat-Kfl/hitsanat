# Frontend Role-Based Dashboards

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

## 1. Dashboard Specifications by Role

### 1.1 Chairperson Dashboard (`/chairperson`)
- **Key Metrics:** Total active university members, total enrolled children, system-wide Master Plan weighted achievement rate, active budget utilization.
- **Approvals Inbox:** Pending plan change requests, periodic reports awaiting executive signature, and events awaiting publish approval — sourced from the unified `/api/v1/approvals` feed (endpoints.md §2.5a). Review actions execute on the owning module endpoints (ADR-0018).
- **Department Comparison Bar Chart:** Weighted progress index per sub-department.
- **Meeting Scheduler:** Schedule leadership meetings with automated reminders, track attendance, and store meeting minutes.
- **Audit Trail Viewer:** Chronological administrative audit log (FR-13.2) with filters by action type and date range.

### 1.2 Vice-Chairperson (Sub-Chairperson) Dashboard (`/sub-chairperson`)
- **Delegated Oversight:** Cross-departmental progress snapshot mirroring the Chairperson's comparison chart, read-only.
- **Deputized Approvals:** Approvals inbox mirroring the Chairperson's, exercisable via the standing deputy authority defined in ADR-0018 (plan-change reviews, report sign-offs, event approvals). User account management is excluded.
- **Department Status Board:** Per-sub-department weekly execution status with drill-down links.
- **Meeting Scheduler:** Schedule leadership meetings with automated reminders, track attendance, and store meeting minutes.

### 1.3 Secretary Dashboard (`/secretary`)
- **Registration Shortcuts:** Stage 1 Member Fast Add modal, Child Registration modal, Parent Linking form.
- **Family Management Hub:** Family cards showing assigned Father, Mother, and active student members.
- **Fresh Student Onboarding Roster:** Staged queue for assigning freshmen to sub-departments.
- **Meeting Scheduler:** Schedule leadership meetings with automated reminders, track attendance, and store meeting minutes.
- **Bulk Import/Export:** CSV/Excel upload for members, children, parents; CSV export for all entity types.
- **Birthday & Anniversary Tracker:** Monthly view of children's birthdays and member service anniversaries with milestone recognition.
- **Member Transfer System:** Transfer members between sub-departments with documented reason and audit trail.
- **Registration Analytics:** Line charts for trends, pie charts for demographics, bar charts for sub-department distribution.
- **Batch Operations:** Bulk activate/deactivate members, bulk assign to sub-departments, bulk status updates.
- **Data Quality Dashboard:** Incomplete record detection, duplicate identification, data completeness scoring.
- **Parent Contact Directory:** Searchable parent list with click-to-call, copy phone, view linked children.
- **Family Tree Visualization:** Interactive family connection diagram with expand/collapse and print.
- **Audit Trail Viewer:** Chronological change log with filters by action type, date range, and actor.

### 1.4 Super Admin Dashboard (`/super-admin`)
- **Account Provisioning Console:** Create, update, reset, deactivate, and reactivate leader accounts (BR-008, FR-13.6) with one-leadership-post validation (BR-009); guided handover and session revocation from `/users`.
- **Leadership Roster Matrix:** All leadership posts (executive + per-sub-department) with BR-009 conflict highlighting.
- **System Health & Audit:** API health (status/version/environment), audit log stream, role distribution, recently provisioned accounts.
- *System Status panel:* seed/migration status from `GET /api/v1/system-metadata` (`schema_tag`, `seed_status`) alongside API health (FR-13.4).

### 1.5 Timihrt Leader Dashboard (`/timihrt`)
- **Curriculum Roadmap:** Syllabus timeline for `Kutr 1` & `Kutr 2`.
- **Teacher Assignment Roster:** Teacher assignments for upcoming Saturday & Sunday sessions.
- **Exam Score Entry:** Gradebook spreadsheet view for Mid Exams, Final Exams, and Assignments.
- **Report Card Generator:** Generate individual PDF report cards or batch Excel sheets with student grades, attendance, rank, and average. Ministry-branded template with Ethiopian calendar format.

### 1.6 Mezmur Leader Dashboard (`/mezmur`)
- **Hymn Repertoire Repository:** Song texts, audio reference links, category tags.
- **Mezmur Astegni Roster:** Assigned choir conductors for weekend rehearsals.
- **Monthly Awdemerit Tracker:** Preparation status for the monthly church chant presentation.

### 1.7 Kutitr Leader Dashboard (`/kutitr`)
- **Real-Time Attendance Verification:** Quick-confirm checksheets for Saturday (5 collection routes) and Sunday sessions.
- **Child Cohort Switcher:** Bulk reclassification between `Kutr 1` and `Kutr 2`.
- **Weekly Transport Roster:** Member chaperone assignments for the 5 gathering points.
- **Route Performance Dashboard:** Statistics per route with attendance rates, pickup times, and issues logged.
- **Parent Contact Quick View:** Quick-access parent phone numbers for route emergencies with click-to-call.
- **Emergency Contact Database:** Comprehensive emergency contacts for all children with search and CSV export.

### 1.8 Ekd Leader Dashboard (`/ekd`)
- **Annual Master Plan Matrix:** The interactive 6-Goal, 25-Activity matrix with budget, people, time, and calculated weights.
- **Plan Distribution View:** Assigns master plan activities to sub-departments.
- **Report Consolidation Center:** Combines sub-department weekly logs into Monthly/Quarterly reports.
- **Announcements & Countdown Hub:** Creates announcements and toggles live website event countdowns.
- **Plan Approval Workflow:** Submit plan changes for Chairperson approval with status tracking.
- **Sub-Department Progress Heatmap:** Visual heatmap showing progress across all sub-departments with color coding.

### 1.9 Kinetibeb Leader Dashboard (`/kinetibeb`)
- **Religious Media Library:** Film titles, runtime, spiritual theme tags.
- **Yeteret Abat Storytelling Schedule:** Assigned members and moral topics for Saturday segments.
- **Event Drama Rehearsals:** Puppet theater and spiritual play milestone tracker.
