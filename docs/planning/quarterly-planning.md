# Planning System: Quarterly, Monthly & Weekly Planning

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Time Horizon:** Multi-Period Planning Hierarchy  

---

## 1. Quarterly Planning (Q1 – Q4 Distribution)

The academic year plan is partitioned across four operational quarters aligned with the Ethiopian academic calendar:

```mermaid
timeline
    title 2016 E.C. Ministry Quarters
    section Q1 (1ኛ ሩብ ዓመት)
      ጥቅምት (Tikimt) : Semester Start / Enrollment
      ኅዳር (Hidar) : Regular Classes / Hymns
      ታኅሣሥ (Tahsas) : Pre-Timket Rehearsals
    section Q2 (2ኛ ሩብ ዓመት)
      ጥር (Tir) : Timket Celebration / Mid-Exams
      የካቲት (Yekatit) : Mid-Year Reviews
      መጋቢት (Megabit) : Fasting Season Programs
    section Q3 (3ኛ ሩብ ዓመት)
      ሚያዝያ (Miazia) : Hosaena / Fasika Celebrations
      ግንቦት (Ginbot) : Final Exams
      ሰኔ (Sene) : Year-End Evaluations
    section Q4 (4ኛ ሩብ ዓመት)
      ሐምሌ / ነሐሴ (Hamle/Nehase) : Summer Ministry & Transition
```

---

## 2. Monthly Target Scheduling

Each activity specifies planned targets across the 9 core operational months in `Action PLN.xlsx`:
1. **ጥቅምት (Tikimt):** Initial setup, registration drive, teacher allocation.
2. **ኅዳር (Hidar):** Regular curriculum rollout, Saturday transport route stabilization.
3. **ታኅሣሥ (Tahsas):** Timket choir preparation, Mid-exam syllabus completion.
4. **ጥር (Tir):** Epiphany (Timket) feast programs, Mid exams.
5. **የካቲት (Yekatit):** Mid-year performance evaluation, parent pastoral visits.
6. **መጋቢት (Megabit):** Lent spiritual songs, moral storytelling series.
7. **ሚያዝያ (Miazia):** Palm Sunday (Hosaena) presentations, Easter celebrations.
8. **ግንቦት (Ginbot):** Final academic exams, comprehensive attendance audits.
9. **ሰኔ (Sene):** Annual review, graduation class (GC) transition, annual report.

---

## 3. Weekly Execution & Multi-Member Assignment (BR-014)

```mermaid
graph TD
    MonthlyTarget[Monthly Target: 4 Saturday Sessions] --> Week1[Week 1: Session Task]
    MonthlyTarget --> Week2[Week 2: Session Task]
    MonthlyTarget --> Week3[Week 3: Session Task]
    MonthlyTarget --> Week4[Week 4: Session Task]

    Week1 --> AssignMembers[Assign $\ge 2$ Active Members]
    AssignMembers --> AutoSeedAttendance[Auto-Seed Attendance Roster]
    AutoSeedAttendance --> ExecuteSession[Saturday 8:00 - 11:30 AM Execution]
    ExecuteSession --> RecordProgress[Record Actual Output in DB]
```

### Invariants:
- Weekly tasks directly reference the parent `plan_distribution_id`.
- The system prevents single-member assignments for safety and accountability ($\ge 2$ members required).
