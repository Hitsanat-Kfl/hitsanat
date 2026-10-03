"use client";

import { canManageAccounts } from "@/authorization";
import { useAuthUser } from "@/features/authentication";
import { useMember } from "@/features/member-management/hooks/use-members";
import { api } from "@/infrastructure/api/client";
import { PageShell } from "@/widgets/shell";
import { AlertDialog, EmptyState, ErrorState, useToast } from "@repo/ui";
import { ArrowLeft, ArrowRightLeft, KeyRound, RefreshCw, ShieldOff, UserX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import {
  LEADERSHIP_ROLE_SET,
  type ManagedUser,
  type UpdateUserPayload,
  useUser,
  useUserMutations,
} from "../hooks/use-users";
import { EditUserDialog } from "./edit-user-dialog";
import { HandoverDialog } from "./handover-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { TemporaryGrantsSection } from "./temporary-grants";
import { UserAdminActions, buildAdminActions } from "./user-admin-actions";
import {
  DetailSkeleton,
  type OverflowItem,
  OverflowMenu,
  PageHeading,
  PageTopBar,
  UserProfileHeader,
} from "./user-detail-identity";
import { UserDetailsTabs } from "./user-details-tabs";
import { UserQuickInfo } from "./user-quick-info";

const PAGE_DESCRIPTION =
  "View and manage user information, account status and administrative actions.";

/** Escape hatch back to the directory — a plain link, not a nested button. */
function BackToAccounts() {
  return (
    <Link
      href="/users"
      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to User Accounts
    </Link>
  );
}

function RecordShell({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <div className="px-0.5 md:px-2 lg:px-3">{children}</div>
    </PageShell>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const id = (params?.id as string | undefined) ?? null;
  const { user, loading, error, notFound, refresh } = useUser(id);
  const authUser = useAuthUser();
  const canManage = canManageAccounts(authUser?.globalRoles ?? []);
  const { toast } = useToast();

  const { member, loading: memberLoading, error: memberError } = useMember(user?.memberId ?? null);
  const mutations = useUserMutations(user?.id ?? null);

  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<ManagedUser | null>(null);

  const openEdit = () => setEditOpen(true);
  const openReset = () => setResetOpen(true);
  const openHandover = () => setHandoverOpen(true);
  const openRevoke = () => setRevokeOpen(true);

  // The dialogs catch these rejections and surface them inline, so the
  // handlers only own the success path.
  const handleUpdate = async (_userId: string, payload: UpdateUserPayload) => {
    await mutations.updateUser(payload);
    toast("Account updated.", "success");
  };

  const handleResetPassword = async (newPassword: string) => {
    await mutations.resetPassword(newPassword);
    toast(`Password reset for ${user?.email ?? "this account"}.`, "success");
  };

  const handleRevokeSessions = async () => {
    try {
      await mutations.revokeSessions();
      toast(`All live sessions for ${user?.email ?? "this account"} were revoked.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Session revocation failed.", "error");
    }
  };

  const handleDeactivate = async () => {
    try {
      await mutations.deactivate();
      toast(
        `Account deactivated — ${user?.email ?? "this account"} can no longer sign in.`,
        "success"
      );
      setDeactivateTarget(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Deactivation failed.", "error");
    }
  };

  const handleReactivate = async () => {
    try {
      await mutations.reactivate();
      toast(`Account reactivated — ${user?.email ?? "this account"} can sign in again.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Reactivation failed.", "error");
    }
  };

  const overflowItems: OverflowItem[] = user
    ? [
        { label: "Reset Password", icon: KeyRound, onClick: openReset },
        ...(LEADERSHIP_ROLE_SET.has(user.role)
          ? [{ label: "Transfer Leadership", icon: ArrowRightLeft, onClick: openHandover }]
          : []),
        { label: "Revoke Sessions", icon: ShieldOff, onClick: openRevoke },
        user.status === "DEACTIVATED"
          ? { label: "Reactivate", icon: RefreshCw, onClick: () => void handleReactivate() }
          : {
              label: "Deactivate",
              icon: UserX,
              destructive: true,
              onClick: () => setDeactivateTarget(user),
            },
      ]
    : [];

  const overflow =
    canManage && overflowItems.length > 0 ? <OverflowMenu items={overflowItems} /> : undefined;

  if (loading) {
    return (
      <RecordShell>
        <PageTopBar />
        <PageHeading description={PAGE_DESCRIPTION} />
        <DetailSkeleton />
      </RecordShell>
    );
  }

  if (notFound) {
    return (
      <RecordShell>
        <PageTopBar />
        <PageHeading description={PAGE_DESCRIPTION} />
        <div className="mx-auto max-w-xl py-4">
          <EmptyState
            title="User Not Found"
            description="The requested account could not be found."
            action={<BackToAccounts />}
          />
        </div>
      </RecordShell>
    );
  }

  if (error || !user) {
    return (
      <RecordShell>
        <PageTopBar />
        <PageHeading description={PAGE_DESCRIPTION} />
        <div className="mx-auto max-w-xl py-4">
          <ErrorState
            title="Unable to load user"
            message={error ?? "The requested user account is unavailable."}
            onRetry={refresh}
            retryText="Try Again"
          />
          <div className="flex justify-center">
            <BackToAccounts />
          </div>
        </div>
      </RecordShell>
    );
  }

  const actions = buildAdminActions({
    user,
    onEdit: openEdit,
    onResetPassword: openReset,
    onHandover: openHandover,
    onRevokeSessions: openRevoke,
    onDeactivate: () => setDeactivateTarget(user),
    onReactivate: () => void handleReactivate(),
  });

  return (
    <RecordShell>
      <PageTopBar overflow={overflow} />
      <PageHeading description={PAGE_DESCRIPTION} />

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-7 xl:col-span-4">
          <UserProfileHeader
            user={user}
            canManage={canManage}
            onEdit={openEdit}
            overflow={overflow}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-3">
          <UserQuickInfo user={user} />
        </div>

        {canManage && (
          <div className="lg:col-span-12 xl:col-span-4 xl:col-start-9">
            <UserAdminActions actions={actions} />
          </div>
        )}
      </div>

      <UserDetailsTabs
        user={user}
        member={member}
        memberLoading={memberLoading}
        memberError={memberError}
        canManage={canManage}
        onEdit={openEdit}
        onLinkMember={openEdit}
      />

      {/* BR-035: temporary grants — full width, Super Admin only (null otherwise). */}
      <div className="mt-4 md:mt-5">
        <TemporaryGrantsSection userId={user.id} />
      </div>

      {editOpen && (
        <EditUserDialog user={user} onOpenChange={setEditOpen} onUpdate={handleUpdate} />
      )}

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
            await api.post("/users", payload);
            toast("Successor account created.", "success");
          }}
          onDemoteOutgoing={async (userId) => {
            await api.patch(`/users/${userId}`, { role: "MEMBER_REGULAR" });
            toast("Outgoing leader demoted to regular member.", "success");
          }}
          onDeactivateOutgoing={async (userId) => {
            await api.post(`/users/${userId}/deactivate`, {});
            toast("Outgoing leader deactivated.", "success");
            setHandoverOpen(false);
          }}
        />
      )}

      {revokeOpen && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open) setRevokeOpen(false);
          }}
          onConfirm={() => {
            void handleRevokeSessions();
          }}
          title={`Revoke sessions for ${user.name}?`}
          description="Every active session for this account will be invalidated immediately. The user will have to sign in again on all devices. The account itself stays active."
          confirmText="Revoke Sessions"
        />
      )}

      {deactivateTarget && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open) setDeactivateTarget(null);
          }}
          onConfirm={() => {
            void handleDeactivate();
          }}
          variant="destructive"
          title={`Deactivate ${deactivateTarget.name}?`}
          description={`${deactivateTarget.email} will be blocked from signing in immediately. This does not delete the account.`}
          confirmText="Deactivate"
        />
      )}
    </RecordShell>
  );
}
