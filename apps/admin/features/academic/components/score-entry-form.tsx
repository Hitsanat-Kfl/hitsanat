"use client";

import { Button, Input } from "@repo/ui";
import { useState } from "react";
import { type ApiResponse, api } from "@/lib/api-client";
import type { StudentScore } from "@/lib/types";

interface ScoreEntryFormProps {
  assessmentId: string;
  maxScore: number;
  onSuccess?: (score: StudentScore) => void;
  onCancel?: () => void;
}

export function ScoreEntryForm({
  assessmentId,
  maxScore,
  onSuccess,
  onCancel,
}: ScoreEntryFormProps) {
  const [formData, setFormData] = useState({
    childId: "",
    scoreAchieved: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.childId.trim()) newErrors.childId = "Child ID is required";
    if (!formData.scoreAchieved) newErrors.scoreAchieved = "Score is required";
    else if (Number(formData.scoreAchieved) < 0)
      newErrors.scoreAchieved = "Score must be non-negative";
    else if (Number(formData.scoreAchieved) > maxScore)
      newErrors.scoreAchieved = `Score must be ≤ ${maxScore}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<StudentScore>>(
        `/academic/assessments/${assessmentId}/scores`,
        {
          childId: formData.childId,
          scoreAchieved: Number(formData.scoreAchieved),
        }
      );
      onSuccess?.(response.data);
      setFormData({ childId: "", scoreAchieved: "" });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to record score" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Record Score</h3>

      {errors.submit && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="score-childId" className="text-sm font-medium">
            Child ID *
          </label>
          <Input
            id="score-childId"
            value={formData.childId}
            onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
            placeholder="UUID"
          />
          {errors.childId && <p className="text-xs text-destructive mt-1">{errors.childId}</p>}
        </div>
        <div>
          <label htmlFor="score-achieved" className="text-sm font-medium">
            Score * (max: {maxScore})
          </label>
          <Input
            id="score-achieved"
            type="number"
            min={0}
            max={maxScore}
            value={formData.scoreAchieved}
            onChange={(e) => setFormData({ ...formData, scoreAchieved: e.target.value })}
            placeholder="0"
          />
          {errors.scoreAchieved && (
            <p className="text-xs text-destructive mt-1">{errors.scoreAchieved}</p>
          )}
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Score"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
