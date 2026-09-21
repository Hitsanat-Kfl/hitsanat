"use client";

import { Button, ScrollArea, Separator, Tooltip } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { ChevronLeft, ChevronRight, Church } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useI18n } from "./i18n";
import {
  type NavItem,
  type NavSection,
  type UserRole,
  findActiveNavItem,
  getNavigationForRoles,
} from "./nav-config";
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
        "flex shrink-0 items-center justify-center rounded-md bg-[#E5AE60] text-[#32131F] font-bold shadow-sm overflow-hidden",
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

interface AppSidebarProps {
  roles?: UserRole[];
  className?: string;
}

export function AppSidebar({ roles = ["chairperson"], className }: AppSidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useShell();
  const pathname = usePathname();
  const { t } = useI18n();
  const sections = getNavigationForRoles(roles);
  const activeItem = findActiveNavItem(pathname);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r admin-sidebar transition-all duration-200 select-none",
        sidebarCollapsed ? "w-16" : "w-60",
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
            <BrandLogo className="h-9 w-9 text-sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-semibold text-foreground leading-tight truncate">
                Hitsanat Kifl
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight truncate">
                Children&apos;s Ministry
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
            <BrandLogo className="h-9 w-9 text-sm" />
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
            <p className="text-[11px] font-medium text-[#B8892D] dark:text-[#E5AE60] tracking-wide">
              Serving Children · Building Faith
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-9 flex items-center justify-center text-muted-foreground hover:text-foreground"
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
  section: NavSection;
  activeItem?: NavItem;
  collapsed: boolean;
  pathname: string;
  t: (key: string) => string;
  showSeparator: boolean;
}) {
  return (
    <div className="py-1">
      {showSeparator && <Separator className="my-2 opacity-50" decorative />}
      {!collapsed && (
        <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
  item: NavItem;
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive
          ? "bg-[#E5AE60] text-[#32131F] font-semibold shadow-sm hover:bg-[#E5AE60]/90"
          : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground",
        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", isActive ? "text-[#32131F]" : "text-muted-foreground")}
        aria-hidden="true"
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full",
            isActive ? "bg-[#32131F]/15 text-[#32131F]" : "bg-muted text-muted-foreground"
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
export { BrandLogo };
