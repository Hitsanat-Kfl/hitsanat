"use client";

import { Input, Select } from "@repo/ui";
import type { MemberFilters, SubDeptCode } from "../../lib/types";

const SUB_DEPARTMENTS: { value: SubDeptCode; label: string }[] = [
  { value: "TIMIHRT", label: "ትምህርት (Timihrt)" },
  { value: "MEZMUR", label: "መዝሙር (Mezmur)" },
  { value: "KUTITR", label: "ቁጥጥር (Kutitr)" },
  { value: "EKD", label: "እቅድ (Ekd)" },
  { value: "KINETIBEB", label: "ኪነ-ጥበብ (Kinetibeb)" },
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "GC"];

interface MemberFiltersProps {
  filters: MemberFilters;
  onFilterChange: (filters: MemberFilters) => void;
}

export function MemberFiltersBar({ filters, onFilterChange }: MemberFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Input
          placeholder="Search by name or phone..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="max-w-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.subDept || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, subDept: e.target.value || undefined, page: 1 })
          }
        >
          <option value="">All Departments</option>
          {SUB_DEPARTMENTS.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.yearOfStudy || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, yearOfStudy: e.target.value || undefined, page: 1 })
          }
        >
          <option value="">All Years</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>

        <Select
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              isActive: e.target.value === "" ? undefined : e.target.value === "true",
              page: 1,
            })
          }
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
      </div>
    </div>
  );
}
