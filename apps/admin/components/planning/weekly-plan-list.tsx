"use client";

import { Badge, Card, CardContent, CardHeader, Spinner } from "@repo/ui";
import type { PlanProgressRecord, WeeklyPlan } from "../../lib/types";

interface WeeklyPlanWithProgress extends WeeklyPlan {
  progress?: PlanProgressRecord;
}

interface WeeklyPlanListProps {
  weeklyPlans: WeeklyPlanWithProgress[];
  loading?: boolean;
}

export function WeeklyPlanList({ weeklyPlans, loading }: WeeklyPlanListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {["sk-1", "sk-2", "sk-3"].map((k) => (
          <div key={k} className="p-4 rounded-lg border animate-pulse">
            <div className="h-4 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-48 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (weeklyPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No weekly plans found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {weeklyPlans.map((wp) => (
        <Card key={wp.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {wp.ethiopianMonth} - Week {wp.weekNumber}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(wp.sessionDate).toLocaleDateString()}
                </p>
              </div>
              {wp.progress && (
                <Badge
                  variant={
                    wp.progress.status === "Completed"
                      ? "default"
                      : wp.progress.status === "In_Progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {wp.progress.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{wp.taskDescription}</p>
            {wp.progress && (
              <div className="mt-2 text-xs text-muted-foreground">
                {wp.progress.actualResultText && <p>Result: {wp.progress.actualResultText}</p>}
                {wp.progress.challenges && <p>Challenges: {wp.progress.challenges}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
