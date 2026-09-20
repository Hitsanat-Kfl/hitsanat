"use client";

import { Badge, Input, Spinner } from "@repo/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api-client";

export interface PickedMember {
  id: string;
  fullName: string;
  phone: string | null;
}

interface MemberPickerProps {
  /** Currently linked member (mirrored from the parent's state). */
  value: PickedMember | null;
  onChange: (member: PickedMember | null) => void;
  /** Search term is sent to GET /members?search=... */
  placeholder?: string;
  disabled?: boolean;
}

export interface MemberApiRow {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  phone?: string | null;
  phoneNumber?: string | null;
}

/**
 * Flexible member label extraction — the API's detail and list shapes
 * differ, so accept every known field combination.
 */
export function formatMemberLabel(row: MemberApiRow): { name: string; phone: string | null } {
  const name =
    row.fullName ?? row.name ?? [row.firstName, row.lastName].filter(Boolean).join(" ") ?? row.id;
  const phone = row.phone ?? row.phoneNumber ?? null;
  return { name, phone };
}

function labelOf(row: MemberApiRow): { name: string; phone: string | null } {
  return formatMemberLabel(row);
}

/**
 * PE-03 / FR-13.8: searchable member picker for linking leadership
 * accounts to registered members. Searches by name or phone via the
 * members list API instead of asking the operator to paste a UUID.
 */
export function MemberPicker({
  value,
  onChange,
  placeholder = "Search member by name or phone…",
  disabled = false,
}: MemberPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PickedMember[]>([]);
  const [selected, setSelected] = useState<PickedMember | null>(null);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // The chip mirrors the parent's value so externally linked members
  // (e.g. the user's existing member link) render without a re-pick.
  useEffect(() => {
    setSelected((prev) => {
      if (prev === value) return prev;
      if (
        prev &&
        value &&
        prev.id === value.id &&
        prev.fullName === value.fullName &&
        prev.phone === value.phone
      ) {
        return prev;
      }
      return value;
    });
  }, [value]);

  // Debounced search against the members API.
  useEffect(() => {
    if (selected) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await api.get<{ data: MemberApiRow[] }>(
          `/members?search=${encodeURIComponent(trimmed)}&limit=10`
        );
        setResults(
          (response.data ?? []).map((row) => {
            const { name, phone } = labelOf(row);
            return { id: row.id, fullName: name, phone };
          })
        );
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = useMemo(() => {
    if (!selected) return null;
    return selected.phone ? `${selected.fullName} · ${selected.phone}` : selected.fullName;
  }, [selected]);

  const pick = (member: PickedMember) => {
    setSelected(member);
    onChange(member);
    setQuery("");
    setOpen(false);
  };

  const clear = () => {
    setSelected(null);
    onChange(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {selected ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{selectedLabel}</p>
            <p className="truncate text-xs text-muted-foreground">{selected.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Linked</Badge>
            <button
              type="button"
              onClick={clear}
              disabled={disabled}
              className="text-xs underline underline-offset-2"
              aria-label="Clear selected member"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
            aria-label="Search members"
          />
          {searching && (
            <div className="absolute right-3 top-2.5">
              <Spinner size="sm" />
            </div>
          )}
          {open && results.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
              {results.map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => pick(member)}
                    className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-muted"
                  >
                    <span className="text-sm font-medium">{member.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.phone ?? member.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
