"use client";

import { cn } from "@repo/ui/lib/utils";
import type * as React from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { GlobalSearch } from "./global-search";
import { I18nProvider } from "./i18n";
import { MobileNav } from "./mobile-nav";
import type { UserRole } from "./nav-config";
import { ShellProvider } from "./shell-context";

interface AppShellProps {
  children: React.ReactNode;
  roles?: UserRole[];
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
        <div className={cn("flex h-screen overflow-hidden bg-background", className)}>
          {/* Desktop sidebar */}
          <AppSidebar roles={roles} />

          {/* Main area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader
              userName={userName}
              userEmail={userEmail}
              userRole={userRole}
              userAvatarSrc={userAvatarSrc}
              onLogout={onLogout}
            />

            <main className="flex-1 overflow-auto">{children}</main>
          </div>

          {/* Mobile bottom nav */}
          <MobileNav roles={roles} />

          {/* Global search overlay */}
          <GlobalSearch />
        </div>
      </ShellProvider>
    </I18nProvider>
  );
}
