"use client";

import { DashboardRouter } from "@/features/dashboard";
import { PageShell } from "@/features/shell";

export default function HomePage() {
  return (
    <PageShell>
      <DashboardRouter />
    </PageShell>
  );
}
