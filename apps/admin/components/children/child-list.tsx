"use client";

import { Badge, Input, Select } from "@repo/ui";
import Link from "next/link";
import type { Child, CollectionLocation, KutrGroup } from "../../lib/types";

const KUTR_GROUPS: KutrGroup[] = ["Kutr 1", "Kutr 2"];
const COLLECTION_LOCATIONS: CollectionLocation[] = [
  "Apartama",
  "Gende Boy",
  "Gende Je",
  "Cobalt",
  "Bate",
];

interface ChildListProps {
  items: Child[];
  loading?: boolean;
}

export function ChildList({ items, loading }: ChildListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {["sk-1", "sk-2", "sk-3"].map((k) => (
          <div key={k} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No children found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((child) => (
        <Link
          key={child.id}
          href={`/children/${child.id}`}
          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{child.fullName}</span>
              <span className="text-sm text-muted-foreground">({child.christianName})</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {child.gender} · {new Date(child.dateOfBirth).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={child.kutrGroup === "Kutr 1" ? "default" : "secondary"}>
              {child.kutrGroup}
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {child.collectionLocation}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
