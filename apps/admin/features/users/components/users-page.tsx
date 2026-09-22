"use client";

import { AlertDialog, Button, Input, Select, Skeleton } from "@repo/ui";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertBanner, PagePagination, PageShell } from "@/features/shell";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { HandoverDialog } from "./handover-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UserCards } from "./user-cards";
import { UserTable } from "./user-table";
import {
  ASSIGNABLE_ROLES,
  LEADERSHIP_ROLE_SET,
  type ManagedUser,
  type UpdateUserPayload,
  useUsers,
} from "../hooks/use-users";

const ROLE_FILTERS = [{ value: "", label: "All Roles" }].concat(
  ASSIGNABLE_ROLES.map((role) => ({ value: role, label: role.replaceAll("_", " ") }))
);

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "DEACTIVATED", label: "Deactivated" },
];

function AccountOverview({ users, loading }: { users: ManagedUser[]; loading: boolean }) {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const deactivated = total - active;
    const leadership = users.filter((u) => LEADERSHIP_ROLE_SET.has(u.role)).length;
    return { total, active, deactivated, leadership };
  }, [users]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-12" />
        <div className="border-t" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-12" />
        <div className="border-t" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8" />
        <div className="border-t" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Total Users
        </p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{stats.total}</p>
      </div>
      <div className="border-t" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{stats.active}</p>
      </div>
      <div className="border-t" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Deactivated
        </p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{stats.deactivated}</p>
      </div>
      <div className="border-t" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Leadership
        </p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{stats.leadership}</p>
      </div>
    </div>
  );
}

function MobileOverview({ users, loading }: { users: ManagedUser[]; loading: boolean }) {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const deactivated = total - active;
    const leadership = users.filter((u) => LEADERSHIP_ROLE_SET.has(u.role)).length;
    return { total, active, deactivated, leadership };
  }, [users]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-px rounded-md border bg-border">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1 h-6 w-8" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { label: "TOTAL USERS", value: stats.total },
    { label: "ACTIVE", value: stats.active },
    { label: "DEACTIVATED", value: stats.deactivated },
    { label: "LEADERSHIP", value: stats.leadership },
  ];

  return (
    <div className="grid grid-cols-2 gap-px rounded-md border bg-border">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-0.5 text-lg font-semibold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * User account management (BR-008). Available to SUPER_ADMIN and
 * CHAIRPERSON — the API enforces this; the UI relies on route guards.
 * Implements PE-01 (reactivation), PE-02 (edit), PE-04 (handover),
 * PE-06 (guard rails surfaced as API errors), and PE-08 (force sign-out).
 */
export default function UsersPage() {
  const router = useRouter();
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

  const hasActiveFilters =
    Boolean(filters.search) || Boolean(filters.role) || Boolean(filters.status);

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

  const handleView = (user: ManagedUser) => {
    router.push(`/users/${user.id}`);
  };

  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;
  const totalUsers = pagination?.total ?? users.length;

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Users" }]}
      title="User Accounts"
      description="Manage system accounts, roles and access"
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create User
        </Button>
      }
    >
      <div className="space-y-4">
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

        {/* Mobile: single-column layout */}
        <div className="space-y-4 lg:hidden">
          <MobileOverview users={users} loading={loading} />

          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              User Directory
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{totalUsers} users</p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              value={filters.search ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value || undefined, page: 1 })
              }
              placeholder="Search name or email..."
              type="search"
              aria-label="Search users"
            />
            <div className="flex gap-3">
              <Select
                value={filters.role ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value || undefined, page: 1 })
                }
                aria-label="Filter by role"
                className="flex-1"
              >
                {ROLE_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                value={filters.status ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: (e.target.value as "ACTIVE" | "DEACTIVATED") || undefined,
                    page: 1,
                  })
                }
                aria-label="Filter by status"
                className="flex-1"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ page: filters.page })}
                className="self-start gap-1"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>

          <UserCards
            users={users}
            loading={loading}
            onView={handleView}
            onResetPassword={(user) => setResetTarget(user)}
            onDeactivate={(user) => setDeactivateTarget(user)}
            onEdit={(user) => setEditTarget(user)}
            onReactivate={handleReactivate}
            onRevokeSessions={handleRevokeSessions}
            onHandover={(user) => setHandoverTarget(user)}
          />

          {pagination && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{totalUsers} account(s)</span>
              <PagePagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </div>

        {/* Desktop: 3/9 layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left: Account Overview — 3 columns */}
          <div className="col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Account Overview
            </h2>
            <div className="mt-3 rounded-md border bg-white p-4">
              <AccountOverview users={users} loading={loading} />
            </div>
          </div>

          {/* Right: User Directory — 9 columns */}
          <div className="col-span-9 space-y-4">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                User Directory
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{totalUsers} users</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={filters.search ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value || undefined, page: 1 })
                }
                placeholder="Search users..."
                type="search"
                aria-label="Search users"
                className="sm:max-w-xs"
              />
              <Select
                value={filters.role ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value || undefined, page: 1 })
                }
                aria-label="Filter by role"
                className="sm:max-w-48"
              >
                {ROLE_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                value={filters.status ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: (e.target.value as "ACTIVE" | "DEACTIVATED") || undefined,
                    page: 1,
                  })
                }
                aria-label="Filter by status"
                className="sm:max-w-48"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ page: filters.page })}
                  className="gap-1"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                  Clear filters
                </Button>
              )}
            </div>

            <UserTable
              users={users}
              loading={loading}
              onView={handleView}
              onResetPassword={(user) => setResetTarget(user)}
              onDeactivate={(user) => setDeactivateTarget(user)}
              onEdit={(user) => setEditTarget(user)}
              onReactivate={handleReactivate}
              onRevokeSessions={handleRevokeSessions}
              onHandover={(user) => setHandoverTarget(user)}
            />

            {pagination && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{totalUsers} account(s)</span>
                <PagePagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            )}
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
