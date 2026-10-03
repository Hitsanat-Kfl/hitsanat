"use client";

import { Avatar, Badge, Button, Drawer, DrawerContent, Skeleton } from "@repo/ui";
import {
  ArrowRightLeft,
  Key,
  MoreVertical,
  Pencil,
  RefreshCw,
  ShieldOff,
  User,
  UserX,
} from "lucide-react";
import { useState } from "react";
import type { ManagedUser } from "../hooks/use-users";
import { AccountStatus, displayRoleTitle, isLeadershipRole } from "./user-shared";

interface UserCardsProps {
  users: ManagedUser[];
  loading: boolean;
  hasActiveFilters: boolean;
  onView: (user: ManagedUser) => void;
  onResetPassword: (user: ManagedUser) => void;
  onDeactivate: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onReactivate: (user: ManagedUser) => Promise<void>;
  onRevokeSessions: (user: ManagedUser) => Promise<void>;
  onHandover: (user: ManagedUser) => void;
}

function ActionSheet({
  user,
  open,
  onOpenChange,
  onResetPassword,
  onDeactivate,
  onEdit,
  onReactivate,
  onRevokeSessions,
  onHandover,
  onView,
}: {
  user: ManagedUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetPassword: (user: ManagedUser) => void;
  onDeactivate: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onReactivate: (user: ManagedUser) => Promise<void>;
  onRevokeSessions: (user: ManagedUser) => Promise<void>;
  onHandover: (user: ManagedUser) => void;
  onView: (user: ManagedUser) => void;
}) {
  const deactivated = user.status === "DEACTIVATED";
  const leadership = isLeadershipRole(user.role);

  const itemClass =
    "flex min-h-[56px] w-full items-start gap-3 rounded-lg px-2.5 py-3 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none";

  const run = (action: () => void | Promise<void>) => {
    void action();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} side="bottom">
      <DrawerContent
        aria-label="More actions"
        className="max-h-[85%] rounded-t-2xl border-t bg-white pb-[max(16px,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mt-1.5 h-1 w-9 rounded-full bg-[#D0D5DD]" aria-hidden="true" />
        <div className="px-3 pb-2">
          <div className="flex items-center gap-3 px-2 pb-3.5 pt-3">
            <Avatar name={user.name} src={user.image ?? undefined} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-foreground">{user.name}</p>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <button type="button" className={itemClass} onClick={() => run(() => onEdit(user))}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">Edit User</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Update name, email, role, or member link
              </span>
            </span>
          </button>

          {leadership && (
            <button type="button" className={itemClass} onClick={() => run(() => onHandover(user))}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">Handover</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  Transfer this leadership post to another member
                </span>
              </span>
            </button>
          )}

          <button
            type="button"
            className={itemClass}
            onClick={() => run(() => onResetPassword(user))}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
              <Key className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">Reset Password</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Issue a temporary password for first sign-in
              </span>
            </span>
          </button>

          <button
            type="button"
            className={itemClass}
            onClick={() => run(() => onRevokeSessions(user))}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
              <ShieldOff className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">Revoke Sessions</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Force sign-out on all active devices
              </span>
            </span>
          </button>

          <button type="button" className={itemClass} onClick={() => run(() => onView(user))}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
              <User className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">View Profile</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Open full account details and security
              </span>
            </span>
          </button>

          <hr className="my-1.5 border-border" />

          {deactivated ? (
            <button
              type="button"
              className={`${itemClass} text-destructive hover:text-destructive`}
              onClick={() => run(() => onReactivate(user))}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FEF3F2] text-destructive">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">Reactivate User</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  Restore sign-in for this account
                </span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              className={`${itemClass} text-destructive hover:text-destructive`}
              onClick={() => run(() => onDeactivate(user))}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FEF3F2] text-destructive">
                <UserX className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">Deactivate User</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  Block sign-in immediately · account is kept
                </span>
              </span>
            </button>
          )}

          <button
            type="button"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-lg border border-input bg-white text-[15px] font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-3.5">
      <div className="flex items-start gap-2.5">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-1 h-3 w-40" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="mt-3 h-3.5 w-36" />
      <Skeleton className="mt-2 h-3.5 w-16" />
    </div>
  );
}

function UserCard({
  user,
  onView,
  onResetPassword,
  onDeactivate,
  onEdit,
  onReactivate,
  onRevokeSessions,
  onHandover,
}: {
  user: ManagedUser;
  onView: (user: ManagedUser) => void;
  onResetPassword: (user: ManagedUser) => void;
  onDeactivate: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onReactivate: (user: ManagedUser) => Promise<void>;
  onRevokeSessions: (user: ManagedUser) => Promise<void>;
  onHandover: (user: ManagedUser) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const codes = user.subDepartments.map((sd) => sd.code);
  const visibleCodes = codes.slice(0, 2);
  const remaining = codes.length - visibleCodes.length;
  const leadership = isLeadershipRole(user.role);

  return (
    <>
      <article className="relative rounded-lg border bg-white p-3.5">
        <div className="flex items-start gap-2.5">
          <Avatar name={user.name} src={user.image ?? undefined} size="lg" />
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onView(user)}
              className="block w-full min-w-0 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block truncate text-[15px] font-semibold text-foreground hover:underline hover:underline-offset-2">
                {user.name}
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                {user.email}
              </span>
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1 -mt-1 h-11 w-11 shrink-0 text-muted-foreground"
            onClick={() => setSheetOpen(true)}
            aria-label={`More actions for ${user.name}`}
            aria-haspopup="dialog"
          >
            <MoreVertical className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <p className="mt-2 text-[13px] text-secondary-foreground">
          <strong className="font-medium text-foreground">{displayRoleTitle(user.role)}</strong>
          {visibleCodes.length > 0 && <> · {visibleCodes.join(", ")}</>}
          {remaining > 0 && <> +{remaining}</>}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <AccountStatus status={user.status} />
          {leadership && (
            <Badge variant="secondary" className="h-[22px] text-[11px] font-medium">
              Leadership
            </Badge>
          )}
        </div>
      </article>

      <ActionSheet
        user={user}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onResetPassword={onResetPassword}
        onDeactivate={onDeactivate}
        onEdit={onEdit}
        onReactivate={onReactivate}
        onRevokeSessions={onRevokeSessions}
        onHandover={onHandover}
        onView={onView}
      />
    </>
  );
}

export function UserCards({
  users,
  loading,
  hasActiveFilters = false,
  onView,
  onResetPassword,
  onDeactivate,
  onEdit,
  onReactivate,
  onRevokeSessions,
  onHandover,
}: UserCardsProps) {
  if (loading) {
    return (
      <div className="space-y-2.5">
        {[0, 1, 2].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-white px-4 py-12 text-center">
        <p className="text-sm font-medium text-foreground">
          {hasActiveFilters ? "No users match your search" : "No user accounts yet"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasActiveFilters
            ? "Try changing your search or filters."
            : "Create the first account to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onView={onView}
          onResetPassword={onResetPassword}
          onDeactivate={onDeactivate}
          onEdit={onEdit}
          onReactivate={onReactivate}
          onRevokeSessions={onRevokeSessions}
          onHandover={onHandover}
        />
      ))}
    </div>
  );
}
