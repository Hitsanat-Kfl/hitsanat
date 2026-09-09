"use client";

import type * as React from "react";
import { AppShell } from "../../components/shell/app-shell";
import { RouteGuard } from "../../components/auth/RouteGuard";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <RouteGuard>
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
