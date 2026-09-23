"use client";

import { Button, ScrollArea, Separator, Tooltip } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { ChevronLeft, ChevronRight, Church } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useI18n } from "./i18n";
import {
  type AdminNavItem,
  type AdminNavSection,
  type AdminNavRole,
  findAdminActiveNavItem,
  getAdminNavigationForRoles,
} from "./admin-nav-config";
import { useShell } from "./shell-context";

/** Gold #F3C913 — used ONLY as the active-nav accent (icon/text/indicator). */
const GOLD_ACCENT = "#F3C913";
const GOLD_ACCENT_TEXT = "text-[#F3C913]";

function BrandLogo({
  className,
  iconSize = "h-5 w-5",
}: {
  className?: string;
  iconSize?: string;
}) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md overflow-hidden",
        className
      )}
    >
      {hasError ? (
        <Church className={iconSize} aria-hidden="true" />
      ) : (
        <img
          src="/logo.jpg"
          alt="Hitsanat Kifl Logo"
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

/** White-ringed logo variant for the burgundy sidebar/login surfaces. */
function BrandLogoOnBrand({
  className,
  iconSize = "h-5 w-5",
}: {
  className?: string;
  iconSize?: string;
}) {
  return <BrandLogo className={cn("ring-2 ring-white/40", className)} iconSize={iconSize} />;
}

interface AppSidebarProps {
  roles?: AdminNavRole[];
  className?: string;
}

export function AppSidebar({ roles = ["chairperson"], className }: AppSidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useShell();
  const pathname = usePathname();
  const { t } = useI18n();
  const sections = getAdminNavigationForRoles(roles);
  const activeItem = findAdminActiveNavItem(pathname);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r admin-sidebar transition-all duration-200 select-none",
        sidebarCollapsed ? "w-[68px]" : "w-[244px]",
        className
      )}
      aria-label="Sidebar navigation"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b admin-sidebar-border-b px-3.5">
        {!sidebarCollapsed && (
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0"
            aria-label="Hitsanat Kifl Home"
          >
            <BrandLogoOnBrand className="h-9 w-9 text-sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-semibold text-white leading-tight truncate">
                Hitsanat Kifl
              </span>
              <span className="text-[11px] text-white/70 leading-tight truncate">
                Children&apos;s Ministry
              </span>
              <span className="text-[10px] text-white/50 leading-tight truncate">
                Management System
              </span>
            </div>
          </Link>
        )}
        {sidebarCollapsed && (
          <Link
            href="/"
            className="mx-auto flex items-center justify-center"
            aria-label="Hitsanat Kifl Home"
          >
            <BrandLogoOnBrand className="h-9 w-9 text-sm" />
          </Link>
        )}
      </div>

      {/* Navigation Region - Scrollable */}
      <ScrollArea className="flex-1 py-2">
        <nav aria-label="Main navigation" className="px-2">
          {sections.map((section, sectionIndex) => (
            <SidebarSection
              key={section.id}
              section={section}
              activeItem={activeItem}
              collapsed={sidebarCollapsed}
              pathname={pathname}
              t={t}
              showSeparator={sectionIndex > 0}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer Area - Institutional quote, subtle decorative pattern & collapse */}
      <div className="admin-sidebar-border-b border-t p-2 space-y-1.5">
        {!sidebarCollapsed && (
          <div
            className="relative overflow-hidden rounded-md px-2 pb-1 pt-2 text-center"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Cpath d='M22 6 L22 38 M6 22 L38 22 M12 12 L32 32 M32 12 L12 32' stroke='white' stroke-width='1' fill='none' opacity='0.14'/%3E%3C/svg%3E\")",
              backgroundSize: "44px 44px",
            }}
          >
            <p className="relative text-[11px] font-medium leading-snug text-white/75">
              Together in faith,
              <br />
              for a better tomorrow.
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? t("shell.expand") : t("shell.collapse")}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <ChevronLeft className="h-4 w-4" />
              <span>{t("shell.collapse")}</span>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
}

function SidebarSection({
  section,
  activeItem,
  collapsed,
  pathname,
  t,
  showSeparator,
}: {
  section: AdminNavSection;
  activeItem?: AdminNavItem;
  collapsed: boolean;
  pathname: string;
  t: (key: string) => string;
  showSeparator: boolean;
}) {
  return (
    <div className="py-1">
      {showSeparator && <Separator className="my-2 opacity-50" decorative />}
      {!collapsed && (
        <p className="px-3 py-1.5 text-[11px] font-semibold text-white/70 uppercase tracking-wider">
          {t(`nav.${section.id}`)}
        </p>
      )}
      <ul className="space-y-1">
        {section.items.map((item) => {
          const isCurrent =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isItemActive = isCurrent || activeItem?.id === item.id;

          return (
            <NavItemElement
              key={item.id}
              item={item}
              isActive={isItemActive}
              isCurrentPath={isCurrent}
              collapsed={collapsed}
              t={t}
            />
          );
        })}
      </ul>
    </div>
  );
}

function NavItemElement({
  item,
  isActive,
  isCurrentPath,
  collapsed,
  t,
}: {
  item: AdminNavItem;
  isActive: boolean;
  isCurrentPath: boolean;
  collapsed: boolean;
  t: (key: string) => string;
}) {
  const Icon = item.icon;
  const label = t(`nav.${item.id}`);

  const linkContent = (
    <Link
      href={item.disabled ? "#" : item.href}
      aria-current={isCurrentPath ? "page" : undefined}
      aria-disabled={item.disabled}
      tabIndex={item.disabled ? -1 : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-md py-2 pr-3 text-sm font-medium transition-colors",
        "min-h-[40px] h-10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2",
        // Active state: subtle lighter burgundy surface + gold left indicator
        // (reference §6.3 — restrained highlight, not a bright pill).
        isActive
          ? "bg-white/15 font-semibold text-white hover:bg-white/20"
          : "text-white/90 hover:bg-white/10 hover:text-white",
        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        collapsed && "justify-center px-0"
      )}
      style={
        isActive && !collapsed
          ? { paddingLeft: "12px", boxShadow: `inset 3px 0 0 0 ${GOLD_ACCENT}` }
          : undefined
      }
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", isActive ? GOLD_ACCENT_TEXT : "text-white")}
        aria-hidden="true"
      />
      {!collapsed && <span className={cn("truncate", isActive && GOLD_ACCENT_TEXT)}>{label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full",
            isActive ? "bg-white/15 text-[#F3C913]" : "bg-white/10 text-white/70"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip content={label} side="right">
          {linkContent}
        </Tooltip>
      </li>
    );
  }

  return <li>{linkContent}</li>;
}
export { BrandLogo, BrandLogoOnBrand };
