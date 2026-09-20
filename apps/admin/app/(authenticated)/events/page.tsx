"use client";

import { Button, Select } from "@repo/ui";
import { EventList, useEvents } from "@/features/events";
import { AlertBanner, PageLoading, PagePagination, PageShell } from "@/features/shell";
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
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
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

        {error && <AlertBanner message={error} />}

        {loading ? (
          <PageLoading />
        ) : (
          <EventList events={events} loading={loading} />
        )}

        {pagination && (
          <PagePagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        )}
      </div>
    </PageShell>
  );
}
