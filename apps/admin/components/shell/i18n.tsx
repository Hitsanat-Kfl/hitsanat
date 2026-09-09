"use client";

import * as React from "react";

type Locale = "en" | "am";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; am: string }> = {
  "nav.dashboard": { en: "Dashboard", am: "ዳሽቦርድ" },
  "nav.children": { en: "Children", am: "ህፃናት" },
  "nav.groups": { en: "Groups", am: "ቡድኖች" },
  "nav.teachers": { en: "Teachers", am: "አስተማሪዎች" },
  "nav.schedule": { en: "Schedule", am: "መርሐግብር" },
  "nav.mezmur": { en: "Mezmur", am: "መዝሙር" },
  "nav.biblical-studies": { en: "Biblical Studies", am: "መጽሐፍ ቅዱስ ጥናት" },
  "nav.prayer": { en: "Prayer Ministry", am: "ጸሎት አገልግሎት" },
  "nav.oversight": { en: "Oversight", am: "ቁጠባ" },
  "nav.settings": { en: "Settings", am: "ቅንብሮች" },
  "nav.main": { en: "Main", am: "ዋና" },
  "nav.ministry": { en: "Ministry", am: "አገልግሎት" },
  "nav.programs": { en: "Programs", am: "ፕሮግራሞች" },
  "nav.management": { en: "Management", am: "ዳኝነት" },
  "nav.system": { en: "System", am: "ስርዓት" },
  "search.placeholder": { en: "Search...", am: "ፈልግ..." },
  "search.no-results": { en: "No results found", am: "ምንም ውጤት አልተገኘም" },
  "search.recent": { en: "Recent", am: "የቅርብ ጊዜ" },
  "notifications.title": { en: "Notifications", am: "ማሳወቂያዎች" },
  "notifications.empty": { en: "No notifications", am: "ማሳወቂያ የለም" },
  "notifications.mark-all-read": { en: "Mark all as read", am: "ሁሉንም እንደ ተነበበ ስатор" },
  "user.profile": { en: "Profile", am: "መገለጫ" },
  "user.settings": { en: "Settings", am: "ቅንብሮች" },
  "user.logout": { en: "Sign out", am: "ውጣ" },
  "shell.collapse": { en: "Collapse sidebar", am: "የጎणበሪት ዝርዝር ዝጋ" },
  "shell.expand": { en: "Expand sidebar", am: "የጎणበሪት ዝርዝር አስፋልጥ" },
  "shell.menu": { en: "Menu", am: "ዝርዝር" },
  "page.back": { en: "Back", am: "ተመለስ" },
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocale] = React.useState<Locale>(initialLocale);

  const t = React.useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[locale] ?? entry.en ?? key;
    },
    [locale]
  );

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => {
        const entry = translations[key];
        return entry?.en ?? key;
      },
    };
  }
  return context;
}

export type { Locale };
