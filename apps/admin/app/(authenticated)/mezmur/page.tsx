"use client";

import { MezmurDashboardPage } from "@/widgets/dashboard";
import { PageShell } from "@/widgets/shell";

export default function MezmurPage() {
  return (
    <PageShell>
      <MezmurDashboardPage />
    </PageShell>
  );
}
