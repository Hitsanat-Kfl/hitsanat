"use client";

import { Badge, Button, Card, CardContent, CardHeader } from "@repo/ui";
import Link from "next/link";
import type { Child, ParentWithRelation } from "../../lib/types";

interface ChildProfileCardProps {
  child: Child;
  parents?: ParentWithRelation[];
  showEditButton?: boolean;
}

export function ChildProfileCard({
  child,
  parents = [],
  showEditButton = true,
}: ChildProfileCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{child.fullName}</h2>
          <p className="text-muted-foreground">{child.christianName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={child.kutrGroup === "Kutr 1" ? "default" : "secondary"}>
              {child.kutrGroup}
            </Badge>
            <span className="text-sm text-muted-foreground">{child.collectionLocation}</span>
          </div>
        </div>
        {showEditButton && (
          <Link href={`/children/${child.id}/parents`}>
            <Button variant="outline" size="sm">
              Manage Parents
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p>{child.gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p>{new Date(child.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p>{child.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={child.isActive ? "default" : "secondary"}>
              {child.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {parents.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Parents</p>
            <div className="space-y-2">
              {parents.map((parent) => (
                <div
                  key={parent.childParentId}
                  className="flex items-center gap-2 p-2 rounded border"
                >
                  <span className="font-medium">{parent.fullName}</span>
                  <Badge variant="outline">{parent.relation}</Badge>
                  <span className="text-sm text-muted-foreground">{parent.phoneNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
