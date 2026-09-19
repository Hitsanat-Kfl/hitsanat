"use client";

import * as React from "react";

export type DashboardLocale = "en" | "am";

/**
 * Locale for dashboard widgets (Phase 06 §22).
 *
 * Widgets receive both English and Amharic strings via props (titleAm,
 * labelAm, …) and use this context to decide which to render. The default
 * is English, so widgets render unchanged outside a provider (tests,
 * standalone usage). The admin shell bridges its own locale state into
 * this provider — see features/shell/app-shell.tsx.
 */
const DashboardLocaleContext = React.createContext<DashboardLocale>("en");

interface DashboardLocaleProviderProps {
  locale: DashboardLocale;
  children: React.ReactNode;
}

export function DashboardLocaleProvider({ locale, children }: DashboardLocaleProviderProps) {
  return (
    <DashboardLocaleContext.Provider value={locale}>{children}</DashboardLocaleContext.Provider>
  );
}

export function useDashboardLocale(): DashboardLocale {
  return React.useContext(DashboardLocaleContext);
}

/**
 * Returns a picker that yields the Amharic variant when the active locale
 * is am and an Amharic string was provided, otherwise the English string.
 */
export function useLocalizedText(): (
  en: string | undefined,
  am: string | undefined
) => string | undefined {
  const locale = useDashboardLocale();
  return React.useCallback((en, am) => (locale === "am" && am ? am : en), [locale]);
}
