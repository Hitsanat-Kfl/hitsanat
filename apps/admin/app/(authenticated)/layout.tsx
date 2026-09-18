"use client";

import type * as React from "react";
import { RouteGuard } from "@/features/auth/route-guard";
import { AppShell } from "@/features/shell";

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
