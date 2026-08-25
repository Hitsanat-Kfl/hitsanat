# Frontend UI System & Design Tokens

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Design System:** Tailwind CSS + shadcn/ui  

---

## 1. Design Tokens & Color Palette

The visual identity honors Orthodox Tewahedo ministry tradition with a clean, modern, accessible color palette.

| Token | HSL Value | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Primary (Church Deep Gold)** | `hsl(43, 96%, 45%)` | `bg-primary text-primary-foreground` | Main action buttons, active navigation indicators, key highlights |
| **Secondary (Deep Navy / Charcoal)**| `hsl(222, 47%, 11%)` | `bg-secondary text-secondary-foreground` | Header backgrounds, dark mode containers, executive accents |
| **Background (Light Mode)** | `hsl(0, 0%, 100%)` | `bg-background` | Default page background |
| **Muted** | `hsl(210, 40%, 96.1%)` | `bg-muted text-muted-foreground` | Form field backgrounds, disabled states, subtle borders |
| **Destructive** | `hsl(0, 84.2%, 60.2%)` | `bg-destructive text-destructive-foreground` | Delete actions, absence markers |
| **Success** | `hsl(142, 76%, 36%)` | `bg-emerald-600 text-white` | Attendance present markers, completed plan milestones |

---

## 2. Typography & Ge'ez Font Stack

To ensure seamless bilingual rendering of Amharic and English:
- **Primary Latin Font:** `Inter` or `Geist Sans`
- **Primary Ge'ez Font:** `Noto Sans Ethiopic` or `Abyssinica SIL`
- **Fallback:** `sans-serif`

```css
/* Typography Configuration */
body {
  font-family: var(--font-geist-sans), 'Noto Sans Ethiopic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## 3. Mobile-First Component Rules (NFR-04.1)

1. **Touch-Friendly Targets:** All interactive buttons, table rows, and attendance toggle pills maintain a minimum touch target height of $44\text{ px}$.
2. **Horizontal Scroll Containment:** Large data tables (e.g. Action Plan matrix, Attendance rosters) feature frozen key columns (Child Name / Activity) with smooth horizontal swipe containers on mobile viewports.
3. **Bottom Sheet Drawers:** Dialogs on mobile viewports render as bottom slide-up sheets (`vaul` / shadcn Drawer) for single-handed thumb operation.
