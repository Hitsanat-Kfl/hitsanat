# Planning System: Weekly Planning & Member Execution

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  

---

## 1. Weekly Execution Workflow

Weekly planning coordinates the Saturday (8:00–11:30 AM) and Sunday (8:00–10:00 AM) weekend ministry sessions.

```mermaid
sequenceDiagram
    autonumber
    actor SubDept as Sub-Department Leader
    actor Members as Assigned Members (>= 2)
    participant System as Management System (apps/admin)
    participant Kutitr as Kutitr Attendance System

    SubDept->>System: Creates Weekly Task for Saturday Program
    SubDept->>System: Assigns 2+ Members
    System-->>Kutitr: Auto-seeds session attendance (Expected)
    Members->>Members: Execute teaching / hymn rehearsal / transport
    SubDept->>System: Logs Actual Result & Completion Status
    System-->>System: Recalculates Sub-Dept Progress %
```

---

## 2. Weekly Task Status Lifecycle

- `PLANNED`: Task scheduled for the upcoming weekend.
- `IN_PROGRESS`: Program underway or actively in rehearsal.
- `COMPLETED`: Session successfully conducted; output logged.
- `DELAYED`: Postponed due to university exams or church feast rescheduling.
- `CANCELLED`: Explicitly cancelled with recorded justification.
