"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Member, MemberFilters } from "@/domains/definitions";

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
  const [filters, setFilters] = useState<MemberFilters>(initialFilters);

  const query = useQuery({
    queryKey: ["members", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.subDept) params.set("subDept", filters.subDept);
      if (filters.familyId) params.set("familyId", filters.familyId);
      if (filters.yearOfStudy) params.set("yearOfStudy", String(filters.yearOfStudy));
      if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));

      const query = params.toString();
      const endpoint = `/members${query ? `?${query}` : ""}`;
      return api.get<PaginatedResponse<Member>>(endpoint);
    },
    placeholderData: keepPreviousData,
  });

  return {
    members: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError ? queryErrorMessage(query.error, "Failed to fetch members") : null,
    filters,
    setFilters,
    refresh: () => {
      void query.refetch();
    },
  };
}
