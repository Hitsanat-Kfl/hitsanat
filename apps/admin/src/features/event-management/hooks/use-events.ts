"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Event, EventFilters } from "@/domains/definitions";

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
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const query = useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.eventType) params.set("eventType", filters.eventType);

      const q = params.toString();
      return api.get<PaginatedResponse<Event>>(`/events${q ? `?${q}` : ""}`);
    },
    placeholderData: keepPreviousData,
  });

  return {
    events: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch events") : null,
    filters,
    setFilters,
    refresh: () => {
      void query.refetch();
    },
  };
}
