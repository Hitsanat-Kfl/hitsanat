"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PermissionGrant } from "@repo/permissions";
import { type ApiResponse, type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";

export type { PermissionGrant };

export interface CreateGrantPayload {
  userId: string;
  resource: string;
  action: string;
  expiresAt: string;
  reason?: string;
}

export function grantStatus(grant: PermissionGrant, now: Date = new Date()): string {
  if (grant.revokedAt) return "Revoked";
  if (new Date(grant.expiresAt).getTime() <= now.getTime()) return "Expired";
  return "Active";
}

function grantErrorMessage(err: unknown): string {
  const code = (err as { error?: { code?: string } })?.error?.code;
  switch (code) {
    case "FORBIDDEN":
      return "Only Super Admin can manage temporary permission grants.";
    case "VALIDATION_ERROR":
      return "Check the grant details — expiry must be within 7 days and in the future.";
    case "NOT_FOUND":
      return "That grant no longer exists.";
    case "ALREADY_REVOKED":
      return "That grant has already been revoked.";
    default:
      return queryErrorMessage(err, "The grant request failed.");
  }
}

export function usePermissionGrants(userId: string | null) {
  const queryClient = useQueryClient();
  const enabled = Boolean(userId);

  const listQuery = useQuery({
    queryKey: ["permission-grants", userId],
    enabled,
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<PermissionGrant>>(
        `/permission-grants?userId=${encodeURIComponent(userId ?? "")}`
      );
      return response.data;
    },
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["permission-grants", userId] });
  }, [queryClient, userId]);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateGrantPayload) => {
      await api.post<ApiResponse<PermissionGrant>>("/permission-grants", payload);
    },
    onSuccess: invalidate,
  });

  const revokeMutation = useMutation({
    mutationFn: async (grantId: string) => {
      await api.post<ApiResponse<PermissionGrant>>(`/permission-grants/${grantId}/revoke`, {});
    },
    onSuccess: invalidate,
  });

  const createGrant = useCallback(
    async (payload: CreateGrantPayload) => {
      try {
        await createMutation.mutateAsync(payload);
      } catch (err) {
        throw new Error(grantErrorMessage(err));
      }
    },
    [createMutation]
  );

  const revokeGrant = useCallback(
    async (grantId: string) => {
      try {
        await revokeMutation.mutateAsync(grantId);
      } catch (err) {
        throw new Error(grantErrorMessage(err));
      }
    },
    [revokeMutation]
  );

  return {
    grants: listQuery.data ?? [],
    loading: listQuery.isPending || listQuery.isFetching,
    error: listQuery.isError
      ? queryErrorMessage(listQuery.error, "Failed to load permission grants")
      : null,
    createGrant,
    revokeGrant,
    creating: createMutation.isPending,
    revoking: revokeMutation.isPending,
  };
}
