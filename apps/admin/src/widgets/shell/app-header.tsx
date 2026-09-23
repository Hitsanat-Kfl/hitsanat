"use client";

import { Breadcrumb, type BreadcrumbItem, Button } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { toEthiopianDate, formatEthiopianDate } from "@repo/calendar";
import { Globe, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BrandLogo } from "./app-sidebar";
import { SearchTrigger } from "./global-search";
import { useI18n } from "./i18n";
import { findAdminActiveNavItem } from "./admin-nav-config";
import { NotificationCenter } from "./notification-center";
import { useShell } from "./shell-context";
import { UserMenu } from "./user-menu";

interface AppHeaderProps {
  className?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userAvatarSrc?: string;
  breadcrumbs?: BreadcrumbItem[];
  onLogout?: () => void;
}

function useTodayLabel(): string {
  const [label, setLabel] = React.useState("");

  React.useEffect(() => {
    const now = new Date();
    // Full Gregorian + Ethiopian form on desktop; compact on tablet (§8).
    const w =
      typeof window !== "undefined" ? (window as unknown as { matchMedia?: unknown }) : null;
    const matches =
      typeof w?.matchMedia === "function"
        ? (w.matchMedia("(min-width: 1024px)") as MediaQueryList).matches
        : true;
    const full = matches;
    const gregorian = now.toLocaleDateString("en-GB", {
      weekday: full ? "long" : "short",
      day: "numeric",
      month: full ? "long" : "short",
      year: "numeric",
    });
    let text = `Today · ${gregorian}`;
    try {
      const eth = toEthiopianDate({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      });
      text += ` · ${formatEthiopianDate(eth)}`;
    } catch {
      // Calendar conversion is enhancement-only; Gregorian label suffices.
    }
    setLabel(text);
  }, []);

  return label;
}

export function AppHeader({
  className,
  userName,
  userEmail,
  userRole,
  userAvatarSrc,
  breadcrumbs,
  onLogout,
}: AppHeaderProps) {
  const { setMobileMenuOpen } = useShell();
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const activeNav = findAdminActiveNavItem(pathname);
  const todayLabel = useTodayLabel();

  // Auto-generate breadcrumbs if not explicitly provided
  const headerBreadcrumbs: BreadcrumbItem[] = React.useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) return breadcrumbs;
    if (!activeNav || activeNav.href === "/") {
      return [{ label: t("nav.dashboard") }];
    }
    const sectionLabel = activeNav.section ? t(`nav.${activeNav.section}`) : undefined;
    const items: BreadcrumbItem[] = [{ label: t("nav.dashboard"), href: "/" }];
    if (sectionLabel && sectionLabel !== t("nav.overview")) {
      items.push({ label: sectionLabel });
    }
    items.push({ label: t(`nav.${activeNav.id}`) });
    return items;
  }, [breadcrumbs, activeNav, t]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b admin-header px-4 sm:px-6 bg-background/95",
        className
      )}
      aria-label="Application header"
    >
      {/* Left Area: Mobile brand, Menu Trigger, Breadcrumb / Current Page (§8, §12) */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px] admin-header-action -ml-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label={t("shell.menu")}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Mobile compact brand (application mode, §12) */}
        <Link
          href="/"
          aria-label="Hitsanat Kifl Home"
          className="md:hidden flex items-center gap-2 min-w-0"
        >
          <BrandLogo className="h-8 w-8" iconSize="h-4 w-4" />
          <span className="text-sm font-semibold text-white truncate">Hitsanat Kifl</span>
        </Link>

        {/* Desktop breadcrumb context */}
        <Breadcrumb
          items={headerBreadcrumbs}
          className="hidden md:flex min-w-0"
          aria-label="Breadcrumb"
        />
      </div>

      {/* Right Area: Search, Today's Date, Language, Notifications, User (§8) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <SearchTrigger className="hidden sm:inline-flex" />

        {todayLabel && (
          <p className="hidden lg:block text-xs font-medium text-muted-foreground whitespace-nowrap">
            {todayLabel}
          </p>
        )}

        {/* Quick Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "en" ? "am" : "en")}
          className="admin-header-action h-9 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 min-h-[44px] sm:min-h-9"
          aria-label={`Switch to ${locale === "en" ? "Amharic" : "English"}`}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold">{locale === "en" ? "English" : "አማርኛ"}</span>
        </Button>

        <div className="admin-header-action">
          <NotificationCenter />
        </div>

        <div className="admin-header-action">
          <UserMenu
            name={userName}
            email={userEmail}
            role={userRole}
            avatarSrc={userAvatarSrc}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
