"use client";

import { AlertDialog, Button, Input, Select, Skeleton, useToast } from "@repo/ui";
import { Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PagePagination, PageShell } from "@/widgets/shell";
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
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "DEACTIVATED", label: "Deactivated" },
];

const PAGE_DESCRIPTION =
  "Manage user accounts, roles, organization assignments, and account access.";

interface RegistryStats {
  total: number;
  active: number;
  deactivated: number;
  leadership: number;
}

function useRegistryStats(users: ManagedUser[]): RegistryStats {
  return useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const deactivated = total - active;
    const leadership = users.filter((u) => LEADERSHIP_ROLE_SET.has(u.role)).length;
    return { total, active, deactivated, leadership };
  }, [users]);
}

function AccountRegistryBand({ stats, loading }: { stats: RegistryStats; loading: boolean }) {
  const items = [
    { label: "Total users", value: stats.total, hint: "All provisioned accounts" },
    { label: "Active", value: stats.active, hint: "Can sign in now" },
    { label: "Deactivated", value: stats.deactivated, hint: "Sign-in blocked" },
    {
      label: "Leadership",
      value: stats.leadership,
      hint: "Chairperson · Secretary · Super Admin",
    },
  ];

  return (
    <section
      aria-label="Account registry summary"
      className="mb-5 overflow-hidden rounded-lg border bg-white"
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex min-w-[168px] flex-col justify-center gap-0.5 border-b border-border bg-[#FAFBFC] px-5 py-4 md:border-b-0 md:border-r">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5F0113]">
            Account Registry
          </span>
          <small className="text-xs font-normal text-muted-foreground">Ministry directory</small>
        </div>
        <div className="grid flex-1 grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={[
                "relative flex flex-col justify-center gap-0.5 px-5 py-4",
                index % 2 === 1 ? "border-l border-border" : "",
                index >= 2 ? "border-t border-border lg:border-t-0" : "",
                index === 2 ? "lg:border-l lg:border-border" : "",
                index === 3 ? "lg:border-l lg:border-border" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {loading ? (
                <>
                  <Skeleton className="h-7 w-10" />
                  <Skeleton className="mt-1 h-3.5 w-20" />
                </>
              ) : (
                <>
                  <div className="text-[28px] font-semibold leading-tight tracking-tight tabular-nums text-foreground">
                    {item.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
                  <div className="mt-0.5 hidden text-[11px] text-[#98A2B3] xl:block">
                    {item.hint}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccountOverview({ stats, loading }: { stats: RegistryStats; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={i > 0 ? "border-t pt-4" : undefined}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-10" />
            <Skeleton className="mt-1 h-3 w-28" />
          </div>
        ))}
        <div className="border-t pt-4">
          <Skeleton className="h-3 w-28" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const activePct = stats.total > 0 ? Math.round((stats.active / stats.total) * 1000) / 10 : 0;

  const items = [
    { k: "Total users", v: stats.total, sub: "Across 5 sub-departments" },
    { k: "Active", v: stats.active, sub: `${activePct}% of registry` },
    { k: "Deactivated", v: stats.deactivated, sub: "Blocked from sign-in" },
    { k: "Leadership", v: stats.leadership, sub: "Linked members (BR-007)" },
  ];

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.k}
          className="border-t border-border py-3.5 first:border-t-0 first:pt-0 last:pb-0"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
            {item.k}
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {item.v}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{item.sub}</div>
        </div>
      ))}

      <div className="mt-1 border-t border-border pt-3.5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          Account Status
        </div>
        <div className="mt-1">
          <div className="flex items-center justify-between gap-3 py-2">
            <span className="flex items-center gap-2 text-[13px] text-foreground">
              <span className="h-2 w-2 rounded-full bg-[#16834A]" aria-hidden="true" />
              Active
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-foreground">
              {stats.active}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-border py-2">
            <span className="flex items-center gap-2 text-[13px] text-foreground">
              <span className="h-2 w-2 rounded-full bg-[#98A2B3]" aria-hidden="true" />
              Deactivated
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-foreground">
              {stats.deactivated}
            </span>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
          {stats.active} accounts · {stats.deactivated} deactivated
        </p>
      </div>
    </div>
  );
}

function MobileOverview({ stats, loading }: { stats: RegistryStats; loading: boolean }) {
  const items = [
    { label: "Total users", value: stats.total },
    { label: "Active", value: stats.active },
    { label: "Deactivated", value: stats.deactivated },
    { label: "Leadership", value: stats.leadership },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1.5 h-6 w-8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function PageHeader({
  onCreate,
  compact = false,
}: {
  onCreate: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="mb-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-0.5 text-xs font-medium text-muted-foreground">Administration</p>
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-foreground">
            User Accounts
          </h1>
        </div>
        <Button
          onClick={onCreate}
          className="h-10 shrink-0 rounded-lg bg-[#5F0113] px-3 text-[13px] text-white hover:bg-[#4A010F]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create
        </Button>
      </div>
    );
  }

  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">Administration</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          User Accounts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{PAGE_DESCRIPTION}</p>
      </div>
      <Button
        onClick={onCreate}
        className="h-10 shrink-0 rounded-lg bg-[#5F0113] px-4 text-sm font-medium text-white hover:bg-[#4A010F]"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create User
      </Button>
    </header>
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
  const { toast } = useToast();
  const {
    users,
    pagination,
    loading,
    error,
    filters,
    setFilters,
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

  const stats = useRegistryStats(users);
  const hasActiveFilters =
    Boolean(filters.search) || Boolean(filters.role) || Boolean(filters.status);

  useEffect(() => {
    if (error) toast(error, "error");
  }, [error, toast]);

  const handleCreate = async (payload: Parameters<typeof createUser>[0]) => {
    await createUser(payload);
    toast(
      `Account created — ${payload.email} can now sign in with the temporary password.`,
      "success"
    );
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetTarget) return;
    await resetPassword(resetTarget.id, newPassword);
    toast(`Password reset — a temporary password was set for ${resetTarget.email}.`, "success");
    setResetTarget(null);
  };

  const handleDeactivate = async (user: ManagedUser) => {
    try {
      await deactivate(user.id);
      toast(`Account deactivated — ${user.email} can no longer sign in.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Deactivation failed.", "error");
    }
  };

  const handleUpdate = async (userId: string, payload: UpdateUserPayload) => {
    await updateUser(userId, payload);
    toast("Account updated.", "success");
  };

  const handleReactivate = async (user: ManagedUser) => {
    try {
      await reactivate(user.id);
      toast(`Account reactivated — ${user.email} can sign in again.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Reactivation failed.", "error");
    }
  };

  const handleRevokeSessions = async (user: ManagedUser) => {
    try {
      await revokeSessions(user.id);
      toast(`All live sessions for ${user.email} were revoked.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Session revocation failed.", "error");
    }
  };

  const handleView = (user: ManagedUser) => {
    router.push(`/users/${user.id}`);
  };

  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;
  const totalUsers = pagination?.total ?? users.length;

  const buildSearchField = (placeholder: string) => (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
        aria-hidden="true"
      />
      <Input
        value={filters.search ?? ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined, page: 1 })}
        placeholder={placeholder}
        type="search"
        aria-label="Search users"
        className="bg-white pl-9 shadow-none"
      />
    </div>
  );

  const roleSelect = (
    <Select
      value={filters.role ?? ""}
      onChange={(e) => setFilters({ ...filters, role: e.target.value || undefined, page: 1 })}
      aria-label="Filter by role"
      className="w-full bg-white sm:w-[150px]"
    >
      {ROLE_FILTERS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );

  const statusSelect = (
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
      className="w-full bg-white sm:w-[150px]"
    >
      {STATUS_FILTERS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );

  const clearFilters = hasActiveFilters ? (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setFilters({ page: filters.page })}
      className="h-10 gap-1 px-2 text-muted-foreground"
    >
      <X className="h-3.5 w-3.5" aria-hidden="true" />
      Clear filters
    </Button>
  ) : null;

  const mobileFilters = (
    <div className="flex flex-col gap-2.5">
      {buildSearchField("Search name or email...")}
      <div className="grid grid-cols-2 gap-2.5">
        {roleSelect}
        {statusSelect}
      </div>
      {clearFilters}
    </div>
  );

  const desktopFilters = (
    <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
      {buildSearchField("Search users...")}
      {roleSelect}
      {statusSelect}
      {clearFilters}
    </div>
  );

  return (
    <PageShell breadcrumbs={[{ label: "Administration" }, { label: "User Accounts" }]}>
      <div className="space-y-4">
        {/* Mobile */}
        <div className="space-y-4 lg:hidden">
          <PageHeader onCreate={() => setCreateOpen(true)} compact />
          <MobileOverview stats={stats} loading={loading} />

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">
              User Directory
            </h2>
            <p className="mb-3 mt-1 text-[13px] text-muted-foreground">
              {loading ? "Loading accounts…" : `${totalUsers} users`}
            </p>
          </div>

          {mobileFilters}

          <UserCards
            users={users}
            loading={loading}
            hasActiveFilters={hasActiveFilters}
            onView={handleView}
            onResetPassword={(user) => setResetTarget(user)}
            onDeactivate={(user) => setDeactivateTarget(user)}
            onEdit={(user) => setEditTarget(user)}
            onReactivate={handleReactivate}
            onRevokeSessions={handleRevokeSessions}
            onHandover={(user) => setHandoverTarget(user)}
          />

          {pagination && (
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{totalUsers} account(s)</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setFilters({ ...filters, page: currentPage - 1 })}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setFilters({ ...filters, page: currentPage + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <PageHeader onCreate={() => setCreateOpen(true)} />
          <AccountRegistryBand stats={stats} loading={loading} />

          <div className="grid grid-cols-12 gap-6 items-start">
            <section className="col-span-3 min-w-0">
              <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Account Overview
              </h2>
              <div className="rounded-lg border bg-white p-4">
                <AccountOverview stats={stats} loading={loading} />
              </div>
            </section>

            <section className="col-span-9 min-w-0">
              <div className="mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  User Directory
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {loading ? "Loading accounts…" : `${totalUsers} users · ${users.length} shown`}
                </p>
              </div>

              {desktopFilters}

              <UserTable
                users={users}
                loading={loading}
                hasActiveFilters={hasActiveFilters}
                onView={handleView}
                onResetPassword={(user) => setResetTarget(user)}
                onDeactivate={(user) => setDeactivateTarget(user)}
                onEdit={(user) => setEditTarget(user)}
                onReactivate={handleReactivate}
                onRevokeSessions={handleRevokeSessions}
                onHandover={(user) => setHandoverTarget(user)}
              />

              {pagination && (
                <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-muted-foreground">
                  <span>
                    {totalUsers} account(s) · Page {currentPage} of {totalPages}
                  </span>
                  <PagePagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setFilters({ ...filters, page })}
                  />
                </div>
              )}
            </section>
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
          onDemoteOutgoing={async (userId) => {
            await updateUser(userId, { role: "MEMBER_REGULAR" });
          }}
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
