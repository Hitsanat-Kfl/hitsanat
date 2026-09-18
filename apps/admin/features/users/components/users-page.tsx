"use client";

import { AlertDialog, Button, Input, Select } from "@repo/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/features/shell";
import { CreateUserDialog } from "./create-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UserTable } from "./user-table";
import { ASSIGNABLE_ROLES, type ManagedUser, useUsers } from "../hooks/use-users";

const ROLE_FILTERS = [{ value: "", label: "All roles" }].concat(
  ASSIGNABLE_ROLES.map((role) => ({ value: role, label: role.replaceAll("_", " ") }))
);

/**
 * User account management (BR-008). Available to SUPER_ADMIN and
 * CHAIRPERSON — the API enforces this; the UI relies on route guards.
 */
export default function UsersPage() {
  const {
    users,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refresh,
    createUser,
    resetPassword,
    deactivate,
  } = useUsers();

  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<ManagedUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreate = async (payload: Parameters<typeof createUser>[0]) => {
    await createUser(payload);
    setNotice(`Account created — ${payload.email} can now sign in with the temporary password.`);
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetTarget) return;
    await resetPassword(resetTarget.id, newPassword);
    setNotice(`Password reset — a temporary password was set for ${resetTarget.email}.`);
    setResetTarget(null);
  };

  const handleDeactivate = async (user: ManagedUser) => {
    try {
      await deactivate(user.id);
      setNotice(`Account deactivated — ${user.email} can no longer sign in.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Deactivation failed.");
    }
  };

  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Users" }]}
      title="User Accounts"
      description="Provision accounts, reset credentials, and manage access (BR-008)."
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create account
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={filters.search ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value || undefined, page: 1 })
            }
            placeholder="Search by name or email…"
            type="search"
            aria-label="Search users"
            className="sm:max-w-xs"
          />
          <Select
            value={filters.role ?? ""}
            onChange={(e) => setFilters({ ...filters, role: e.target.value || undefined, page: 1 })}
            aria-label="Filter by role"
            className="sm:max-w-48"
          >
            {ROLE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {notice && (
          <output className="flex items-center justify-between rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="ml-3 shrink-0 underline underline-offset-2"
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          </output>
        )}

        {error && (
          <div role="alert" className="rounded-md bg-destructive/10 p-4 text-destructive">
            {error}
            <button type="button" onClick={refresh} className="ml-3 underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        <UserTable
          users={users}
          loading={loading}
          onResetPassword={(user) => setResetTarget(user)}
          onDeactivate={handleDeactivate}
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{pagination ? `${pagination.total} account(s)` : "—"}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || loading}
              onClick={() => setFilters({ ...filters, page: currentPage - 1 })}
            >
              Previous
            </Button>
            <span className="self-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setFilters({ ...filters, page: currentPage + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />

      {resetTarget && (
        <ResetPasswordDialog
          userName={resetTarget.name}
          onConfirm={handleResetPassword}
          onOpenChange={(open) => {
            if (!open) setResetTarget(null);
          }}
        />
      )}

      {deactivateTarget && (
        <DeactivateConfirm
          user={deactivateTarget}
          onOpenChange={(open) => {
            if (!open) setDeactivateTarget(null);
          }}
          onConfirm={() => handleDeactivate(deactivateTarget)}
        />
      )}
    </PageShell>
  );
}

interface DeactivateConfirmProps {
  user: ManagedUser;
  onConfirm: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

function DeactivateConfirm({ user, onConfirm, onOpenChange }: DeactivateConfirmProps) {
  return (
    <AlertDialog
      open
      onOpenChange={onOpenChange}
      onConfirm={() => {
        void onConfirm();
      }}
      variant="destructive"
      title={`Deactivate ${user.name}?`}
      description={`${user.email} will be blocked from signing in immediately. This does not delete the account.`}
      confirmText="Deactivate"
    />
  );
}
