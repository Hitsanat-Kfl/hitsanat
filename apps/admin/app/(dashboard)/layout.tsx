"use client";

import type * as React from "react";
import { RouteGuard } from "../../components/auth/RouteGuard";
import { AppShell } from "../../components/shell/app-shell";

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
