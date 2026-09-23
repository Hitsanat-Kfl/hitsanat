# Business Rules Specification (BR)

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Status:** Authoritative Business Logic Baseline  

---

## 1. Domain Invariants & Rules Catalog

This document formally records the invariant business rules governing all operations, constraints, and data validations across the Hitsanat Kifl platform.

```mermaid
graph TD
    subgraph Membership & Pastoral Rules
        BR01[BR-001: 2-Stage Member Registration]
        BR02[BR-002: Multi-Department Membership]
        BR03[BR-003: Multi-Year Assignment Persistence]
        BR04[BR-004: Family Father/Mother Limit]
        BR05[BR-005: Dual Family Roles]
    end
    
    subgraph Beneficiary & Safety Rules
        BR10[BR-010: Strict Parent Cardinality]
        BR11[BR-011: Group Classification Kutr 1 vs 2]
        BR12[BR-012: 5 Mandatory Collection Routes]
        BR13[BR-013: Multi-Member Assignment Invariant]
    end

    subgraph Operations & Strategy Rules
        BR20[BR-020: Attendance Auto-Seeding]
        BR21[BR-021: Non-Leadership Zero Access]
        BR22[BR-022: Gregorian Storage & Ethiopian Display]
        BR23[BR-023: Action Plan Weighting Formula]
        BR24[BR-024: Bottom-Up Progress Roll-up]
    end
```

---

## 2. Granular Business Rules Catalog

### 2.1 Membership & Family Rules

| Rule ID | Rule Name | Specification | Enforcing Boundary |
| :--- | :--- | :--- | :--- |
| **BR-001** | Two-Stage Member Registration | Stage 1 requires minimum personal identity data: `FullName`, `ChristianName`, `Phone`, `YearOfStudy`, `Department`, `Campus`, `Gender`. Stage 2 assigns `SubDepartments`, `Family`, and optional `Photo` and `TelegramUsername`. | `MemberDomainService` / Zod |
| **BR-002** | Multi-Department Membership | A member must belong to at least one sub-department, but may be actively assigned to 2, 3, or more sub-departments simultaneously. Non-leadership roles (plain `Member`) may be held in any number of departments. **Leadership is capped at one post per member (see BR-009).** | `MemberAggregate` / DB `sub_department_members` |
| **BR-003** | Multi-Year Assignment Persistence | Member records, sub-department allocations, and family memberships do not reset at the beginning of a new academic year. Existing assignments persist until explicitly updated by the Secretary. | `MemberRepository` |
| **BR-004** | Family Father & Mother Allocation | A Family unit (Khnet) must have at most **one active Father** (Senior Male Member) and at most **one active Mother** (Senior Female Member). | Database Unique Index & `FamilyAggregate` |
| **BR-005** | Dual Family Membership Permitted | A student member can serve as the Father or Mother of Family A while simultaneously being designated as a member in Family B. | DB Constraint logic |
| **BR-006** | Khnet Terminology Standard | The operational family unit is designated as `Family` (ቤተሰብ). The term `Khnet` is reserved for formal church ordination titles (e.g. Deacon). | UI / Domain Glossary |
| **BR-007** | Leader Must Be a Member Invariant | Every executive leader (Chairperson, Vice-Chairperson, Secretary) and all Sub-Department Leaders MUST be a registered, active student servant (`member`) of the organization. Leadership credentials cannot be created for non-members. | `UserManagementService` / Domain Invariant |
| **BR-008** | Leadership Account Provisioning & Role Management | `SUPER_ADMIN` and `CHAIRPERSON` have exclusive authority to create user accounts for all appointed leaders, update login credentials, and assign or reassign leadership roles across sub-departments. | Scoped RBAC Guard / `requireScopePermission` |
| **BR-009** | One Leadership Post Per Member | A member may hold **at most one leadership post** in the entire organization. The executive roles (`CHAIRPERSON`, `SUB_CHAIRPERSON`, `SECRETARY`, `SUPER_ADMIN`) are mutually exclusive with each other and with sub-department leadership (`Leader`, `Sub-Leader`). A member may lead at most **one** sub-department. Holding a plain `Member` (and sub-department `Secretary`) role in any number of departments alongside a leadership post is always permitted. | `UsersUseCases` / DB trigger on `sub_department_members` |
| **BR-019** | Meeting Scheduler Constraints | Only CHAIRPERSON, SUB_CHAIRPERSON, and SECRETARY can create and manage leadership meetings. Meeting invitees must be active leadership members (executive or sub-department leaders). Recurring meetings cannot exceed 12 instances. Meeting minutes must be recorded within 48 hours of meeting completion. | `MeetingSchedulerUseCase` / Domain Invariant |
| **BR-020** | Bulk Import Validation | Bulk import of members, children, and parents must validate all required fields, check for duplicate phone numbers (members) or duplicate names within families, and report errors row-by-row. Import jobs must be tracked with status and error counts. | `BulkImportUseCase` / Domain Invariant |
| **BR-021** | Member Transfer Constraints | Members can only be transferred between sub-departments by SECRETARY. Transfers must include a documented reason. A member cannot be transferred to the same sub-department they are currently in. Transfer history must be maintained for audit purposes. | `MemberTransferUseCase` / Domain Invariant |
| **BR-022** | Batch Operation Limits | Batch operations (activate, deactivate, assign) are limited to a maximum of 50 members per operation to prevent system overload. Operations must include confirmation dialog and progress tracking. | `BatchOperationUseCase` / Domain Invariant |
| **BR-023** | Data Quality Check Scope | Data quality checks must scan for: missing required fields (phone, photo, department), duplicate phone numbers, duplicate names within same sub-department, and incomplete parent links. Issues must be categorized by severity (warning, error). | `DataQualityUseCase` / Domain Invariant |
| **BR-024** | Report Card Generation Constraints | Report cards can only be generated by TIMIHRT_LEADER for children in their sub-department. Grades must exist for the selected academic period before generation. Batch generation is limited to 100 students per operation. Report cards must use Ethiopian calendar format and ministry-branded template. | `ReportCardUseCase` / Domain Invariant |

### 2.2 Beneficiaries & Safety Rules

| Rule ID | Rule Name | Specification | Enforcing Boundary |
| :--- | :--- | :--- | :--- |
| **BR-010** | Strict Parent Cardinality Constraint | A child record may be linked to at most **one Father** record (`Relation = 'Father'`) and at most **one Mother** record (`Relation = 'Mother'`). A child cannot have duplicate Fathers or duplicate Mothers. | DB Composite Unique Index `(child_id, relation)` |
| **BR-011** | Mandatory Parent Contact Information | Parent records require full contact details: `FullName`, `Phone`, and `Address`. A child cannot be enrolled without at least one linked parent/guardian. | `ChildRegistrationUseCase` |
| **BR-012** | Child Group Classification | Children are strictly classified into either `Kutr 1` or `Kutr 2`. Classification is maintained and re-assigned exclusively by Kutitr leadership. | `ChildAggregate` |
| **BR-013** | 5 Designated Collection Points | Every child assigned to Saturday transport must belong to one of 5 verified locations: `Apartama`, `Gende Boy`, `Gende Je`, `Cobalt`, or `Bate`. | Enum validation / DB Check |
| **BR-014** | Multi-Member Assignment Invariant | Every scheduled ministry activity, Saturday collection route, training session, or event program must have at least **two members** assigned. No single-member ownership is permitted for safety and accountability. | `AssignmentValidator` |

### 2.3 Attendance & Pastoral Records

| Rule ID | Rule Name | Specification | Enforcing Boundary |
| :--- | :--- | :--- | :--- |
| **BR-020** | Attendance Auto-Seeding (ADR-0002) | When an activity, regular session, or event program is scheduled and members/children are assigned, the system automatically creates attendance rows with initial status `Expected`. Kutitr leaders confirm `Present`, `Absent`, or `Excused`. | Domain Event `ActivityScheduledEvent` |
| **BR-021** | Separate Attendance Tables (ADR-0001) | Regular weekly sessions and special events maintain distinct database tables (`program_session_attendance` vs `event_attendance`) to preserve relational integrity. | PostgreSQL Schema |
| **BR-022** | Kutitr Transport Assignment Ownership | Kutitr leadership has exclusive authority to assign student members to the 5 Saturday transport routes. | `KutitrPermissionGuard` |
| **BR-023** | Route Performance Data Retention | Route performance stats are retained for 2 years. Older data is archived quarterly. | `DataRetentionService` |
| **BR-024** | Parent Contact Access Restriction | Parent contact information is only accessible to Kutitr leaders for route-related emergencies. | `KutitrPermissionGuard` |
| **BR-025** | Plan Approval Required for Budget/Activity Changes | Any changes to budget, people, time, or activity assignments in the Annual Master Plan require Chairperson approval before implementation. | `PlanApprovalService` |
| **BR-026** | Progress Heatmap Refresh Frequency | The Sub-Department Progress Heatmap data is refreshed daily at midnight and can be manually updated by Ekd leaders. | `HeatmapRefreshService` |

### 2.4 Planning, Reporting & Strategy

| Rule ID | Rule Name | Specification | Enforcing Boundary |
| :--- | :--- | :--- | :--- |
| **BR-030** | Action Plan Mathematical Weight Formula | Every plan activity's weight is computed using the exact Action PLN 3-factor formula: $\text{Weight} = \frac{1}{3} [(\frac{\text{Budget}}{\sum \text{Budget}} \times 100) + (\frac{\text{People}}{\sum \text{People}} \times 100) + (\frac{\text{Time}}{\sum \text{Time}} \times 100)]$. The sum of weights across the master plan must equal $100.0\%$. | `PlanningCalculationEngine` |
| **BR-031** | Master Plan Authoritative Distribution | Sub-departments execute derived portions of the Annual Master Plan. Sub-departments cannot invent unapproved independent annual plans outside the master plan distribution. | `PlanDistributionService` |
| **BR-032** | Hierarchical Progress Roll-Up | Progress recorded at the weekly execution level automatically aggregates upward: $\text{Weekly} \rightarrow \text{Monthly} \rightarrow \text{Quarterly} \rightarrow \text{Annual}$. | `ProgressRollupService` |
| **BR-033** | Zero Regular Member Admin Access | Non-leadership members do not have login credentials or dashboard access. They interact solely with public content on the Portfolio website and Telegram. | `AuthMiddleware` / RBAC |
| **BR-034** | Ethiopian Calendar Storage & Display | All dates are stored as Gregorian/UTC in PostgreSQL. All user interfaces render and accept Ethiopian calendar dates via `packages/calendar`. | `DateConverter` boundary |
| **BR-035** | Temporary Permission Grants | Only `SUPER_ADMIN` may issue a temporary grant of a single `resource`+`action` pair to any user. Expiry is mandatory, must be in the future, and may not exceed **7 days**. Grants may be revoked early. Active grants are consulted by `requireScopePermission` only when the caller's role/sub-department check fails for that exact pair. Create and revoke actions are audit-logged (`PERMISSION_GRANT_CREATED`, `PERMISSION_GRANT_REVOKED`). | `permission_grants` table / `requireScopePermission` / `POST /api/v1/permission-grants` |
