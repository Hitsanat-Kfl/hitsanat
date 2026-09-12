"use client";

import { Button, ScrollArea, Separator, Tooltip } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-64",
        className
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!sidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              H
            </div>
            <span className="text-sm font-semibold text-foreground truncate">Hitsanat</span>
          </Link>
        )}
        {sidebarCollapsed && (
          <Link
            href="/"
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold"
          >
            H
          </Link>
        )}
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav aria-label="Main navigation">
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

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-10"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? t("shell.expand") : t("shell.collapse")}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
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
    <div className="px-2 py-1">
      {showSeparator && <Separator className="my-2" decorative />}
      {!collapsed && (
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t(`nav.${section.id}`)}
        </p>
      )}
      <ul className="space-y-0.5">
        {section.items.map((item) => (
          <NavItemElement
            key={item.id}
            item={item}
            isActive={activeItem?.id === item.id}
            isCurrentPath={pathname === item.href}
            collapsed={collapsed}
            t={t}
          />
        ))}
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
        "min-h-[44px] md:min-h-[36px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isCurrentPath && "bg-primary/10 text-primary font-semibold",
        !isCurrentPath && "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        item.disabled && "opacity-50 cursor-not-allowed",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", isCurrentPath && "text-primary")}
        aria-hidden="true"
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto text-xs font-medium text-muted-foreground">{item.badge}</span>
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
