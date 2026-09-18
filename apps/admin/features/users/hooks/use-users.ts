"use client";

import { useCallback, useEffect, useState } from "react";
import { type PaginatedResponse, api } from "@/lib/api-client";

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
}

/**
 * Maps API failures to operator-friendly messages. The users endpoints
 * return { success: false, error: { code, message } }.
 */
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
}

export function useUsers(initialFilters: UserFilters = {}): UseUsersResult {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<ManagedUser>["pagination"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (filters.page) params.set("page", String(filters.page));
      if (filters.search) params.set("search", filters.search);
      if (filters.role) params.set("role", filters.role);

      const response = await api.get<PaginatedResponse<ManagedUser>>(`/users?${params.toString()}`);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(userActionErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      try {
        await api.post("/users", payload);
        await fetchUsers();
      } catch (err) {
        throw new Error(userActionErrorMessage(err));
      }
    },
    [fetchUsers]
  );

  const resetPassword = useCallback(async (userId: string, newPassword: string) => {
    try {
      await api.post(`/users/${userId}/reset-password`, { newPassword });
    } catch (err) {
      throw new Error(userActionErrorMessage(err));
    }
  }, []);

  const deactivate = useCallback(
    async (userId: string) => {
      try {
        await api.post(`/users/${userId}/deactivate`, {});
        await fetchUsers();
      } catch (err) {
        throw new Error(userActionErrorMessage(err));
      }
    },
    [fetchUsers]
  );

  return {
    users,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchUsers,
    createUser,
    resetPassword,
    deactivate,
  };
}
