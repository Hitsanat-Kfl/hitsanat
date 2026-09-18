"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Spinner } from "@repo/ui";
import { Checksheet } from "@/features/attendance";
import { useSessionDetail } from "@/features/attendance";
import { PageShell } from "@/features/shell";

export default function AttendanceSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const { session, records, loading, error, refresh } = useSessionDetail(sessionId);

  if (loading) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Attendance", href: "/attendance" },
          { label: "Session" },
        ]}
        title="Loading..."
      >
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  if (error || !session) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Attendance", href: "/attendance" },
          { label: "Session" },
        ]}
        title="Error"
      >
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error || "Session not found"}</div>
        <Link href="/attendance" className="mt-4">
          <Button variant="outline">Back to Sessions</Button>
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Attendance", href: "/attendance" },
        { label: session.topic || session.sessionType },
      ]}
      title={session.topic || session.sessionType}
      description={`${session.sessionType} — ${new Date(session.sessionDate).toLocaleDateString(
        "en-ET",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}`}
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      <Checksheet records={records} sessionId={sessionId} onSaved={refresh} />
    </PageShell>
  );
}
