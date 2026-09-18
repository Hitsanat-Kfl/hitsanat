"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import { useState } from "react";
import { ReportGenerationForm } from "@/features/reports";
import { useReports } from "@/features/reports";
import { PageShell } from "@/features/shell";
import type { ReportStatus, SubmissionStatus } from "../../../lib/types";

const reportStatusVariant: Record<
  ReportStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Draft: "outline",
  Submitted: "default",
  Reviewed: "secondary",
  Approved: "default",
};

const submissionStatusVariant: Record<
  SubmissionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Submitted: "outline",
  Under_Review: "default",
  Accepted: "default",
  Returned: "destructive",
};

export default function ReportsPage() {
  const { reports, submissions, loading, error, refresh } = useReports();
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }]}
      title="Reports"
      description="Generate, submit, and review periodic reports."
      actions={
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={() => setShowGenerateForm(!showGenerateForm)} size="sm">
            {showGenerateForm ? "Cancel" : "Generate Report"}
          </Button>
        </div>
      }
    >
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {showGenerateForm && (
        <div className="mb-6">
          <ReportGenerationForm
            onGenerated={() => {
              refresh();
              setShowGenerateForm(false);
            }}
          />
        </div>
      )}

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState title="No reports" description="No reports have been generated yet." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline">{report.reportType}</Badge>
                      <Badge variant={reportStatusVariant[report.status]}>{report.status}</Badge>
                    </div>
                    <h3 className="font-semibold">{report.periodLabel}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(report.periodStart).toLocaleDateString("en-ET")} —{" "}
                      {new Date(report.periodEnd).toLocaleDateString("en-ET")}
                    </p>
                    {report.challenges && (
                      <p className="mt-2 text-sm text-orange-600 line-clamp-2">
                        {report.challenges}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              title="No submissions"
              description="No report submissions have been received yet."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {submissions.map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline">{sub.reportType}</Badge>
                      <Badge variant={submissionStatusVariant[sub.status]}>
                        {sub.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{sub.periodLabel}</h3>
                    <p className="mt-1 text-sm text-gray-500">Sub-dept: {sub.subDepartmentId}</p>
                    {sub.reviewedBy && (
                      <p className="mt-1 text-xs text-gray-400">Reviewed by: {sub.reviewedBy}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
