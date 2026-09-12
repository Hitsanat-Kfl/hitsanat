"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { Menu, X } from "lucide-react";
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
      {/* Bottom navigation bar — primary items only */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card md:hidden"
        aria-label="Mobile navigation"
      >
        <ul className="flex items-stretch">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isCurrentPath = pathname === item.href;
            const label = t(`nav.${item.id}`);

            return (
              <li key={item.id} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={isCurrentPath ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 px-1 min-h-[56px] text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isCurrentPath ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
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
                  "flex flex-col items-center justify-center gap-1 py-2 px-1 min-h-[56px] w-full text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  mobileMenuOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={t("shell.menu")}
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span>{t("shell.menu")}</span>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <DrawerTitle>{t("shell.menu")}</DrawerTitle>
                    <DrawerClose
                      className="min-h-[44px] min-w-[44px] rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="Close menu"
                    >
                      <X className="h-4 w-4" />
                    </DrawerClose>
                  </div>
                </DrawerHeader>

                <ScrollArea className="flex-1 py-2">
                  <nav aria-label="Full navigation">
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
      <div className="h-14 md:hidden" />
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
    <div className="px-4 py-2">
      <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {t(`nav.${section.id}`)}
      </p>
      <ul className="space-y-0.5">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isCurrentPath = pathname === item.href;
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
                  isCurrentPath && "bg-primary/10 text-primary font-semibold",
                  !isCurrentPath &&
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon
                  className={cn("h-4 w-4 shrink-0", isCurrentPath && "text-primary")}
                  aria-hidden="true"
                />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
