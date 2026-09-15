"use client";

import { Card, CardContent, CardHeader } from "@repo/ui";

interface SubDeptAttendanceSummaryProps {
  attendanceRate: number;
}

export function SubDeptAttendanceSummary({ attendanceRate }: SubDeptAttendanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Attendance Summary</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(attendanceRate, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">{attendanceRate.toFixed(1)}%</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Overall attendance rate for this department
        </p>
      </CardContent>
    </Card>
  );
}
