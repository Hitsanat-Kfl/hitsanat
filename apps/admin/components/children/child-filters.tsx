"use client";

import { Input, Select } from "@repo/ui";
import type { ChildFilters, CollectionLocation, KutrGroup } from "../../lib/types";

const KUTR_GROUPS: KutrGroup[] = ["Kutr 1", "Kutr 2"];
const COLLECTION_LOCATIONS: CollectionLocation[] = [
  "Apartama",
  "Gende Boy",
  "Gende Je",
  "Cobalt",
  "Bate",
];

interface ChildFiltersBarProps {
  filters: ChildFilters;
  onFilterChange: (filters: ChildFilters) => void;
}

export function ChildFiltersBar({ filters, onFilterChange }: ChildFiltersBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          placeholder="Search by name..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="max-w-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.kutrGroup || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              kutrGroup: (e.target.value || undefined) as KutrGroup,
              page: 1,
            })
          }
        >
          <option value="">All Kutr Groups</option>
          {KUTR_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </Select>

        <Select
          value={filters.collectionLocation || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              collectionLocation: (e.target.value || undefined) as CollectionLocation,
              page: 1,
            })
          }
        >
          <option value="">All Locations</option>
          {COLLECTION_LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
