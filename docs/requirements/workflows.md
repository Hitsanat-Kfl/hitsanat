# System Operational Workflows

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Status:** Canonical Workflow Standard  

---

## 1. Primary Operational Workflows

This document models the core recurring and event-driven workflows executed by the leadership and servants of Hitsanat Kifl.

---

## 2. Saturday Ministry Workflow (8:00 AM – 11:30 AM)

```mermaid
sequenceDiagram
    autonumber
    actor Kutitr as Kutitr Leadership
    actor Members as Assigned Members (2+ per route)
    actor Children as Children / Parents
    actor Timihrt as Timihrt Teachers
    actor Mezmur as Mezmur Astegni
    actor Kinetibeb as Kinetibeb Team
    participant System as Management System

    Note over Kutitr, System: Friday Prep
    Kutitr->>System: Assign 2+ members to 5 collection locations
    System-->>System: Auto-seed transport attendance records (Status: Expected)

    Note over Members, Children: Saturday 8:00 AM - 8:45 AM (Collection)
    Members->>Children: Meet at Apartama, Gende Boy, Gende Je, Cobalt, Bate
    Members->>Members: Shepherd children to Church compound

    Note over Children, System: Saturday 8:45 AM - 11:00 AM (Ministry Programs)
    Members->>Children: Opening Prayer
    Timihrt->>Children: Conduct Spiritual Classes (Kutr 1 & Kutr 2)
    Mezmur->>Children: Teach & Practice Hymns
    Kinetibeb->>Children: Show Film / Puppet / Yeteret Abat

    Note over Kutitr, System: Saturday 11:00 AM - 11:30 AM (Verification & Close)
    Kutitr->>System: Confirm Child & Member Attendance (Present/Absent)
    Members->>Children: Closing Prayer & Escort back to collection points
```

---

## 3. Sunday Ministry Workflow (8:00 AM – 10:00 AM)

```mermaid
sequenceDiagram
    autonumber
    actor Parents as Parents
    actor Children as Children
    actor Timihrt as Timihrt Teachers
    actor Kutitr as Kutitr Team
    participant System as Management System

    Parents->>Children: Accompany children to Church post-Liturgy
    Timihrt->>Children: Read & Teach Te'amire Maryam (ተዓምረ ማርያም)
    Timihrt->>Children: Moral guidance & Orthodox church order
    Kutitr->>System: Take Sunday Attendance
    System-->>System: Update Sunday attendance metrics
```

---

## 4. Hierarchical Planning & Roll-Up Workflow

```mermaid
flowchart TD
    Start([Academic Year Begins]) --> EkdCreate[1. Ekd Leader creates Annual Master Plan]
    EkdCreate --> DefineGoals[2. Define 6 Master Goals & 25 Activities]
    DefineGoals --> ComputeWeights[3. Compute Weights via Budget, People, Time Formula]
    ComputeWeights --> ChairApprove{4. Chairperson Approves?}
    ChairApprove -- No --> EkdRevise[Revise Master Plan] --> EkdCreate
    ChairApprove -- Yes --> Distribute[5. Distribute Activities to Sub-Departments]
    
    Distribute --> TimihrtPlan[Timihrt Execution Plan]
    Distribute --> MezmurPlan[Mezmur Execution Plan]
    Distribute --> KutitrPlan[Kutitr Execution Plan]
    Distribute --> EkdInternalPlan[Ekd Execution Plan]
    Distribute --> KinetibebPlan[Kinetibeb Execution Plan]

    TimihrtPlan --> WeeklyExec[6. Sub-Departments schedule Weekly Tasks]
    MezmurPlan --> WeeklyExec
    KutitrPlan --> WeeklyExec
    EkdInternalPlan --> WeeklyExec
    KinetibebPlan --> WeeklyExec

    WeeklyExec --> MemberAction[7. Members execute assigned activities in pairs]
    MemberAction --> SubDeptRecord[8. Sub-Dept Leader records Actual Result]
    
    SubDeptRecord --> RollWeekly[9. Roll up Weekly to Monthly]
    RollWeekly --> RollMonthly[10. Roll up Monthly to Quarterly]
    RollMonthly --> RollAnnual[11. Roll up Quarterly to Annual Master Plan]
    RollAnnual --> GenerateReport[12. Ekd generates Periodic Performance Reports]
```

---

## 5. Member Registration & Onboarding Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Stage1_Draft: Secretary enters basic personal info
    Stage1_Draft --> Stage2_Enrichment: Identity verified
    Stage2_Enrichment --> Family_Assigned: Allocate to Family (Khnet)
    Family_Assigned --> SubDept_Assigned: Assign >= 1 Sub-Department
    SubDept_Assigned --> Role_Provisioned: Executive / Sub-Dept Role assigned
    Role_Provisioned --> Active_Servant: Member record fully active
    Active_Servant --> Active_Servant: Multi-year persistence across semesters
    Active_Servant --> Archived_Alumni: Member graduates (GC)
    Archived_Alumni --> [*]
```

---

## 6. Special Event & Training Workflow (e.g. Timket, Hosaena)

```mermaid
sequenceDiagram
    autonumber
    actor Ekd as Ekd Leadership
    actor Chair as Chairperson
    actor SubDepts as Sub-Department Leaders
    actor Kutitr as Kutitr
    participant System as Management System
    participant Web as Public Portfolio
    participant TG as Telegram Bot

    Ekd->>System: Create Special Event (e.g. Timket Celebration)
    Ekd->>System: Assign specific programs to Timihrt, Mezmur, Kinetibeb
    Chair->>System: Approve Event & Publish Flag
    System->>Web: Update Event Calendar & Start Live Countdown
    System->>TG: Broadcast Special Event Announcement to Telegram Group
    
    Note over SubDepts, System: Training Phase
    SubDepts->>System: Schedule extra rehearsal/training sessions
    System-->>System: Auto-seed attendee records for extra sessions
    Kutitr->>System: Track attendance for each training session
    
    Note over SubDepts, Ekd: Post-Event Review
    SubDepts->>System: Submit event execution outcomes & challenges
    Ekd->>System: Consolidate Event Report
```
