"use client";

import { SecretaryDashboardPage } from "@/widgets/dashboard";
import { PageShell } from "@/widgets/shell";

export default function SecretaryPage() {
  return (
    <PageShell>
      <SecretaryDashboardPage />
    </PageShell>
  );
}
