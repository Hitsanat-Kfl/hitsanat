"use client";

import { Spinner } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { ScoreEntryForm } from "@/features/academic";
import { ScoreSummary } from "@/features/academic";
import { useScores } from "@/features/academic";
import { PageShell } from "@/widgets/shell";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  const { scores, loading, error, refresh } = useScores(assessmentId);

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Academic", href: "/academic" },
        { label: "Assessment Detail" },
      ]}
      title="Assessment Detail"
      description="View scores and record new entries."
      actions={
        <button
          type="button"
          onClick={() => router.push("/academic")}
          className="text-sm text-primary hover:underline"
        >
          Back to Assessments
        </button>
      }
    >
      <div className="space-y-6">
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <ScoreSummary scores={scores} maxScore={100} />
            <ScoreEntryForm
              assessmentId={assessmentId}
              maxScore={100}
              onSuccess={() => refresh()}
            />
          </>
        )}
      </div>
    </PageShell>
  );
}
