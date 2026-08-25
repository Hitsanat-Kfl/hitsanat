# Roles & Permissions Specification (RBAC)

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Architecture Pattern:** Scoped Role-Based Access Control (ADR-0005)  

---

## 1. Authorization Philosophy & Scoped Model

Rather than assigning a single, global enum role to a user, the system evaluates permissions based on a combination of **Department-Level Roles** and **Sub-Department Scoped Roles**.

```mermaid
graph TD
    User([Authenticated User])
    
    subgraph Global / Department Level Roles
        SuperAdmin[Super Admin]
        Chair[Chairperson]
        SubChair[Sub-Chairperson]
        Secretary[Secretary]
    end
    
    subgraph Sub-Department Scoped Roles
        TimihrtLead[Timihrt Leader / Sub-Leader]
        MezmurLead[Mezmur Leader / Sub-Leader]
        KutitrLead[Kutitr Leader / Sub-Leader]
        EkdLead[Ekd Leader / Sub-Leader]
        KinetibebLead[Kinetibeb Leader / Sub-Leader]
    end

    User -->|Holds| SuperAdmin
    User -->|Holds| Chair
    User -->|Holds| Secretary
    User -->|Holds Scope: Timihrt| TimihrtLead
    User -->|Holds Scope: Ekd| EkdLead

    style SuperAdmin fill:#f96,stroke:#333,stroke-width:2px
    style Chair fill:#69f,stroke:#333,stroke-width:2px
```

### Core Security Invariants:
1. **Regular Members Have No Admin Access (ADR-0007):** Regular student members (`MEMBER_REGULAR`) without an active leadership post cannot authenticate into `apps/admin`.
2. **Scope Isolation:** A Timihrt leader cannot modify Mezmur songbooks or change Saturday transportation routes.
3. **Executive Oversight:** The Chairperson, Sub-Chairperson, and Super Admin hold cross-departmental visibility and approval authority.

---

## 2. Role Taxonomy & Responsibility Scopes

| Role Identifier | Role Level | Assigned Scope | Key System Responsibilities |
| :--- | :--- | :--- | :--- |
| `SUPER_ADMIN` | System | Global (`*`) | Full system administration, database maintenance, user permissions. |
| `CHAIRPERSON` | Ministry Executive | Global (`*`) | Full operational visibility, plan approvals, final report sign-offs. |
| `SUB_CHAIRPERSON` | Ministry Executive | Global (`*`) | Assists Chairperson; delegated cross-departmental oversight. |
| `SECRETARY` | Ministry Executive | Administrative Core | Member registration, child/parent registration, family allocation. |
| `SUB_DEPT_LEADER` | Sub-Department | `Timihrt` | Curriculum, teacher assignments, academic score management. |
| `SUB_DEPT_LEADER` | Sub-Department | `Mezmur` | Hymn repertoire, conductor assignments, Awdemerit preparation. |
| `SUB_DEPT_LEADER` | Sub-Department | `Kutitr` | Attendance confirmation, 5 transport collection points, headcount. |
| `SUB_DEPT_LEADER` | Sub-Department | `Ekd` | Master annual plan, event creation, progress aggregation, reports. |
| `SUB_DEPT_LEADER` | Sub-Department | `Kinetibeb` | Religious film library, puppet theater, Yeteret Abat schedules. |
| `SUB_DEPT_SECRETARY` | Sub-Department | Department Scope | Records notes, assists leader in score/attendance/progress entry. |
| `REGULAR_MEMBER` | Member | None | **No admin portal access**. Interacts via Public Website & Telegram. |

---

## 3. Comprehensive Permissions Matrix

The matrix below defines permissions across all API resources: `C` (Create), `R` (Read), `U` (Update), `D` (Delete), `A` (Approve).

| Module / Resource | Super Admin | Chairperson | Secretary | Timihrt Lead | Mezmur Lead | Kutitr Lead | Ekd Lead | Kinetibeb Lead | Regular Member |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Member Profiles (Stage 1 & 2)** | CRUD | CRUD | CRUD | R (Self/Team) | R (Self/Team) | R (All) | R (All) | R (Self/Team) | None |
| **Family Setup & Assignment** | CRUD | CRUD | CRUD | R | R | R | R | R | None |
| **Children Profiles & Groups** | CRUD | CRUD | CRUD | R | R | CRUD | R | R | None |
| **Parent Records & Links** | CRUD | CRUD | CRUD | R | R | CRUD | R | R | None |
| **Saturday Route Allocation** | CRUD | CRUD | R | None | None | CRUD | R | None | None |
| **Weekly Program Attendance** | CRUD | CRUD | R | R | R | CRUD | R | R | None |
| **Curriculum & Teacher Roster**| CRUD | CRUD | R | CRUD | None | None | R | None | None |
| **Academic Scores & Exams** | CRUD | CRUD | R | CRUD | None | None | R | None | None |
| **Hymn Playlist & Astegni** | CRUD | CRUD | R | None | CRUD | None | R | None | None |
| **Film & Yeteret Abat Roster**| CRUD | CRUD | R | None | None | None | R | CRUD | None |
| **Annual Master Plan** | CRUD | CRUDA | R | R (Own Plan) | R (Own Plan) | R (Own Plan) | CRUD | R (Own Plan) | None |
| **Plan Distribution** | CRUD | CRUDA | None | None | None | None | CRUD | None | None |
| **Weekly Execution & Progress**| CRUD | CRUD | None | CRU (Own) | CRU (Own) | CRU (Own) | CRU (All) | CRU (Own) | None |
| **Events & Special Programs** | CRUD | CRUDA | R | R (Assigned) | R (Assigned) | R (Assigned) | CRUD | R (Assigned) | None |
| **Periodic Reports (W/M/Q/A)**| CRUD | CRUDA | R | CR (Own) | CR (Own) | CR (Own) | CRUDA (All)| CR (Own) | None |
| **Public Announcements** | CRUD | CRUDA | CRU | None | None | None | CRUD | None | None |
| **Telegram Broadcast Triggers**| CRUD | CRUD | CRU | None | None | None | CRUD | None | None |

---

## 4. API Authorization Guard Implementation

Permission evaluation at the Express controller level uses two composable middlewares:
1. `requireAuth()`: Verifies a valid Better Auth session.
2. `requireScopePermission(resource, action, subDeptScope?)`:
   - Checks if the user holds a Global Executive Role (`SUPER_ADMIN`, `CHAIRPERSON`, `SUB_CHAIRPERSON`).
   - If not global, checks if the user holds an active leadership role for the targeted sub-department (`subDeptScope`).
   - If authorization fails, returns `HTTP 403 Forbidden` with error code `FORBIDDEN_INSUFFICIENT_SCOPE`.
