"use client";

import { Badge, Card, CardContent, CardHeader } from "@repo/ui";
import type { DistributionStatusItem } from "../../lib/types";

interface DistributionStatusCardProps {
  distributions: DistributionStatusItem[];
}

export function DistributionStatusCard({ distributions }: DistributionStatusCardProps) {
  if (distributions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No distributions found</p>
        </CardContent>
      </Card>
    );
  }

  const statusCounts = distributions.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Distribution Status</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{distributions.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{statusCounts.Completed || 0}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{statusCounts.In_Progress || 0}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>

        <div className="space-y-2">
          {distributions.map((d) => (
            <div
              key={d.distributionId}
              className="flex items-center justify-between p-2 rounded border"
            >
              <div>
                <span className="text-sm font-medium">{d.activityMainActivity}</span>
                <span className="ml-2 text-xs text-muted-foreground">→ {d.subDepartmentId}</span>
              </div>
              <Badge
                variant={
                  d.status === "Completed"
                    ? "default"
                    : d.status === "In_Progress"
                      ? "secondary"
                      : "outline"
                }
              >
                {d.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
