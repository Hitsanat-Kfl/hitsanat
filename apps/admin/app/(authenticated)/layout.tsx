"use client";

import type * as React from "react";
import { RouteGuard } from "../../components/auth/RouteGuard";
import { AppShell } from "../../components/shell/app-shell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RouteGuard>
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
