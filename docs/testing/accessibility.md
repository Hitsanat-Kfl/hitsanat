# Testing: Accessibility (a11y) & Automated Audits

## Hitsanat Kifl Children's Ministry Management System
**Document Version:** 2.1  
**Runner:** `@axe-core/playwright` (`pnpm test:a11y`)  
**Standard:** WCAG 2.1 Level AA  

---

## 1. Automated Accessibility Audit Pipeline

```mermaid
graph LR
    Playwright[Playwright Test Instance] --> LoadPage[Navigate to Dashboard Page]
    LoadPage --> InjectAxe[Inject Axe Core Engine]
    InjectAxe --> Analyze[Run axe.run()]
    Analyze --> AssertViolations[Assert: 0 Critical / Serious Violations]
```

---

## 2. Key Accessibility Checkpoints

1. **Color Contrast:** Deep gold (`hsl(43, 96%, 45%)`) and dark navy text must maintain a contrast ratio $\ge 4.5:1$ against backgrounds.
2. **Keyboard Navigation:** All dropdown menus, modal dialogs, and date pickers must support `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` navigation with visible focus rings.
3. **Form Labels & ARIA Attributes:** Every form input in member and child registration must have an associated `<label>` or `aria-label`.
4. **Ge'ez Text Screen Reader Compatibility:** Semantic headings (`<h1>` through `<h6>`) and language tags (`lang="am"`) for Ethiopic script sections.
