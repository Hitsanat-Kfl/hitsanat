"use client";

import { Badge, Button, Skeleton, StatusBadge } from "@repo/ui";
import { ArrowRightLeft, Key, MoreVertical, Pencil, RefreshCw, ShieldOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ManagedUser } from "../hooks/use-users";

interface UserCardsProps {
  users: ManagedUser[];
  loading: boolean;
  onView: (user: ManagedUser) => void;
  onResetPassword: (user: ManagedUser) => void;
  onDeactivate: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onReactivate: (user: ManagedUser) => Promise<void>;
  onRevokeSessions: (user: ManagedUser) => Promise<void>;
  onHandover: (user: ManagedUser) => void;
}

function ActionMenu({
  user,
  onResetPassword,
  onDeactivate,
  onEdit,
  onReactivate,
  onRevokeSessions,
  onHandover,
}: {
  user: ManagedUser;
  onResetPassword: (user: ManagedUser) => void;
  onDeactivate: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onReactivate: (user: ManagedUser) => Promise<void>;
  onRevokeSessions: (user: ManagedUser) => Promise<void>;
  onHandover: (user: ManagedUser) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deactivated = user.status === "DEACTIVATED";
  const isLeadership =
    user.role === "SUPER_ADMIN" ||
    user.role === "CHAIRPERSON" ||
    user.role === "SUB_CHAIRPERSON" ||
    user.role === "SECRETARY";

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => setOpen(!open)}
        aria-label={`Actions for ${user.name}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {open ? <X className="h-4 w-4" /> : <MoreVertical className="h-4 w-4" />}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border bg-white shadow-md">
          <button
            type="button"
            onClick={() => {
              onEdit(user);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit User
          </button>
          {isLeadership && (
            <button
              type="button"
              onClick={() => {
                onHandover(user);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Handover
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onResetPassword(user);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <Key className="h-4 w-4" aria-hidden="true" />
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => {
              void onRevokeSessions(user);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
          >
            <ShieldOff className="h-4 w-4" aria-hidden="true" />
            Revoke Sessions
          </button>
          {deactivated ? (
            <button
              type="button"
              onClick={() => {
                void onReactivate(user);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Reactivate User
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onDeactivate(user);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
            >
              <ShieldOff className="h-4 w-4" aria-hidden="true" />
              Deactivate User
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center border-t px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-md border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-1 h-3 w-40" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
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
  const deactivated = user.status === "DEACTIVATED";
  const subDept = user.subDepartments.length > 0 ? user.subDepartments[0].code : null;

  return (
    <div className="rounded-md border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={() => onView(user)} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-foreground hover:underline">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </button>
        <ActionMenu
          user={user}
          onResetPassword={onResetPassword}
          onDeactivate={onDeactivate}
          onEdit={onEdit}
          onReactivate={onReactivate}
          onRevokeSessions={onRevokeSessions}
          onHandover={onHandover}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
        {subDept && <span className="text-xs text-muted-foreground">{subDept}</span>}
      </div>

      <div className="mt-2">
        <StatusBadge status={deactivated ? "inactive" : "active"} size="sm" />
      </div>
    </div>
  );
}

export function UserCards({
  users,
  loading,
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
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-foreground">No users found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
