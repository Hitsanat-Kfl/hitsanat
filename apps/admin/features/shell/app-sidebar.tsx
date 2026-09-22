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
        sidebarCollapsed ? "w-[68px]" : "w-60",
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

      {/* Footer Area - Brand mark & Collapse */}
      <div className="border-t admin-sidebar-border-b p-2 space-y-1.5">
        {!sidebarCollapsed && (
          <div className="px-2 py-1 text-center">
            <p className="text-[11px] font-medium text-white/70 tracking-wide">
              Serving Children · Building Faith
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
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "min-h-[40px] h-10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2",
        isActive
          ? "bg-[hsl(var(--admin-sidebar-active))] text-[hsl(var(--admin-sidebar-active-text))] font-semibold hover:bg-[hsl(var(--admin-sidebar-active))]/90"
          : "text-white/90 hover:bg-white/10 hover:text-white",
        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-[hsl(var(--admin-sidebar-active-text))]" : "text-white"
        )}
        aria-hidden="true"
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full",
            isActive
              ? "bg-[hsl(var(--admin-sidebar-active-text))]/15 text-[hsl(var(--admin-sidebar-active-text))]"
              : "bg-white/10 text-white/70"
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
