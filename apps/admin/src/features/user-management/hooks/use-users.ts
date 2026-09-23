"use client";

import { useCallback, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ApiResponse, type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";

/**
 * Mirror of the API's UserWithSubDepartments contract (users module).
 */
export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  memberId: string | null;
  emailVerified: boolean;
  /** Lifecycle status: ACTIVE or DEACTIVATED (FR-13.6, migration 0006). */
  status: "ACTIVE" | "DEACTIVATED";
  deactivatedAt: string | null;
  image: string | null;
  subDepartments: Array<{
    subDepartmentId: string;
    code: string;
    nameEn: string;
    role: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: "ACTIVE" | "DEACTIVATED";
  page?: number;
}

/** Roles that can be assigned through the provisioning UI (BR-008). */
export const ASSIGNABLE_ROLES = [
  "SUPER_ADMIN",
  "CHAIRPERSON",
  "SUB_CHAIRPERSON",
  "SECRETARY",
  "MEMBER_REGULAR",
] as const;

/** Roles that require a linked member (BR-007). */
export const LEADERSHIP_ROLE_SET = new Set([
  "SUPER_ADMIN",
  "CHAIRPERSON",
  "SUB_CHAIRPERSON",
  "SECRETARY",
]);

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  memberId?: string;
  subDepartmentIds?: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
  memberId?: string | null;
  subDepartmentIds?: string[];
}

/** PE-02 error codes from the users API. */
export function userActionErrorMessage(err: unknown): string {
  const code = (err as { error?: { code?: string } })?.error?.code;
  switch (code) {
    case "LEADERSHIP_CONFLICT":
      return "This member already holds a leadership position (BR-009). One leadership post per member.";
    case "USER_EXISTS":
      return "An account with this email already exists.";
    case "BR_007_VIOLATION":
      return "Leadership accounts must be linked to a registered member (BR-007).";
    case "PROVISIONING_UNAVAILABLE":
      return "Account provisioning is not configured on the server (missing service-role key).";
    case "FORBIDDEN":
      return "You do not have permission to manage user accounts.";
    case "SELF_DEACTIVATION":
      return "You cannot deactivate your own account (guard rail).";
    case "LAST_ADMIN":
      return "Cannot deactivate the last remaining SUPER_ADMIN/CHAIRPERSON account (guard rail).";
    case "NOT_DEACTIVATED":
      return "This account is not deactivated — nothing to reactivate.";
    case "VALIDATION_ERROR":
      return "Please check the form values — some fields are invalid.";
    case "NOT_FOUND":
      return "The user was not found. It may have already been removed.";
    default: {
      const message = (err as { error?: { message?: string } })?.error?.message;
      if (message) return message;
      if (err instanceof Error) return err.message;
      return "The request failed. Please try again.";
    }
  }
}

interface UseUsersResult {
  users: ManagedUser[];
  pagination: PaginatedResponse<ManagedUser>["pagination"] | null;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  refresh: () => void;
  createUser: (payload: CreateUserPayload) => Promise<void>;
  resetPassword: (userId: string, newPassword: string) => Promise<void>;
  deactivate: (userId: string) => Promise<void>;
  /** PE-02 / FR-13.7: edit name, email, role, member link. */
  updateUser: (userId: string, payload: UpdateUserPayload) => Promise<void>;
  /** PE-01 / FR-13.6: restore a deactivated account. */
  reactivate: (userId: string) => Promise<void>;
  /** PE-08 / FR-13.13: force sign-out of live sessions. */
  revokeSessions: (userId: string) => Promise<void>;
}

function invalidateUsers(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: ["users"] });
}

export function useUsers(initialFilters: UserFilters = {}): UseUsersResult {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const listQuery = useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (filters.page) params.set("page", String(filters.page));
      if (filters.search) params.set("search", filters.search);
      if (filters.role) params.set("role", filters.role);
      if (filters.status) params.set("status", filters.status);

      return api.get<PaginatedResponse<ManagedUser>>(`/users?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      await api.post("/users", payload);
    },
    onSuccess: () => invalidateUsers(queryClient),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      await api.post(`/users/${userId}/reset-password`, { newPassword });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/users/${userId}/deactivate`, {});
    },
    onSuccess: () => invalidateUsers(queryClient),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, payload }: { userId: string; payload: UpdateUserPayload }) => {
      await api.patch(`/users/${userId}`, payload);
    },
    onSuccess: () => invalidateUsers(queryClient),
  });

  const reactivateMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/users/${userId}/reactivate`, {});
    },
    onSuccess: () => invalidateUsers(queryClient),
  });

  const revokeSessionsMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.post(`/users/${userId}/revoke-sessions`, {});
    },
  });

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      try {
        await createMutation.mutateAsync(payload);
      } catch (err) {
        throw err instanceof Error ? err : new Error(userActionErrorMessage(err));
      }
    },
    [createMutation]
  );

  const resetPassword = useCallback(
    async (userId: string, newPassword: string) => {
      try {
        await resetPasswordMutation.mutateAsync({ userId, newPassword });
      } catch (err) {
        throw err instanceof Error ? err : new Error(userActionErrorMessage(err));
      }
    },
    [resetPasswordMutation]
  );

  const deactivate = useCallback(
    async (userId: string) => {
      try {
        await deactivateMutation.mutateAsync(userId);
      } catch (err) {
        throw err instanceof Error ? err : new Error(userActionErrorMessage(err));
      }
    },
    [deactivateMutation]
  );

  const updateUser = useCallback(
    async (userId: string, payload: UpdateUserPayload) => {
      try {
        await updateMutation.mutateAsync({ userId, payload });
      } catch (err) {
        throw err instanceof Error ? err : new Error(userActionErrorMessage(err));
      }
    },
    [updateMutation]
  );

  const reactivate = useCallback(
    async (userId: string) => {
      try {
        await reactivateMutation.mutateAsync(userId);
      } catch (err) {
        throw err instanceof Error ? err : new Error(userActionErrorMessage(err));
      }
    },
    [reactivateMutation]
  );

  const revokeSessions = useCallback(
    async (userId: string) => {
      try {
        await revokeSessionsMutation.mutateAsync(userId);
      } catch (err) {
        throw err instanceof Error ? err : new Error(userActionErrorMessage(err));
      }
    },
    [revokeSessionsMutation]
  );

  return {
    users: listQuery.data?.data ?? [],
    pagination: listQuery.data?.pagination ?? null,
    loading: listQuery.isPending || listQuery.isFetching,
    error: listQuery.isError ? queryErrorMessage(listQuery.error, "Failed to load users") : null,
    filters,
    setFilters,
    refresh: () => {
      void listQuery.refetch();
    },
    createUser,
    resetPassword,
    deactivate,
    updateUser,
    reactivate,
    revokeSessions,
  };
}

interface UseUserResult {
  user: ManagedUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useUser(id: string | null): UseUserResult {
  const query = useQuery({
    queryKey: ["users", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<ManagedUser>>(`/users/${id}`);
      return response.data;
    },
  });

  if (!id) {
    return { user: null, loading: false, error: "No user ID provided.", refresh: () => {} };
  }

  return {
    user: query.data ?? null,
    loading: query.isPending || query.isFetching,
    error: query.isError
      ? queryErrorMessage(query.error, userActionErrorMessage(query.error))
      : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
