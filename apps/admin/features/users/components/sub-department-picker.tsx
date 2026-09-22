"use client";

import { Badge, Spinner } from "@repo/ui";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export interface SubDepartment {
  id: string;
  code: string;
  nameEn: string;
}

interface SubDepartmentPickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function SubDepartmentPicker({
  value,
  onChange,
  disabled = false,
}: SubDepartmentPickerProps) {
  const [options, setOptions] = useState<SubDepartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ data: SubDepartment[] }>("/sub-departments")
      .then((res) => {
        if (!cancelled) setOptions(res.data ?? []);
      })
      .catch(() => {
        /* keep empty */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
        <Spinner size="sm" />
        Loading sub-departments…
      </div>
    );
  }

  if (options.length === 0) {
    return <p className="py-2 text-sm text-muted-foreground">No sub-departments available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((sd) => {
        const selected = value.includes(sd.id);
        return (
          <button
            key={sd.id}
            type="button"
            disabled={disabled}
            onClick={() => toggle(sd.id)}
            className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors ${
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-foreground hover:bg-muted"
            }`}
            aria-pressed={selected}
          >
            {sd.code}
            <span className="ml-1.5 text-xs opacity-70">{sd.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
}
