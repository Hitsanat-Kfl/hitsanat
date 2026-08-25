# Module Specification: Ethiopian Calendar Integration (M-12)

## Hitsanat Kifl Children's Ministry Management System
**Module ID:** M-12  
**Package:** `packages/calendar`  
**Core Tooling:** `ethiopian-calendar-new` (ADR-0011)  
**Storage Architecture:** Canonical Gregorian Storage (ADR-0004)  

---

## 1. Calendar System Architecture

```mermaid
graph LR
    User[User on Admin/Portfolio UI] <-->|Ethiopian Dates (DD/MM/YYYY E.C.)| CalendarPkg[packages/calendar Adapter]
    CalendarPkg <-->|Gregorian Dates (YYYY-MM-DD UTC)| DomainAPI[Domain & Express API]
    DomainAPI <-->|TIMESTAMPTZ / DATE| Postgres[(PostgreSQL Database)]
```

---

## 2. Core Capabilities of `packages/calendar`

1. **Date Conversion:** Bidirectional conversion between Gregorian `Date` objects and Ethiopian Calendar date objects (`year`, `month`, `date`).
2. **Month Formatter & Names:** Converts numeric Ethiopian months (1 to 13) into Amharic names:
   - 1: *መስከረም* (Meskerem)
   - 2: *ጥቅምት* (Tikimt)
   - 3: *ኅዳር* (Hidar)
   - 4: *ታኅሣሥ* (Tahsas)
   - 5: *ጥር* (Tir)
   - 6: *የካቲት* (Yekatit)
   - 7: *መጋቢት* (Megabit)
   - 8: *ሚያዝያ* (Miazia)
   - 9: *ግንቦት* (Ginbot)
   - 10: *ሰኔ* (Sene)
   - 11: *ሐምሌ* (Hamle)
   - 12: *ነሐሴ* (Nehase)
   - 13: *ጳጉሜን* (Pagume)
3. **Monthly Birthday Calculation:** Converts each child's Gregorian birth date into its Ethiopian equivalent to identify children celebrating birthdays in the current Ethiopian month on the 15th day.
4. **Feast Days & Holiday Calculator:** Calculates mobile and fixed Orthodox feast dates (e.g. *Timket*, *Hosaena*, *Fasika*).
