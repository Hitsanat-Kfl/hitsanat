# Module Specification: Events Management (M-09)

## Hitsanat Kifl Children's Ministry Management System
**Module ID:** M-09  
**Target Lane:** Backend Support (Israel) + Frontend Lane  
**Architectural Lead:** Core Lead (Review & Constraints)  

---

## 1. Module Overview

The Events Management module manages special celebrations, liturgical feasts, and training programs.

### Event Categories:
1. **Fixed Feasts (Fixed Dates):** *Timket* (ጥምቀት — January), *Hosaena* (ሆሳዕና — Spring).
2. **Monthly Events:** *Awdemerit* (ዓውደ ምህረት), Monthly Birthday Celebration (15th of each Ethiopian month).
3. **Ad-Hoc / Scheduled Events:** *Adar* (አደር), Fresh Welcome (September), Welfare Programs.

---

## 2. Invariant Rules for Events

- **Multi-Member Assignment Rule (BR-014):** Every sub-department program segment in an event must have at least **two members** assigned (never a single owner).
- **Extra Training Roster:** Special events trigger extra training sessions, generating dedicated attendance rosters in `event_attendance`.
- **Public Countdown Integration:** If `is_published` and `countdown_active` are true, the event is immediately featured on the public portfolio website with an interactive live countdown.

---

## 3. Key Use Cases

1. **`CreateEventUseCase`:** Ekd leader creates event with title, Ethiopian/Gregorian date, and type.
2. **`AssignSubDepartmentProgramUseCase`:** Assigns program segment to a sub-department with $\ge 2$ members.
3. **`PublishEventToPortfolioUseCase`:** Publishes event and activates live countdown on `apps/portfolio`.
4. **`ScheduleExtraTrainingSessionsUseCase`:** Generates extra rehearsal sessions with auto-seeded attendance.
