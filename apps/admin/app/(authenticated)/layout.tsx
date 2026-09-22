"use client";

import { useRouter } from "next/navigation";
import type * as React from "react";
import { RouteGuard, useAuthUser } from "@/features/auth";
import { AppShell, mapSessionRolesToAdminNavRoles } from "@/features/shell";
import { createClient } from "@/lib/supabase/client";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthUser();
  const roles = mapSessionRolesToAdminNavRoles(user?.globalRoles ?? []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AppShell
      roles={roles.length > 0 ? roles : ["chairperson"]}
      userName={user?.name}
      userEmail={user?.email}
      userRole={user?.role}
      onLogout={handleLogout}
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
