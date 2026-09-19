"use client";

import { SecretaryDashboardPage } from "@/features/dashboard";
import { PageShell } from "@/features/shell";

export default function SecretaryPage() {
  return (
    <PageShell>
      <SecretaryDashboardPage />
    </PageShell>
  );
}
