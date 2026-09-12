"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type {
  Child,
  ChildFilters,
  CollectionLocation,
  KutrGroup,
  Pagination,
} from "../../lib/types";

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
  const [children, setChildren] = useState<Child[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChildFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.kutrGroup) params.set("kutrGroup", filters.kutrGroup);
      if (filters.collectionLocation) params.set("collectionLocation", filters.collectionLocation);

      const response = await api.get<ApiResponse<Child[]>>(`/children?${params.toString()}`);
      setChildren(response.data);

      // Extract pagination from response headers or default
      setPagination({
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: response.data.length,
        totalPages: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch children");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchChildren,
  };
}
