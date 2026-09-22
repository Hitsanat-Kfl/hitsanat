"use client";

import { DashboardLocaleProvider } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import type * as React from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { GlobalSearch } from "./global-search";
import { I18nProvider, useI18n } from "./i18n";
import { MobileNav } from "./mobile-nav";
import type { AdminNavRole } from "./admin-nav-config";
import { ShellProvider } from "./shell-context";

/**
 * Bridges the shell's locale state into the dashboard widgets so their
 * titleAm/labelAm prop variants render when the user switches to Amharic.
 */
function DashboardLocaleBridge({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();
  return <DashboardLocaleProvider locale={locale}>{children}</DashboardLocaleProvider>;
}

export interface MainContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className, ...props }: MainContentProps) {
  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden focus:outline-none",
        "px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-4",
        className
      )}
      tabIndex={-1}
      {...props}
    >
      {children}
    </main>
  );
}

export interface AppShellProps {
  children: React.ReactNode;
  roles?: AdminNavRole[];
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userAvatarSrc?: string;
  onLogout?: () => void;
  className?: string;
}

export function AppShell({
  children,
  roles = ["chairperson"],
  userName,
  userEmail,
  userRole,
  userAvatarSrc,
  onLogout,
  className,
}: AppShellProps) {
  return (
    <I18nProvider>
      <ShellProvider>
        <DashboardLocaleBridge>
          <div className={cn("flex h-screen w-full overflow-hidden bg-background", className)}>
            {/* Desktop Sidebar */}
            <AppSidebar roles={roles} />

            {/* Main Area: Header + Scrollable Content */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
              <AppHeader
                userName={userName}
                userEmail={userEmail}
                userRole={userRole}
                userAvatarSrc={userAvatarSrc}
                onLogout={onLogout}
              />

              <MainContent>{children}</MainContent>
            </div>

            {/* Mobile Bottom Navigation & Drawer */}
            <MobileNav roles={roles} />

            {/* Global Search / Overlays */}
            <GlobalSearch />
          </div>
        </DashboardLocaleBridge>
      </ShellProvider>
    </I18nProvider>
  );
}

export const AuthenticatedLayout = AppShell;
