"use client";

import { Avatar, Badge, Button } from "@repo/ui";
import Link from "next/link";
import type { Member } from "../../lib/types";

interface MemberTableProps {
  members: Member[];
  loading?: boolean;
}

export function MemberTable({ members, loading }: MemberTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((k) => (
          <div key={k} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No members found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <Link
          key={member.id}
          href={`/members/${member.id}`}
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <Avatar name={member.fullName} src={member.photoUrl ?? undefined} size="sm" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{member.fullName}</span>
              <span className="text-sm text-muted-foreground">({member.christianName})</span>
            </div>
            <div className="text-sm text-muted-foreground">{member.phoneNumber}</div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={member.isActive ? "default" : "secondary"}>
              {member.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {member.yearOfStudy}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
