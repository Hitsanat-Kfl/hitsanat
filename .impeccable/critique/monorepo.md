---
target: "monorepo (apps/admin + apps/portfolio)"
date: 2026-09-20
total_score: 22/40 (admin) + 24/32 (portfolio)
na_heuristics: "7,10 (portfolio — Persuade surface)"
p0_count: 1
p1_count: 1
p2_count: 2
p3_count: 1
---

# Critique: Hitsanat Monorepo

## Admin App (Operate Mode)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading spinners, error banners, success toasts present. No skeleton states. |
| 2 | Match Between System and Real World | 2 | Amharic nav strong. Forms/error messages English-only. "BR-008" leaks into UI. |
| 3 | User Control and Freedom | 2 | Dialogs have Cancel. Force sign-out has zero confirmation. |
| 4 | Consistency and Standards | 3 | shadcn/ui solid foundation. Patterns uniform. |
| 5 | Error Prevention | 2 | Deactivation has AlertDialog. Force sign-out one-click no undo. |
| 6 | Recognition Rather Than Recall | 3 | Icons labeled, active nav highlighted, breadcrumbs. |
| 7 | Flexibility and Efficiency of Use | 1 | Zero keyboard shortcuts. No bulk actions. No customizable views. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean with warm admin identity. Login carries Orthodox visual language. |
| 9 | Error Recovery | 2 | Error messages name problem and offer Retry. No inline guidance. |
| 10 | Help and Documentation | 1 | No contextual help. No tooltips for ministry terms. |
| **Total** | | **22/40** | **Acceptable** |

## Portfolio App (Persuade Mode)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Hero loads cleanly. KPI cards present. |
| 2 | Match Between System and Real World | 4 | Bilingual throughout. Ethiopian date. Ministry terminology correct. |
| 3 | User Control and Freedom | 3 | Navigation clear. CTAs obvious. |
| 4 | Consistency and Standards | 3 | Consistent card patterns. Same icon style. |
| 5 | Error Prevention | 1 | About and Programs pages return 404. |
| 6 | Recognition Rather Than Recall | 3 | Icons labeled. Section headers bilingual. |
| 7 | Flexibility and Efficiency of Use | n/a | Persuade surface. |
| 8 | Aesthetic and Minimalist Design | 4 | Burgundy hero with cross pattern is distinctive. Purposeful color. |
| 9 | Error Recovery | 1 | 404 page is default Next.js — no branding, no guidance. |
| 10 | Help and Documentation | n/a | Persuade surface. |
| **Total** | | **24/32** | **Good** |

## Priority Issues

1. **[P0]** Portfolio About and Programs pages return 404 — broken navigation
2. **[P1]** Admin authenticated shell lacks login's warmth — visual discontinuity
3. **[P2]** Portfolio 404 page is unbranded — breaks visual continuity
4. **[P2]** Admin mobile nav is role-blind — cuts off important items
5. **[P3]** No contextual help for ministry terminology — new users lost

## What's Working

1. Portfolio hero — burgundy with cross pattern, bilingual hierarchy, KPI cards
2. Admin login — split-screen with cross-pattern panel, ministry identity
3. Bilingual architecture — structural, not bolted-on

## Persona Red Flags

- **Alex (Power User)**: No keyboard shortcuts, no bulk actions
- **Sam (Accessibility)**: Color-only success notifications, missing aria-labels
- **Casey (Mobile)**: Broken nav links (404), needs role-aware bottom nav
- **Jordan (First-Timer)**: 404 pages make site feel broken
