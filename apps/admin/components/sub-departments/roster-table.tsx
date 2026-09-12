"use client";

import { Badge } from "@repo/ui";
import Link from "next/link";
import type { SubDepartmentMember } from "../../lib/types";

interface RosterTableProps {
  members: SubDepartmentMember[];
  loading?: boolean;
}

export function RosterTable({ members, loading }: RosterTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
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
        <p className="text-muted-foreground">No members assigned to this department</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <Link
          key={member.memberId}
          href={`/members/${member.memberId}`}
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{member.memberName}</span>
              <span className="text-sm text-muted-foreground">({member.christianName})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={member.isPrimary ? "default" : "secondary"}>
              {member.role || "Member"}
            </Badge>
            {member.isPrimary && (
              <Badge variant="outline" className="text-xs">
                Primary
              </Badge>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
