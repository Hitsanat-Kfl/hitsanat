"use client";

import { Button, Input, Select, Textarea } from "@repo/ui";
import { useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { PlanDistributionStatus, PlanProgressRecord } from "../../lib/types";

interface ProgressRecordingFormProps {
  weeklyPlanId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProgressRecordingForm({
  weeklyPlanId,
  onSuccess,
  onCancel,
}: ProgressRecordingFormProps) {
  const [formData, setFormData] = useState({
    actualResultNumeric: "",
    actualResultText: "",
    status: "" as PlanDistributionStatus | "",
    challenges: "",
    submittedBy: "admin",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.status) newErrors.status = "Status is required";
    if (formData.actualResultNumeric && Number(formData.actualResultNumeric) < 0) {
      newErrors.actualResultNumeric = "Must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    setSubmitError(null);

    try {
      await api.post<ApiResponse<PlanProgressRecord>>(
        `/annual-plans/weekly-plans/${weeklyPlanId}/progress`,
        {
          actualResultNumeric: formData.actualResultNumeric
            ? Number(formData.actualResultNumeric)
            : undefined,
          actualResultText: formData.actualResultText || undefined,
          status: formData.status,
          challenges: formData.challenges || undefined,
          submittedBy: formData.submittedBy,
        }
      );
      onSuccess?.();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit progress");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-accent/30">
      <h4 className="text-sm font-medium">Record Progress</h4>

      {submitError && (
        <div className="p-2 rounded bg-destructive/10 text-destructive text-xs">{submitError}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="progress-numeric" className="text-sm font-medium">
            Actual Result (Numeric)
          </label>
          <Input
            id="progress-numeric"
            type="number"
            placeholder="e.g. 85"
            value={formData.actualResultNumeric}
            onChange={(e) => setFormData({ ...formData, actualResultNumeric: e.target.value })}
          />
          {errors.actualResultNumeric && (
            <p className="text-xs text-destructive mt-1">{errors.actualResultNumeric}</p>
          )}
        </div>

        <div>
          <label htmlFor="progress-status" className="text-sm font-medium">
            Status
          </label>
          <Select
            id="progress-status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as PlanDistributionStatus })
            }
          >
            <option value="">Select status</option>
            <option value="Assigned">Assigned</option>
            <option value="In_Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          {errors.status && <p className="text-xs text-destructive mt-1">{errors.status}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="progress-text" className="text-sm font-medium">
          Actual Result (Text)
        </label>
        <Input
          id="progress-text"
          placeholder="e.g. 85% attendance achieved"
          value={formData.actualResultText}
          onChange={(e) => setFormData({ ...formData, actualResultText: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="progress-challenges" className="text-sm font-medium">
          Challenges
        </label>
        <Textarea
          id="progress-challenges"
          placeholder="Describe any challenges encountered..."
          value={formData.challenges}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Progress"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
