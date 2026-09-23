"use client";

import * as React from "react";

type Locale = "en" | "am";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; am: string }> = {
  // Navigation Sections - Admin Shell
  "nav.overview": { en: "Overview", am: "አጠቃላይ" },
  "nav.organization": { en: "Organization", am: "ድርጅት" },
  "nav.user-management": { en: "User Management", am: "የተጠቃሚ አስተዳደር" },
  "nav.security-access": { en: "Security & Access", am: "ደህንነት እና መድረስ" },
  "nav.audit": { en: "Audit", am: "ማጣቀሻ" },
  "nav.system": { en: "System", am: "ስርዓት" },

  // Legacy Navigation Sections (kept for compatibility)
  "nav.main": { en: "Main", am: "ዋና" },
  "nav.ministry": { en: "Ministry", am: "አገልግሎት" },
  "nav.programs": { en: "Programs", am: "ፕሮግራሞች" },
  "nav.administration": { en: "Administration", am: "አስተዳደር" },
  "nav.operations": { en: "Operations", am: "ሥራ አመራር" },

  // Navigation Items - Admin Shell
  "nav.dashboard": { en: "Dashboard", am: "ዳሽቦርድ" },
  "nav.members": { en: "Members", am: "አባላት" },
  "nav.children": { en: "Children", am: "ህፃናት" },
  "nav.sub-departments": { en: "Subdepartments", am: "ንዑሳን ክፍላት" },
  "nav.users": { en: "User Accounts", am: "የተጠቃሚ መገለጫዎች" },
  "nav.permissions": { en: "Roles & Permissions", am: "ሚSSION እና ፍቃዶች" },
  "nav.audit-logs": { en: "Audit Log", am: "የአዲስ መዝገቦች" },
  "nav.settings": { en: "Settings", am: "ማስተካከያዎች" },

  // Legacy Navigation Items (kept for compatibility)
  "nav.attendance": { en: "Attendance", am: "ክትትል" },
  "nav.academic": { en: "Academic", am: "ትምህርት" },
  "nav.events": { en: "Events", am: "መርሐግብሮች" },
  "nav.transport": { en: "Transport", am: "ትራንስፖርት" },
  "nav.planning": { en: "Planning", am: "ዕቅድ" },
  "nav.reports": { en: "Reports", am: "ሪፖርቶች" },

  // Search
  "search.placeholder": { en: "Search...", am: "ፈልግ..." },
  "search.no-results": { en: "No results found", am: "ምንም ውጤት አልተገኘም" },
  "search.recent": { en: "Recent", am: "የቅርብ ጊዜ" },

  // Notifications
  "notifications.title": { en: "Notifications", am: "ማሳወቂያዎች" },
  "notifications.empty": { en: "No notifications", am: "ማሳወቂያ የለም" },
  "notifications.mark-all-read": { en: "Mark all as read", am: "ሁሉንም እንደተነበበ አድርግ" },

  // User Menu
  "user.profile": { en: "Profile", am: "መገለጫ" },
  "user.settings": { en: "Settings", am: "ቅንብሮች" },
  "user.logout": { en: "Sign out", am: "ውጣ" },

  // Shell Controls & Branding
  "shell.collapse": { en: "Collapse sidebar", am: "የጎን አሞሌን አሳንስ" },
  "shell.expand": { en: "Expand sidebar", am: "የጎን አሞሌን አስፋ" },
  "shell.menu": { en: "Menu", am: "ምናሌ" },
  "shell.brandSubtitle": { en: "Children's Ministry", am: "የሕፃናት ክፍል" },
  "shell.motto": { en: "Serving Children · Building Faith", am: "ሕፃናትን ማገልገል · እምነትን መገንባት" },
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
