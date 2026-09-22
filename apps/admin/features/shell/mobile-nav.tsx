"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { Globe, LogOut, MoreHorizontal, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import {
  type AdminNavItem,
  type AdminNavRole,
  type AdminNavSection,
  findAdminActiveNavItem,
  getAdminNavigationForRoles,
  getAdminPrimaryNavItems,
} from "./admin-nav-config";
import { BrandLogo } from "./app-sidebar";
import { useI18n } from "./i18n";
import { useShell } from "./shell-context";

interface MobileNavProps {
  roles?: AdminNavRole[];
  onLogout?: () => void;
}

export function MobileNav({ roles = ["chairperson"], onLogout }: MobileNavProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useShell();
  const pathname = usePathname();
  const { t } = useI18n();
  const primaryItems = getAdminPrimaryNavItems(roles);
  const allSections = getAdminNavigationForRoles(roles);
  const activeItem = findAdminActiveNavItem(pathname);

  return (
    <>
      {/* Bottom navigation bar — high-frequency destinations only (§14) */}
      <nav
        className="admin-mobile-nav fixed bottom-0 inset-x-0 z-40 border-t md:hidden"
        aria-label="Mobile navigation"
      >
        <ul className="flex items-stretch h-16 pb-[env(safe-area-inset-bottom,0px)]">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isCurrentPath =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const label = t(`nav.${item.id}`);

            return (
              <li key={item.id} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={isCurrentPath ? "page" : undefined}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 py-1.5 px-1 h-full w-full text-[11px] font-medium transition-colors select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    isCurrentPath
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Gold active indicator (§14: gold only where appropriate) */}
                  {isCurrentPath && (
                    <span
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-[hsl(var(--admin-sidebar-active))]"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-12 rounded-full transition-colors",
                      isCurrentPath ? "bg-primary/10 text-primary" : ""
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </div>
                  <span className="truncate max-w-full">{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Menu trigger for all other destinations (drawer, §15) */}
          <li className="flex-1">
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="left">
              <DrawerTrigger
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-1.5 px-1 h-full w-full text-[11px] font-medium transition-colors select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  mobileMenuOpen
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={t("shell.menu")}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen && (
                  <span
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-[hsl(var(--admin-sidebar-active))]"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-12 rounded-full transition-colors",
                    mobileMenuOpen ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
                </div>
                <span>{t("shell.menu")}</span>
              </DrawerTrigger>

              {/* Burgundy drawer — mobile equivalent of the desktop sidebar (§15) */}
              <DrawerContent className="admin-drawer max-w-xs sm:max-w-sm">
                <DrawerHeader className="admin-drawer-border-b border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <BrandLogo className="h-9 w-9 text-xs" iconSize="h-4 w-4" />
                      <div className="text-left">
                        <DrawerTitle className="text-sm font-semibold text-white leading-tight">
                          Hitsanat Kifl
                        </DrawerTitle>
                        <p className="text-[11px] text-white/70 leading-tight">
                          Children&apos;s Ministry
                        </p>
                      </div>
                    </div>
                    <DrawerClose
                      className="min-h-[44px] min-w-[44px] rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 flex items-center justify-center"
                      aria-label="Close navigation drawer"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </DrawerClose>
                  </div>
                </DrawerHeader>

                <ScrollArea className="flex-1 py-2">
                  <nav aria-label="Full mobile navigation">
                    {allSections.map((section) => (
                      <MobileNavSection
                        key={section.id}
                        section={section}
                        activeItem={activeItem}
                        pathname={pathname}
                        t={t}
                        onNavigate={() => setMobileMenuOpen(false)}
                      />
                    ))}
                  </nav>
                </ScrollArea>

                {/* Drawer footer: Settings / Language / Sign out (§15) */}
                <div className="admin-drawer-border-b border-t px-3 py-2 space-y-1">
                  <DrawerFooterLink href="/settings" onNavigate={() => setMobileMenuOpen(false)}>
                    <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t("user.settings")}
                  </DrawerFooterLink>
                  <DrawerFooterButton onClick={() => setMobileMenuOpen(false)}>
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t("user.logout")}
                  </DrawerFooterButton>
                </div>
              </DrawerContent>
            </Drawer>
          </li>
        </ul>
      </nav>
    </>
  );
}

function DrawerFooterLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}

function DrawerFooterButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

function MobileNavSection({
  section,
  activeItem,
  pathname,
  t,
  onNavigate,
}: {
  section: AdminNavSection;
  activeItem?: AdminNavItem;
  pathname: string;
  t: (key: string) => string;
  onNavigate: () => void;
}) {
  return (
    <div className="px-3 py-1.5">
      <p className="px-3 py-1 text-[11px] font-semibold text-white/70 uppercase tracking-wider">
        {t(`nav.${section.id}`)}
      </p>
      <ul className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isCurrentPath =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isItemActive = isCurrentPath || activeItem?.id === item.id;
          const label = t(`nav.${item.id}`);

          return (
            <li key={item.id}>
              <Link
                href={item.disabled ? "#" : item.href}
                aria-current={isCurrentPath ? "page" : undefined}
                aria-disabled={item.disabled}
                tabIndex={item.disabled ? -1 : undefined}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2",
                  isItemActive
                    ? "bg-[hsl(var(--admin-sidebar-active))] text-[hsl(var(--admin-sidebar-active-text))] font-semibold hover:bg-[hsl(var(--admin-sidebar-active))]/90"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isItemActive ? "text-[hsl(var(--admin-sidebar-active-text))]" : "text-white/70"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full",
                      isItemActive
                        ? "bg-[hsl(var(--admin-sidebar-active-text))]/15 text-[hsl(var(--admin-sidebar-active-text))]"
                        : "bg-white/10 text-white/70"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
