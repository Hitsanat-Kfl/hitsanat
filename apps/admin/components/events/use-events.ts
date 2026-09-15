"use client";

import { useCallback, useEffect, useState } from "react";
import { type PaginatedResponse, api } from "../../lib/api-client";
import type { Event, EventFilters } from "../../lib/types";

interface UseEventsResult {
  events: Event[];
  pagination: PaginatedResponse<Event>["pagination"] | null;
  loading: boolean;
  error: string | null;
  filters: EventFilters;
  setFilters: (filters: EventFilters) => void;
  refresh: () => void;
}

export function useEvents(initialFilters: EventFilters = {}): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Event>["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.eventType) params.set("eventType", filters.eventType);

      const query = params.toString();
      const response = await api.get<PaginatedResponse<Event>>(
        `/events${query ? `?${query}` : ""}`
      );
      setEvents(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchEvents,
  };
}
