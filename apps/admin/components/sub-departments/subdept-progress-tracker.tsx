"use client";

import { Badge, Card, CardContent, CardHeader } from "@repo/ui";
import type { ProgressSummaryItem } from "../../lib/types";

interface SubDeptProgressTrackerProps {
  items: ProgressSummaryItem[];
}

export function SubDeptProgressTracker({ items }: SubDeptProgressTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Plan Progress</h3>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No progress data available</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.activityId}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.mainActivity}</p>
                  <p className="text-sm text-muted-foreground">
                    Goal {item.goalNumber} · Weight: {item.weight}%
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium">{item.progressCount} records</span>
                  <Badge variant={item.latestStatus === "Completed" ? "default" : "secondary"}>
                    {item.latestStatus || "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
