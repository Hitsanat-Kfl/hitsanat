"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ApiResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Child, ChildFilters, Pagination } from "@/domains/definitions";

interface UseChildrenResult {
  children: Child[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  filters: ChildFilters;
  setFilters: (filters: ChildFilters) => void;
  refresh: () => void;
}

export function useChildren(initialFilters: ChildFilters = {}): UseChildrenResult {
  const [filters, setFilters] = useState<ChildFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  const query = useQuery({
    queryKey: ["children", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.kutrGroup) params.set("kutrGroup", filters.kutrGroup);
      if (filters.collectionLocation) params.set("collectionLocation", filters.collectionLocation);

      return api.get<ApiResponse<Child[]>>(`/children?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
    select: (response) => ({
      children: response.data,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: response.data.length,
        totalPages: 1,
      },
    }),
  });

  return {
    children: query.data?.children ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch children") : null,
    filters,
    setFilters,
    refresh: () => {
      void query.refetch();
    },
  };
}
