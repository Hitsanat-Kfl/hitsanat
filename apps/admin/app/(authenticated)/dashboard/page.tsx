"use client";

import { Badge, Button, Card, CardContent, CardHeader, Spinner } from "@repo/ui";
import Link from "next/link";
import { useDashboard } from "../../../components/dashboard/use-dashboard";
import { PageShell } from "../../../components/shell/page-shell";

export default function ExecutiveDashboardPage() {
  const { stats, recentEvents, recentAnnouncements, recentReports, loading, error, refresh } =
    useDashboard();

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      title="Executive Dashboard"
      description="Overview of ministry performance and key metrics."
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
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Active Members</p>
                <p className="text-2xl font-bold">{stats?.activeMembers ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Enrolled Children</p>
                <p className="text-2xl font-bold">{stats?.enrolledChildren ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Completed Events</p>
                <p className="text-2xl font-bold">{stats?.completedEvents ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Reports Generated</p>
                <p className="text-2xl font-bold">{recentReports.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Announcements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Announcements</h3>
                <Link href="/announcements">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentAnnouncements.length === 0 ? (
                  <p className="text-sm text-gray-500">No announcements yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentAnnouncements.map((ann) => (
                      <div key={ann.id} className="border-b pb-2 last:border-0">
                        <h4 className="font-medium">{ann.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2">{ann.content}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline">{ann.targetAudience}</Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(ann.createdAt).toLocaleDateString("en-ET")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Reports</h3>
                <Link href="/reports">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentReports.length === 0 ? (
                  <p className="text-sm text-gray-500">No reports generated yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div key={report.id} className="border-b pb-2 last:border-0">
                        <h4 className="font-medium">{report.periodLabel}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{report.reportType}</Badge>
                          <Badge variant={report.status === "Approved" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <Link href="/events">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming events.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="rounded-md border p-3">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.venue}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(event.eventDate).toLocaleDateString("en-ET", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  );
}
