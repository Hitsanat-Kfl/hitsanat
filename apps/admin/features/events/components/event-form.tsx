"use client";

import { Button, Input, Select } from "@repo/ui";
import { useState } from "react";
import { type ApiResponse, api } from "@/lib/api-client";
import type { Event, EventType } from "@/lib/types";

const EVENT_TYPES: EventType[] = ["Special", "Extra_Training", "Awdemerit", "Adar"];

interface EventFormProps {
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
}

export function EventForm({ onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "" as EventType | "",
    eventDate: "",
    isPublished: false,
    countdownActive: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.eventName.trim()) newErrors.eventName = "Event name is required";
    if (!formData.eventType) newErrors.eventType = "Event type is required";
    if (!formData.eventDate) newErrors.eventDate = "Event date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<Event>>("/events", {
        eventName: formData.eventName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        isPublished: formData.isPublished,
        countdownActive: formData.countdownActive,
      });
      onSuccess?.(response.data);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to create event" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Create Event</h2>

      {errors.submit && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errors.submit}
        </div>
      )}

      <div>
        <label htmlFor="event-name" className="text-sm font-medium">
          Event Name *
        </label>
        <Input
          id="event-name"
          value={formData.eventName}
          onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
          placeholder="e.g. Timket Celebration"
        />
        {errors.eventName && <p className="text-xs text-destructive mt-1">{errors.eventName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="event-type" className="text-sm font-medium">
            Event Type *
          </label>
          <Select
            id="event-type"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
          >
            <option value="">Select type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </Select>
          {errors.eventType && <p className="text-xs text-destructive mt-1">{errors.eventType}</p>}
        </div>
        <div>
          <label htmlFor="event-date" className="text-sm font-medium">
            Event Date *
          </label>
          <Input
            id="event-date"
            type="datetime-local"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          />
          {errors.eventDate && <p className="text-xs text-destructive mt-1">{errors.eventDate}</p>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="rounded border-input"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.countdownActive}
            onChange={(e) => setFormData({ ...formData, countdownActive: e.target.checked })}
            className="rounded border-input"
          />
          Countdown Active
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
