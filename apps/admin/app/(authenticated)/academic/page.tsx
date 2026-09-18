"use client";

import { AssessmentList } from "@/features/academic";
import { useAssessments } from "@/features/academic";
import { PageShell } from "@/features/shell";

export default function AcademicPage() {
  const { assessments, loading, error } = useAssessments();

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academic" }]}
      title="Academic Assessments"
      description="Manage Timihrt assessments and student scores."
    >
      <div className="space-y-6">
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}
        <AssessmentList assessments={assessments} loading={loading} />
      </div>
    </PageShell>
  );
}
