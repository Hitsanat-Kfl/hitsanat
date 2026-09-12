"use client";

import { Avatar, Badge, Button, Card, CardContent, CardHeader, Separator } from "@repo/ui";
import Link from "next/link";
import type { Member } from "../../lib/types";

interface MemberProfileCardProps {
  member: Member;
  showEditButton?: boolean;
}

export function MemberProfileCard({ member, showEditButton = true }: MemberProfileCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar name={member.fullName} src={member.photoUrl ?? undefined} size="lg" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{member.fullName}</h2>
          <p className="text-muted-foreground">{member.christianName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={member.isActive ? "default" : "secondary"}>
              {member.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-sm text-muted-foreground">{member.yearOfStudy}</span>
          </div>
        </div>
        {showEditButton && (
          <Link href={`/members/${member.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
            <p>{member.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Academic Department</p>
            <p>{member.academicDepartment}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Campus</p>
            <p>{member.campus}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p>{member.gender}</p>
          </div>
          {member.telegramUsername && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telegram</p>
              <p>@{member.telegramUsername}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date Joined</p>
            <p>{new Date(member.dateJoined).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
