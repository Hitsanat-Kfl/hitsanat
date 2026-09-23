"use client";

import { Badge, Button, Card, CardContent, CardHeader } from "@repo/ui";
import Link from "next/link";
import { usePlans } from "@/features/planning";
import { AlertBanner, PageEmpty, PageLoading, PageShell } from "@/widgets/shell";

export default function PlanningListPage() {
  const { plans, loading, error, refresh } = usePlans();

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Planning" }]}
      title="Annual Master Plans"
      description="View and manage annual master plans with weight calculations."
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        {error && <AlertBanner message={error} />}

        {loading ? (
          <PageLoading />
        ) : plans.length === 0 ? (
          <PageEmpty
            title="No plans found"
            description="No annual master plans have been created yet."
          />
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Link key={plan.id} href={`/planning/${plan.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{plan.title}</h3>
                        <p className="text-sm text-muted-foreground">{plan.academicYear}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            plan.status === "Active"
                              ? "default"
                              : plan.status === "Completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {plan.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{plan.totalBudget.toLocaleString()} ETB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">People</p>
                        <p className="font-medium">{plan.totalPeople}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-medium">{plan.totalTime}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
