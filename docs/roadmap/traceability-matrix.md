# Traceability Matrix (Requirements to Implementation)

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Traceability Coverage:** 100% Core Requirements Mapped  

---

## 1. End-to-End Traceability Mapping

```mermaid
graph LR
    Req[Business Requirement] --> Mod[Module]
    Mod --> DB[Database Entity]
    DB --> API[REST API Endpoint]
    API --> UI[Frontend Component]
    UI --> Test[Automated Test Suite]
    Test --> CI[GitHub Actions / Prepare Quality Gate]
```

---

## 2. Master Traceability Matrix

| Req ID | Business Requirement | Target Module | Database Entity | API Endpoint | Frontend Component | Automated Test Suite |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-001** | Two-Stage Member Registration | `members` | `members`, `sub_dept_members` | `POST /members/stage-1`<br>`PUT /members/:id/stage-2` | `MemberStage1Modal.tsx`<br>`MemberEnrichForm.tsx` | `members.integration.spec.ts` |
| **BR-004** | One Father, One Mother per Family | `families` | `families`, `family_members` | `POST /families`<br>`PUT /families/:id/parents` | `FamilyRosterCard.tsx` | `families.integration.spec.ts` |
| **BR-010** | Strict Parent Cardinality ($\le 1$ Father, $\le 1$ Mother) | `parents`, `children` | `child_parents` | `POST /children/:id/parents` | `ParentLinkDialog.tsx` | `child-parents.constraint.spec.ts` |
| **BR-012** | Child Groups: `Kutr 1` & `Kutr 2` | `children` | `children.kutr_group` | `PUT /children/:id/reclassify` | `ChildCohortSwitcher.tsx` | `children.integration.spec.ts` |
| **BR-013** | 5 Mandatory Collection Routes | `attendance` | `children.collection_location` | `POST /attendance/transport-assignment` | `TransportRouteDispatcher.tsx` | `attendance-transport.spec.ts` |
| **BR-014** | Multi-Member Assignment ($\ge 2$) | `planning`, `events` | `weekly_plans`, `event_assignments` | `POST /events/:id/assign-program` | `MemberMultiSelect.tsx` | `multi-member.domain.spec.ts` |
| **BR-020** | Attendance Auto-Seeding (ADR-0002) | `attendance` | `program_session_attendance` | `POST /attendance/sessions/:id/seed` | `AttendanceRosterTable.tsx` | `attendance-autoseed.spec.ts` |
| **BR-030** | Action Plan 3-Factor Weight Engine | `planning` | `plan_activities.weight` | `POST /annual-plans/:id/activities` | `PlanningMatrixTable.tsx` | `planning-weight.unit.spec.ts` |
| **BR-031** | Master Plan Sub-Dept Distribution | `planning` | `plan_distributions` | `POST /annual-plans/distribute` | `SubDeptPlanView.tsx` | `plan-distribution.spec.ts` |
| **BR-032** | Hierarchical Progress Roll-Up | `planning` | `plan_progress_records` | `POST /annual-plans/progress` | `ExecutiveKPIWidget.tsx` | `progress-rollup.spec.ts` |
| **BR-033** | Regular Member Admin Lockout (ADR-0007) | `auth` | `users`, `sub_dept_members` | `POST /auth/sign-in/email` | `LoginForm.tsx` | `rbac-lockout.security.spec.ts` |
| **BR-034** | Ethiopian Calendar Storage & Display | `calendar` | `TIMESTAMPTZ` (Gregorian) | All temporal endpoints | `EthiopianDatePicker.tsx` | `calendar.unit.spec.ts` |
