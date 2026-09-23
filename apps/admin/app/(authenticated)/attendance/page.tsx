"use client";

import { Badge, Button, Card, CardContent } from "@repo/ui";
import Link from "next/link";
import { useAttendanceSessions } from "@/features/attendance-management";
import { AlertBanner, PageEmpty, PageLoading, PageShell } from "@/widgets/shell";
import type { SessionStatus } from "@/domains/definitions";

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
      {error && <AlertBanner message={error} className="mb-4" />}

      {loading ? (
        <PageLoading />
      ) : sessions.length === 0 ? (
        <PageEmpty
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
                    <span className="text-sm font-medium text-muted-foreground">
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
                  <p className="mt-1 text-sm text-muted-foreground">{session.sessionType}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
