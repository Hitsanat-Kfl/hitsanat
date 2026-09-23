"use client";

import { DashboardRouter } from "@/widgets/dashboard";
import { PageShell } from "@/widgets/shell";

export default function HomePage() {
  return (
    <PageShell>
      <DashboardRouter />
    </PageShell>
  );
}
