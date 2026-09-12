"use client";

import { useCallback, useEffect, useState } from "react";
import { type PaginatedResponse, api } from "../../lib/api-client";
import type { Member, MemberFilters } from "../../lib/types";

interface UseMembersResult {
  members: Member[];
  pagination: PaginatedResponse<Member>["pagination"] | null;
  loading: boolean;
  error: string | null;
  filters: MemberFilters;
  setFilters: (filters: MemberFilters) => void;
  refresh: () => void;
}

export function useMembers(initialFilters: MemberFilters = {}): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Member>["pagination"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MemberFilters>(initialFilters);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.subDept) params.set("subDept", filters.subDept);
      if (filters.familyId) params.set("familyId", filters.familyId);
      if (filters.yearOfStudy) params.set("yearOfStudy", filters.yearOfStudy);
      if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));

      const query = params.toString();
      const endpoint = `/members${query ? `?${query}` : ""}`;
      const response = await api.get<PaginatedResponse<Member>>(endpoint);

      setMembers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchMembers,
  };
}
