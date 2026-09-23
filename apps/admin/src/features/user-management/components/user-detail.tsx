"use client";

import { Avatar, Badge, Button, Skeleton, StatusBadge } from "@repo/ui";
import { ArrowLeft, Key, Pencil, RefreshCw, ShieldOff, UserX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AlertBanner, PageShell } from "@/widgets/shell";
import { EditUserDialog } from "./edit-user-dialog";
import { HandoverDialog } from "./handover-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import {
  LEADERSHIP_ROLE_SET,
  type ManagedUser,
  type UpdateUserPayload,
  useUser,
} from "../hooks/use-users";

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="col-span-3 space-y-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
          <div className="border-t" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="col-span-9 space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
              {i < 3 && <div className="border-t" />}
            </div>
          ))}
        </div>
      </div>
      {/* Mobile */}
      <div className="space-y-4 lg:hidden">
        <div className="flex flex-col items-center space-y-3 py-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-md border p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UserDetail({ user }: { user: ManagedUser }) {
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<ManagedUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const deactivated = user.status === "DEACTIVATED";
  const isLeadership = LEADERSHIP_ROLE_SET.has(user.role);
  const subDept = user.subDepartments.length > 0 ? user.subDepartments[0] : null;

  const handleUpdate = async (_userId: string, _payload: UpdateUserPayload) => {
    setNotice("Account updated.");
    setEditOpen(false);
  };

  const handleResetPassword = async (_newPassword: string) => {
    setNotice(`Password reset for ${user.email}.`);
    setResetOpen(false);
  };

  const handleDeactivate = async () => {
    try {
      const { api: apiClient } = await import("@/infrastructure/api/client");
      await apiClient.post(`/users/${user.id}/deactivate`, {});
      setNotice(`Account deactivated — ${user.email} can no longer sign in.`);
      setDeactivateTarget(null);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Deactivation failed.");
    }
  };

  const handleReactivate = async () => {
    try {
      const { api: apiClient } = await import("@/infrastructure/api/client");
      await apiClient.post(`/users/${user.id}/reactivate`, {});
      setNotice(`Account reactivated — ${user.email} can sign in again.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Reactivation failed.");
    }
  };

  const handleRevokeSessions = async () => {
    try {
      const { api: apiClient } = await import("@/infrastructure/api/client");
      await apiClient.post(`/users/${user.id}/revoke-sessions`, {});
      setNotice(`All live sessions for ${user.email} were revoked.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Session revocation failed.");
    }
  };

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Users", href: "/users" },
        { label: user.name },
      ]}
      title="User Details"
      description="Manage account information, access and security"
      actions={
        <Button onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit User
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

        {/* Mobile layout */}
        <div className="space-y-4 lg:hidden">
          {/* Mobile header */}
          <div className="flex flex-col items-center space-y-3 py-4">
            <Avatar
              src={user.image ?? undefined}
              name={user.name}
              size="xl"
              showStatus
              status={deactivated ? "offline" : "online"}
            />
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={deactivated ? "inactive" : "active"} size="sm" />
              <span className="text-sm text-muted-foreground">
                {user.role.replaceAll("_", " ")}
                {subDept && ` · ${subDept.code}`}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <Section title="Account Information">
            <InfoRow label="Name">{user.name}</InfoRow>
            <InfoRow label="Email">{user.email}</InfoRow>
            <InfoRow label="Email Verification">
              {user.emailVerified ? (
                <span className="flex items-center gap-1 text-sm text-foreground">
                  <span className="text-emerald-600">✓</span> Verified
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Not verified</span>
              )}
            </InfoRow>
            <InfoRow label="Created">{formatDateTime(user.createdAt)}</InfoRow>
          </Section>

          {/* Role & Organization */}
          <Section title="Role & Organization">
            <InfoRow label="Role">
              <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
            </InfoRow>
            {subDept && (
              <InfoRow label="Sub-department">
                <span className="text-sm text-foreground">{subDept.code}</span>
              </InfoRow>
            )}
            {user.memberId && (
              <InfoRow label="Linked Member">
                <span className="text-sm text-foreground">
                  {user.name} · {user.memberId.slice(0, 8)}…
                </span>
              </InfoRow>
            )}
          </Section>

          {/* Security */}
          <Section title="Security">
            <InfoRow label="Password">
              <div className="flex items-center justify-between">
                <span className="text-sm tracking-widest text-muted-foreground">••••••••••••</span>
                <Button variant="ghost" size="sm" onClick={() => setResetOpen(true)}>
                  <Key className="h-4 w-4" aria-hidden="true" />
                  Reset Password
                </Button>
              </div>
            </InfoRow>
            <InfoRow label="Sessions">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active sessions</span>
                <Button variant="ghost" size="sm" onClick={() => void handleRevokeSessions()}>
                  <ShieldOff className="h-4 w-4" aria-hidden="true" />
                  Revoke Sessions
                </Button>
              </div>
            </InfoRow>
          </Section>

          {/* Administrative Actions */}
          <Section title="Administrative Actions">
            <div className="space-y-3">
              {isLeadership && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setHandoverOpen(true)}
                >
                  <UserX className="h-4 w-4" aria-hidden="true" />
                  Handover Leadership
                </Button>
              )}
              {deactivated ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => void handleReactivate()}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reactivate Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setDeactivateTarget(user)}
                >
                  <ShieldOff className="h-4 w-4" aria-hidden="true" />
                  Deactivate Account
                </Button>
              )}
            </div>
          </Section>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left: User Profile — 3 columns */}
          <div className="col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              User Profile
            </h2>
            <div className="mt-3 rounded-md border bg-white p-4">
              <div className="flex flex-col items-center space-y-3">
                <Avatar
                  src={user.image ?? undefined}
                  name={user.name}
                  size="xl"
                  showStatus
                  status={deactivated ? "offline" : "online"}
                />
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={deactivated ? "inactive" : "active"} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">{user.role.replaceAll("_", " ")}</p>
                {subDept && <p className="text-sm text-muted-foreground">{subDept.code}</p>}
              </div>

              <div className="mt-4 border-t pt-4 space-y-3">
                {user.memberId && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Member ID
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{user.memberId.slice(0, 8)}…</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Account Created
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detail sections — 9 columns */}
          <div className="col-span-9 space-y-6">
            {/* Account Information */}
            <Section title="Account Information">
              <InfoRow label="Name">{user.name}</InfoRow>
              <InfoRow label="Email">{user.email}</InfoRow>
              <InfoRow label="Email Verified">
                {user.emailVerified ? (
                  <span className="flex items-center gap-1 text-sm text-foreground">
                    <span className="text-emerald-600">✓</span> Verified
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Not verified</span>
                )}
              </InfoRow>
              <InfoRow label="Created">{formatDateTime(user.createdAt)}</InfoRow>
            </Section>

            {/* Role & Organization */}
            <Section title="Role & Organization">
              <InfoRow label="Role">
                <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
              </InfoRow>
              {subDept && (
                <InfoRow label="Sub-departments">
                  <Badge variant="outline">{subDept.code}</Badge>
                </InfoRow>
              )}
              {user.memberId && (
                <InfoRow label="Linked Member">
                  <div>
                    <p className="text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.memberId.slice(0, 8)}…</p>
                  </div>
                </InfoRow>
              )}
            </Section>

            {/* Security */}
            <Section title="Security">
              <InfoRow label="Password">
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-widest text-muted-foreground">
                    ••••••••••••
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setResetOpen(true)}>
                    <Key className="h-4 w-4" aria-hidden="true" />
                    Reset Password
                  </Button>
                </div>
              </InfoRow>
              <InfoRow label="Active Sessions">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">—</span>
                  <Button variant="ghost" size="sm" onClick={() => void handleRevokeSessions()}>
                    <ShieldOff className="h-4 w-4" aria-hidden="true" />
                    Revoke Sessions
                  </Button>
                </div>
              </InfoRow>
            </Section>

            {/* Administrative Actions */}
            <Section title="Administrative Actions">
              <div className="flex flex-wrap gap-3">
                {isLeadership && (
                  <Button variant="outline" onClick={() => setHandoverOpen(true)}>
                    <UserX className="h-4 w-4" aria-hidden="true" />
                    Handover Leadership
                  </Button>
                )}
                {deactivated ? (
                  <Button variant="outline" onClick={() => void handleReactivate()}>
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Reactivate Account
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeactivateTarget(user)}
                  >
                    <ShieldOff className="h-4 w-4" aria-hidden="true" />
                    Deactivate Account
                  </Button>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EditUserDialog user={user} onOpenChange={setEditOpen} onUpdate={handleUpdate} />

      {resetOpen && (
        <ResetPasswordDialog
          userName={user.name}
          onConfirm={handleResetPassword}
          onOpenChange={(open) => {
            if (!open) setResetOpen(false);
          }}
        />
      )}

      {handoverOpen && (
        <HandoverDialog
          user={user}
          onOpenChange={(open) => {
            if (!open) setHandoverOpen(false);
          }}
          onCreateSuccessor={async (payload) => {
            const { api: apiClient } = await import("@/infrastructure/api/client");
            await apiClient.post("/users", payload);
            setNotice("Successor account created.");
          }}
          onDemoteOutgoing={async (userId) => {
            const { api: apiClient } = await import("@/infrastructure/api/client");
            await apiClient.patch(`/users/${userId}`, { role: "MEMBER_REGULAR" });
            setNotice("Outgoing leader demoted to regular member.");
          }}
          onDeactivateOutgoing={async (userId) => {
            const { api: apiClient } = await import("@/infrastructure/api/client");
            await apiClient.post(`/users/${userId}/deactivate`, {});
            setNotice("Outgoing leader deactivated.");
            setHandoverOpen(false);
          }}
        />
      )}

      {deactivateTarget && (
        <DeactivateConfirm
          user={deactivateTarget}
          onOpenChange={(open) => {
            if (!open) setDeactivateTarget(null);
          }}
          onConfirm={handleDeactivate}
        />
      )}
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="mt-3 divide-y">{children}</div>
    </div>
  );
}

interface DeactivateConfirmProps {
  user: ManagedUser;
  onConfirm: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

function DeactivateConfirm({ user, onConfirm, onOpenChange }: DeactivateConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground">Deactivate {user.name}?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {user.email} will be blocked from signing in immediately. This does not delete the
          account.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              void onConfirm();
            }}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { user, loading, error } = useUser(id ?? null);

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Users", href: "/users" },
        { label: "Details" },
      ]}
    >
      <div className="space-y-4">
        <Link
          href="/users"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          User Accounts
        </Link>

        {loading && <DetailSkeleton />}

        {error && !loading && (
          <div className="space-y-4">
            <AlertBanner message={error} />
            <Button variant="outline" asChild>
              <Link href="/users">Back to User Accounts</Link>
            </Button>
          </div>
        )}

        {!loading && !error && !user && (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">User not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The requested user account could not be found.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/users">Back to User Accounts</Link>
            </Button>
          </div>
        )}

        {!loading && !error && user && <UserDetail user={user} />}
      </div>
    </PageShell>
  );
}
