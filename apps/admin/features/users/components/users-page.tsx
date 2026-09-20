"use client";

import { AlertDialog, Button, Input, Select } from "@repo/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AlertBanner, PagePagination, PageShell } from "@/features/shell";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { HandoverDialog } from "./handover-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UserTable } from "./user-table";
import {
  ASSIGNABLE_ROLES,
  type ManagedUser,
  type UpdateUserPayload,
  useUsers,
} from "../hooks/use-users";

const ROLE_FILTERS = [{ value: "", label: "All roles" }].concat(
  ASSIGNABLE_ROLES.map((role) => ({ value: role, label: role.replaceAll("_", " ") }))
);

/**
 * User account management (BR-008). Available to SUPER_ADMIN and
 * CHAIRPERSON — the API enforces this; the UI relies on route guards.
 * Implements PE-01 (reactivation), PE-02 (edit), PE-04 (handover),
 * PE-06 (guard rails surfaced as API errors), and PE-08 (force sign-out).
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
    updateUser,
    reactivate,
    revokeSessions,
  } = useUsers();

  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<ManagedUser | null>(null);
  const [editTarget, setEditTarget] = useState<ManagedUser | null>(null);
  const [handoverTarget, setHandoverTarget] = useState<ManagedUser | null>(null);
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

  const handleUpdate = async (userId: string, payload: UpdateUserPayload) => {
    await updateUser(userId, payload);
    setNotice("Account updated.");
  };

  const handleReactivate = async (user: ManagedUser) => {
    try {
      await reactivate(user.id);
      setNotice(`Account reactivated — ${user.email} can sign in again.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Reactivation failed.");
    }
  };

  const handleRevokeSessions = async (user: ManagedUser) => {
    try {
      await revokeSessions(user.id);
      setNotice(`All live sessions for ${user.email} were revoked.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Session revocation failed.");
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

        {error && <AlertBanner message={error} />}

        <UserTable
          users={users}
          loading={loading}
          onResetPassword={(user) => setResetTarget(user)}
          onDeactivate={handleDeactivate}
          onEdit={(user) => setEditTarget(user)}
          onReactivate={handleReactivate}
          onRevokeSessions={handleRevokeSessions}
          onHandover={(user) => setHandoverTarget(user)}
        />

        {pagination && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{pagination.total} account(s)</span>
            <PagePagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}
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

      {editTarget && (
        <EditUserDialog
          user={editTarget}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          onUpdate={handleUpdate}
        />
      )}

      {handoverTarget && (
        <HandoverDialog
          user={handoverTarget}
          onOpenChange={(open) => {
            if (!open) setHandoverTarget(null);
          }}
          onCreateSuccessor={handleCreate}
          onDeactivateOutgoing={async (userId) => {
            await deactivate(userId);
          }}
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
