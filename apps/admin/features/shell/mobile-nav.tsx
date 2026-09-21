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
import { Church, Menu, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BrandLogo } from "./app-sidebar";
import { useI18n } from "./i18n";
import {
  type NavItem,
  type NavSection,
  type UserRole,
  findActiveNavItem,
  getNavigationForRoles,
  getPrimaryNavItems,
} from "./nav-config";
import { useShell } from "./shell-context";

interface MobileNavProps {
  roles?: UserRole[];
}

export function MobileNav({ roles = ["chairperson"] }: MobileNavProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useShell();
  const pathname = usePathname();
  const { t } = useI18n();
  const primaryItems = getPrimaryNavItems(roles);
  const allSections = getNavigationForRoles(roles);
  const activeItem = findActiveNavItem(pathname);

  return (
    <>
      {/* Bottom navigation bar — primary items + More drawer trigger */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 border-t admin-mobile-nav md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
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
                    "flex flex-col items-center justify-center gap-1 py-1.5 px-1 h-full w-full text-[11px] font-medium transition-colors select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isCurrentPath
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-12 rounded-full transition-colors",
                      isCurrentPath ? "bg-[#E5AE60]/25 text-[#32131F] dark:text-[#E5AE60]" : ""
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </div>
                  <span className="truncate max-w-full">{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Menu trigger for all other items */}
          <li className="flex-1">
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="left">
              <DrawerTrigger
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1.5 px-1 h-full w-full text-[11px] font-medium transition-colors select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  mobileMenuOpen
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={t("shell.menu")}
                aria-expanded={mobileMenuOpen}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-12 rounded-full transition-colors",
                    mobileMenuOpen ? "bg-[#E5AE60]/25 text-[#32131F] dark:text-[#E5AE60]" : ""
                  )}
                >
                  <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
                </div>
                <span>{t("shell.menu")}</span>
              </DrawerTrigger>

              <DrawerContent className="max-w-xs sm:max-w-sm">
                <DrawerHeader className="border-b admin-sidebar-border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <BrandLogo className="h-9 w-9 text-xs" iconSize="h-4 w-4" />
                      <div className="text-left">
                        <DrawerTitle className="text-sm font-semibold text-foreground leading-tight">
                          Hitsanat Kifl
                        </DrawerTitle>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          Children&apos;s Ministry
                        </p>
                      </div>
                    </div>
                    <DrawerClose
                      className="min-h-[44px] min-w-[44px] rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center"
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
              </DrawerContent>
            </Drawer>
          </li>
        </ul>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}

function MobileNavSection({
  section,
  activeItem,
  pathname,
  t,
  onNavigate,
}: {
  section: NavSection;
  activeItem?: NavItem;
  pathname: string;
  t: (key: string) => string;
  onNavigate: () => void;
}) {
  return (
    <div className="px-3 py-1.5">
      <p className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {t(`nav.${section.id}`)}
      </p>
      <ul className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isCurrentPath =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isCurrentPath
                    ? "bg-[#E5AE60] text-[#32131F] font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isCurrentPath ? "text-[#32131F]" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full",
                      isCurrentPath
                        ? "bg-[#32131F]/15 text-[#32131F]"
                        : "bg-muted text-muted-foreground"
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
