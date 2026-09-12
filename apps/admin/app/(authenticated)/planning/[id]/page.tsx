"use client";

import { Button, Spinner } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { PlanningMatrix } from "../../../../components/planning/planning-matrix";
import { usePlanDetail } from "../../../../components/planning/use-plan-detail";
import { PageShell } from "../../../../components/shell/page-shell";

export default function PlanningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const { plan, loading, error } = usePlanDetail(planId);

  if (loading) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Planning", href: "/planning" },
          { label: "Loading..." },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  if (error || !plan) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Planning", href: "/planning" },
          { label: "Error" },
        ]}
      >
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || "Plan not found"}</p>
          <Button variant="outline" onClick={() => router.push("/planning")}>
            Back to Plans
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Planning", href: "/planning" },
        { label: plan.title },
      ]}
      title={plan.title}
      description={`${plan.academicYear} — ${plan.status}`}
      actions={
        <Button variant="outline" onClick={() => router.push("/planning")}>
          Back to Plans
        </Button>
      }
    >
      <PlanningMatrix plan={plan} />
    </PageShell>
  );
}
