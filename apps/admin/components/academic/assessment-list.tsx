"use client";

import { Badge, Card, CardContent } from "@repo/ui";
import Link from "next/link";
import type { Assessment } from "../../lib/types";

const ASSESSMENT_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  Mid_Exam: "secondary",
  Final_Exam: "default",
  Assignment: "outline",
};

interface AssessmentListProps {
  assessments: Assessment[];
  loading?: boolean;
}

export function AssessmentList({ assessments, loading }: AssessmentListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {["sk-1", "sk-2"].map((k) => (
          <div key={k} className="p-4 rounded-lg border animate-pulse">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No assessments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assessments.map((assessment) => (
        <Link key={assessment.id} href={`/academic/${assessment.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{assessment.subjectTopic}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Max Score: {assessment.maxScore} · Period: {assessment.academicPeriod}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assessment.examDate).toLocaleDateString("en-ET", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={ASSESSMENT_BADGE[assessment.assessmentType] || "secondary"}>
                  {assessment.assessmentType.replace("_", " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
