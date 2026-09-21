"use client";

import { Breadcrumb, type BreadcrumbItem, Button } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { Globe, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { SearchTrigger } from "./global-search";
import { useI18n } from "./i18n";
import { findActiveNavItem } from "./nav-config";
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
  const activeNav = findActiveNavItem(pathname);

  // Auto-generate breadcrumbs if not explicitly provided
  const headerBreadcrumbs: BreadcrumbItem[] = React.useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) return breadcrumbs;
    if (!activeNav || activeNav.href === "/") {
      return [{ label: t("nav.dashboard") }];
    }
    const sectionLabel = activeNav.section ? t(`nav.${activeNav.section}`) : undefined;
    const items: BreadcrumbItem[] = [{ label: t("nav.dashboard"), href: "/" }];
    if (sectionLabel && sectionLabel !== t("nav.main")) {
      items.push({ label: sectionLabel });
    }
    items.push({ label: t(`nav.${activeNav.id}`) });
    return items;
  }, [breadcrumbs, activeNav, t]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b admin-header px-4 sm:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      aria-label="Application header"
    >
      {/* Left Area: Mobile Menu Trigger & Context / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-h-[44px] min-w-[44px]"
          onClick={() => setMobileMenuOpen(true)}
          aria-label={t("shell.menu")}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="hidden sm:block truncate">
          <Breadcrumb items={headerBreadcrumbs} className="text-xs" />
        </div>
      </div>

      {/* Right Area: Search, Language, Notifications, User Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <SearchTrigger className="hidden sm:inline-flex" />

        {/* Quick Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "en" ? "am" : "en")}
          className="h-9 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 min-h-[44px] sm:min-h-9"
          aria-label={`Switch to ${locale === "en" ? "Amharic" : "English"}`}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold">{locale === "en" ? "EN" : "አማ"}</span>
        </Button>

        <NotificationCenter />

        <UserMenu
          name={userName}
          email={userEmail}
          role={userRole}
          avatarSrc={userAvatarSrc}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
