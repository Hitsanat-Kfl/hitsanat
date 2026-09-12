"use client";

import { Badge, Button, Card, CardContent, CardHeader, Spinner } from "@repo/ui";
import Link from "next/link";
import { usePlans } from "../../../components/planning/use-plans";
import { PageShell } from "../../../components/shell/page-shell";

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
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plans found</p>
          </div>
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
