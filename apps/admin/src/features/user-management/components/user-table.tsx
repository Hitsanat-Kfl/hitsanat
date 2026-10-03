"use client";

import {
  Avatar,
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import {
  ArrowRightLeft,
  Key,
  MoreVertical,
  Pencil,
  RefreshCw,
  ShieldOff,
  UserX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ManagedUser } from "../hooks/use-users";
import {
  AccountStatus,
  displayRole,
  formatCreatedDate,
  isLeadershipRole,
  SubDepartmentChips,
} from "./user-shared";

interface UserTableProps {
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

function RowActionMenu({
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
  const leadership = isLeadershipRole(user.role);

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

  const itemClass =
    "flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-[13px] text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none";

  return (
    <div ref={menuRef} className="relative flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
        aria-label={`Actions for ${user.name}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MoreVertical className="h-4 w-4" aria-hidden="true" />
      </Button>
      {open && (
        <div
          className="absolute bottom-full right-0 z-50 mb-2 min-w-[196px] overflow-hidden rounded-md border bg-white p-1 shadow-[0_4px_16px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              onEdit(user);
              setOpen(false);
            }}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            Edit
          </button>
          {leadership && (
            <button
              type="button"
              role="menuitem"
              className={itemClass}
              onClick={() => {
                onHandover(user);
                setOpen(false);
              }}
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              Handover
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              onResetPassword(user);
              setOpen(false);
            }}
          >
            <Key className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            Reset Password
          </button>
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              void onRevokeSessions(user);
              setOpen(false);
            }}
          >
            <ShieldOff className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            Revoke Sessions
          </button>
          <hr className="my-1 border-border" />
          {deactivated ? (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-destructive hover:text-destructive`}
              onClick={() => {
                void onReactivate(user);
                setOpen(false);
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Reactivate
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              className={`${itemClass} text-destructive hover:text-destructive`}
              onClick={() => {
                onDeactivate(user);
                setOpen(false);
              }}
            >
              <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
              Deactivate
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="w-[28%] pl-4 text-[11px] font-semibold uppercase tracking-wide">
              User
            </TableHead>
            <TableHead className="w-[14%] text-[11px] font-semibold uppercase tracking-wide">
              Role
            </TableHead>
            <TableHead className="w-[12%] text-[11px] font-semibold uppercase tracking-wide">
              Status
            </TableHead>
            <TableHead className="w-[16%] text-[11px] font-semibold uppercase tracking-wide">
              Sub-departments
            </TableHead>
            <TableHead className="w-[14%] text-[11px] font-semibold uppercase tracking-wide">
              Created
            </TableHead>
            <TableHead className="w-[76px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[0, 1, 2, 3, 4].map((i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="py-3 pl-4">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="mt-1 h-3 w-36" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <Skeleton className="h-5 w-24 rounded-full" />
              </TableCell>
              <TableCell className="py-3">
                <Skeleton className="h-3.5 w-16" />
              </TableCell>
              <TableCell className="py-3">
                <Skeleton className="h-5 w-16 rounded" />
              </TableCell>
              <TableCell className="py-3">
                <Skeleton className="h-3.5 w-20" />
              </TableCell>
              <TableCell className="py-3">
                <Skeleton className="ml-auto h-8 w-8 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyRow({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={6} className="py-14 text-center">
        <p className="text-sm font-medium text-foreground">
          {hasActiveFilters ? "No users match your search" : "No user accounts yet"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasActiveFilters
            ? "Try changing your search or filters."
            : "Create the first account to get started."}
        </p>
      </TableCell>
    </TableRow>
  );
}

export function UserTable({
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
}: UserTableProps) {
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="w-[28%] pl-4 text-[11px] font-semibold uppercase tracking-wide">
              User
            </TableHead>
            <TableHead className="w-[14%] text-[11px] font-semibold uppercase tracking-wide">
              Role
            </TableHead>
            <TableHead className="w-[12%] text-[11px] font-semibold uppercase tracking-wide">
              Status
            </TableHead>
            <TableHead className="w-[16%] text-[11px] font-semibold uppercase tracking-wide">
              Sub-departments
            </TableHead>
            <TableHead className="w-[14%] text-[11px] font-semibold uppercase tracking-wide">
              Created
            </TableHead>
            <TableHead className="w-[76px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <EmptyRow hasActiveFilters={hasActiveFilters} />
          ) : (
            users.map((user) => {
              const subDeptCodes = user.subDepartments.map((sd) => sd.code);
              return (
                <TableRow key={user.id} className="hover:bg-[#F9FAFB]">
                  <TableCell className="py-3 pl-4">
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="group flex w-full min-w-0 items-center gap-2.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Avatar name={user.name} src={user.image ?? undefined} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-foreground group-hover:underline group-hover:underline-offset-2">
                          {user.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="secondary"
                      className="max-w-full truncate text-[11px] font-medium"
                    >
                      {displayRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <AccountStatus status={user.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    <SubDepartmentChips codes={subDeptCodes} />
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                      {formatCreatedDate(user.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-3">
                    <RowActionMenu
                      user={user}
                      onResetPassword={onResetPassword}
                      onDeactivate={onDeactivate}
                      onEdit={onEdit}
                      onReactivate={onReactivate}
                      onRevokeSessions={onRevokeSessions}
                      onHandover={onHandover}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
