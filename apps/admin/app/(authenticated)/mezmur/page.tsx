"use client";

import { MezmurDashboardPage } from "@/features/dashboard";
import { PageShell } from "@/features/shell";

export default function MezmurPage() {
  return (
    <PageShell>
      <MezmurDashboardPage />
    </PageShell>
  );
}
