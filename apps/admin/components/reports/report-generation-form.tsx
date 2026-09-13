"use client";

import { Button, Card, CardContent, CardHeader, Input, Label, Select, Textarea } from "@repo/ui";
import { useState } from "react";
import type { ReportType } from "../../lib/types";
import { generateReport } from "./use-reports";

interface ReportGenerationFormProps {
  onGenerated: () => void;
}

export function ReportGenerationForm({ onGenerated }: ReportGenerationFormProps) {
  const [reportType, setReportType] = useState<ReportType>("Monthly");
  const [periodLabel, setPeriodLabel] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await generateReport({
        reportType,
        periodLabel,
        periodStart,
        periodEnd,
      });
      onGenerated();
      setPeriodLabel("");
      setPeriodStart("");
      setPeriodEnd("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Generate Report</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half_Year">Half Year</option>
                <option value="Annual">Annual</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="periodLabel">Period Label</Label>
              <Input
                id="periodLabel"
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                placeholder="e.g. September 2026"
                required
              />
            </div>
            <div>
              <Label htmlFor="periodStart">Period Start</Label>
              <Input
                id="periodStart"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="periodEnd">Period End</Label>
              <Input
                id="periodEnd"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
