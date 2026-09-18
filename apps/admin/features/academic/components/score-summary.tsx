"use client";

import { Card, CardContent, CardHeader } from "@repo/ui";
import type { StudentScore } from "@/lib/types";

interface ScoreSummaryProps {
  scores: StudentScore[];
  maxScore: number;
}

export function ScoreSummary({ scores, maxScore }: ScoreSummaryProps) {
  if (scores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No scores recorded yet</p>
      </div>
    );
  }

  const totalScore = scores.reduce((sum, s) => sum + Number(s.scoreAchieved), 0);
  const avgScore = totalScore / scores.length;
  const maxAchieved = Math.max(...scores.map((s) => Number(s.scoreAchieved)));
  const minAchieved = Math.min(...scores.map((s) => Number(s.scoreAchieved)));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Total Students</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{scores.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Average Score</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {avgScore.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground">/{maxScore}</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Highest Score</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{maxAchieved}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm text-muted-foreground">Lowest Score</p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{minAchieved}</p>
        </CardContent>
      </Card>
    </div>
  );
}
