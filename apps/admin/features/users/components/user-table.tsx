"use client";

import {
  Badge,
  Button,
  Spinner,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { useState } from "react";
import type { ManagedUser } from "../hooks/use-users";

interface UserTableProps {
  users: ManagedUser[];
  loading: boolean;
  onResetPassword: (user: ManagedUser) => void;
  onDeactivate: (user: ManagedUser) => Promise<void>;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

export function UserTable({ users, loading, onResetPassword, onDeactivate }: UserTableProps) {
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-busy="true">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Sub-departments</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No accounts found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.emailVerified ? "active" : "inactive"} size="sm" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.subDepartments.length === 0 ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.subDepartments.map((sd) => (
                        <Badge key={sd.subDepartmentId} variant="outline">
                          {sd.code}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetPassword(user)}
                      aria-label={`Reset password for ${user.name}`}
                    >
                      Reset password
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={deactivatingId === user.id}
                      onClick={async () => {
                        setDeactivatingId(user.id);
                        try {
                          await onDeactivate(user);
                        } finally {
                          setDeactivatingId(null);
                        }
                      }}
                      aria-label={`Deactivate ${user.name}`}
                    >
                      Deactivate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
