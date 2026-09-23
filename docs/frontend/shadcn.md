# Frontend: shadcn/ui Component Setup

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Preset Code:** `b1D0f7S7` (ADR-0009)  
**Package:** `packages/ui`  

---

## 1. Component Library Initialization

The shared UI package is initialized using the official project preset:

```bash
pnpm dlx shadcn@latest init --preset b1D0f7S7 --template next
```

Components reside inside `packages/ui/src/components/` and are consumed across `apps/admin` and `apps/portfolio`.

---

## 2. Core UI Component Inventory

| Component | Shared Path | Ministry Use Case |
| :--- | :--- | :--- |
| **Data Table** | `@repo/ui/data-table` | Member directory, Child roster, Exam scores, Master Plan matrix |
| **Drawer / Dialog** | `@repo/ui/dialog`, `@repo/ui/drawer` | Mobile attendance verification, stage 1 member fast entry modal |
| **Date Picker (Ethiopian)** | `@repo/ui/ethiopian-date-picker` | Birthday selector, session scheduler, event calendar |
| **Badge / Status Pill** | `@repo/ui/badge` | Attendance status (`Expected`, `Present`, `Absent`, `Excused`) |
| **Progress Bar** | `@repo/ui/progress` | Plan completion percentage, budget expenditure indicators |
| **Combobox / Multi-Select** | `@repo/ui/combobox` | Sub-department assignment (multi-select), parent linking |
| **Metric Card (StatCard)** | `@repo/ui/stat-card` | Executive KPI widgets (Active Servants, Enrolled Kids, Weights) |
