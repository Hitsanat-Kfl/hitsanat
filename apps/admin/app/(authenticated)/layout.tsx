"use client";

import type * as React from "react";
import { RouteGuard, useAuthUser } from "@/features/auth";
import { AppShell, mapSessionRolesToNavRoles } from "@/features/shell";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();
  const roles = mapSessionRolesToNavRoles(user?.globalRoles ?? []);

  return (
    <AppShell
      roles={roles.length > 0 ? roles : ["chairperson"]}
      userName={user?.name}
      userEmail={user?.email}
      userRole={user?.role}
    >
      {children}
    </AppShell>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RouteGuard>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </RouteGuard>
  );
}
