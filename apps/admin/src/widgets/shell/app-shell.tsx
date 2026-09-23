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
        // Reference geometry §7/§28: ~20px content gutters at desktop, 16px
        // on mobile, fluid width (no centered max-w container). pb-20 clears
        // the fixed mobile bottom nav (h-16).
        "px-4 py-4 md:px-5 md:py-5 pb-20 md:pb-5",
        className
      )}
      tabIndex={-1}
      {...props}
    >
      <div className="w-full max-w-none">{children}</div>
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
            {/* Mobile Bottom Navigation & Drawer (fixed overlays — keep out of
                the flex row so they never become phantom flex children) */}
            <MobileNav roles={roles} onLogout={onLogout} />

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

            {/* Global Search / Overlays */}
            <GlobalSearch />
          </div>
        </DashboardLocaleBridge>
      </ShellProvider>
    </I18nProvider>
  );
}

export const AuthenticatedLayout = AppShell;
