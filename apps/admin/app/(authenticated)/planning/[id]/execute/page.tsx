"use client";

import { Button, Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { DistributionStatusCard } from "../../../../../components/planning/distribution-status-card";
import { ProgressRecordingForm } from "../../../../../components/planning/progress-recording-form";
import { useDistributionStatus } from "../../../../../components/planning/use-distribution-status";
import { usePlanDetail } from "../../../../../components/planning/use-plan-detail";
import { WeeklyPlanList } from "../../../../../components/planning/weekly-plan-list";
import { PageShell } from "../../../../../components/shell/page-shell";

export default function PlanExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const { plan, loading: planLoading, error: planError } = usePlanDetail(planId);
  const { distributions, loading: distLoading } = useDistributionStatus(planId);

  if (planLoading || distLoading) {
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

  if (planError || !plan) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Planning", href: "/planning" },
          { label: "Error" },
        ]}
      >
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{planError || "Plan not found"}</p>
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
        { label: plan.title, href: `/planning/${planId}` },
        { label: "Execute" },
      ]}
      title={`Execute: ${plan.title}`}
      description={`${plan.academicYear} — Sub-department plan execution`}
      actions={
        <Button variant="outline" onClick={() => router.push(`/planning/${planId}`)}>
          Back to Matrix
        </Button>
      }
    >
      <Tabs defaultValue="distributions">
        <TabsList>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="progress">Record Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="distributions" className="mt-6">
          <DistributionStatusCard distributions={distributions} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="space-y-6">
            {distributions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No distributions available. Distribute activities first.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {distributions.map((d) => (
                  <div key={d.distributionId} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{d.activityMainActivity}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Distributed to: {d.subDepartmentId}
                    </p>
                    <ProgressRecordingForm
                      weeklyPlanId={d.distributionId}
                      onSuccess={() => window.location.reload()}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
