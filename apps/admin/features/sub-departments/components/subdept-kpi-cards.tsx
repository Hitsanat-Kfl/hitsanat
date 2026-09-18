"use client";

import { Card, CardContent, CardHeader } from "@repo/ui";

interface SubDeptKpiCardsProps {
  memberCount: number;
  childCount: number;
  attendanceRate: number;
}

export function SubDeptKpiCards({ memberCount, childCount, attendanceRate }: SubDeptKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Members</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{memberCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Children</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{childCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Attendance Rate</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
