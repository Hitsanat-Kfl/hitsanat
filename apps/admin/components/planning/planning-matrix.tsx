"use client";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { useMemo } from "react";
import type { PlanActivity, PlanGoal, PlanWithGoals } from "../../lib/types";

interface PlanningMatrixProps {
  plan: PlanWithGoals;
}

interface ActivityRow {
  goalNumber: number;
  goalTitle: string;
  activityNumber: number;
  mainActivity: string;
  annualTarget: number;
  budget: number;
  humanResource: number;
  plannedTime: number;
  weight: number;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
}

export function PlanningMatrix({ plan }: PlanningMatrixProps) {
  const rows = useMemo(() => {
    const result: ActivityRow[] = [];
    for (const goal of plan.goals) {
      for (const activity of goal.activities) {
        result.push({
          goalNumber: goal.goalNumber,
          goalTitle: goal.title,
          activityNumber: activity.activityNumber,
          mainActivity: activity.mainActivity,
          annualTarget: activity.annualTarget,
          budget: activity.budget,
          humanResource: activity.humanResource,
          plannedTime: activity.plannedTime,
          weight: activity.weight,
          q1Target: activity.q1Target,
          q2Target: activity.q2Target,
          q3Target: activity.q3Target,
          q4Target: activity.q4Target,
        });
      }
    }
    return result;
  }, [plan]);

  const totalWeight = useMemo(() => rows.reduce((sum, r) => sum + r.weight, 0), [rows]);
  const totalBudget = useMemo(() => rows.reduce((sum, r) => sum + r.budget, 0), [rows]);
  const totalPeople = useMemo(() => rows.reduce((sum, r) => sum + r.humanResource, 0), [rows]);
  const totalTime = useMemo(() => rows.reduce((sum, r) => sum + r.plannedTime, 0), [rows]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.academicYear}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={plan.status === "Active" ? "default" : "secondary"}>
              {plan.status}
            </Badge>
            <span className="text-sm font-medium">Weight: {totalWeight.toFixed(2)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead className="min-w-[200px]">Activity</TableHead>
                <TableHead className="text-right min-w-[80px]">Budget</TableHead>
                <TableHead className="text-right min-w-[80px]">People</TableHead>
                <TableHead className="text-right min-w-[80px]">Time</TableHead>
                <TableHead className="min-w-[120px]">Weight</TableHead>
                <TableHead className="text-right min-w-[60px]">Q1</TableHead>
                <TableHead className="text-right min-w-[60px]">Q2</TableHead>
                <TableHead className="text-right min-w-[60px]">Q3</TableHead>
                <TableHead className="text-right min-w-[60px]">Q4</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={`${row.goalNumber}-${row.activityNumber}`}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{row.mainActivity}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Goal {row.goalNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.budget.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.humanResource}</TableCell>
                  <TableCell className="text-right">{row.plannedTime}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={row.weight} max={100} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-12 text-right">
                        {row.weight.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.q1Target}</TableCell>
                  <TableCell className="text-right">{row.q2Target}</TableCell>
                  <TableCell className="text-right">{row.q3Target}</TableCell>
                  <TableCell className="text-right">{row.q4Target}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold border-t-2">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{totalBudget.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totalPeople}</TableCell>
                <TableCell className="text-right">{totalTime}h</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={totalWeight}
                      max={100}
                      className={`h-2 flex-1 ${Math.abs(totalWeight - 100) < 0.01 ? "text-green-500" : "text-red-500"}`}
                    />
                    <span
                      className={`text-xs font-medium w-12 text-right ${Math.abs(totalWeight - 100) < 0.01 ? "text-green-600" : "text-red-600"}`}
                    >
                      {totalWeight.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {rows.reduce((s, r) => s + r.q1Target, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {rows.reduce((s, r) => s + r.q2Target, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {rows.reduce((s, r) => s + r.q3Target, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {rows.reduce((s, r) => s + r.q4Target, 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
