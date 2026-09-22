"use client";

import {
  Badge,
  Button,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { ArrowRightLeft, Key, MoreVertical, Pencil, RefreshCw, ShieldOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ManagedUser } from "../hooks/use-users";

interface UserTableProps {
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
        className="h-8 w-8"
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
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[0, 1, 2, 3, 4].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function UserTable({
  users,
  loading,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-12 text-center">
                <p className="text-sm font-medium text-foreground">No users found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search or filters.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const deactivated = user.status === "DEACTIVATED";
              const subDept = user.subDepartments.length > 0 ? user.subDepartments[0].code : null;
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="min-w-0 text-left hover:underline"
                    >
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      {subDept && <p className="mt-0.5 text-xs text-muted-foreground">{subDept}</p>}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={deactivated ? "inactive" : "active"} size="sm" />
                  </TableCell>
                  <TableCell>
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
