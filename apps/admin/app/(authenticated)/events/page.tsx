"use client";

import { Button, Select } from "@repo/ui";
import { EventList } from "@/features/events";
import { useEvents } from "@/features/events";
import { PageShell } from "@/features/shell";
import type { EventType } from "../../../lib/types";

const EVENT_TYPES: { value: string; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "Special", label: "Special" },
  { value: "Extra_Training", label: "Extra Training" },
  { value: "Awdemerit", label: "Awdemerit" },
  { value: "Adar", label: "Adar" },
];

export default function EventListPage() {
  const { events, pagination, loading, error, filters, setFilters, refresh } = useEvents({
    page: 1,
    limit: 20,
  });

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      title="Events"
      description="Manage ministry events and special occasions."
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={refresh} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Select
            value={filters.eventType || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                eventType: (e.target.value as EventType) || undefined,
                page: 1,
              })
            }
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>

        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        <EventList events={events} loading={loading} />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
