"use client";

import { Badge, Button, Card, CardContent, EmptyState, Spinner } from "@repo/ui";
import Link from "next/link";
import { useAttendanceSessions } from "../../../components/attendance/use-attendance";
import { PageShell } from "../../../components/shell/page-shell";
import type { SessionStatus } from "../../../lib/types";

const statusVariant: Record<SessionStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Scheduled: "outline",
  In_Progress: "default",
  Completed: "secondary",
  Cancelled: "destructive",
};

export default function AttendancePage() {
  const { sessions, loading, error, refresh } = useAttendanceSessions();

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Attendance" }]}
      title="Attendance Checksheets"
      description="Manage attendance sessions and checksheets."
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No sessions found"
          description="No attendance sessions have been created yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Link key={session.id} href={`/attendance/${session.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(session.sessionDate).toLocaleDateString("en-ET", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Badge variant={statusVariant[session.status] ?? "outline"}>
                      {session.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{session.topic || session.sessionType}</h3>
                  <p className="mt-1 text-sm text-gray-500">{session.sessionType}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
