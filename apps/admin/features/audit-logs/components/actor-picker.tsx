"use client";

import { Input, Spinner } from "@repo/ui";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api-client";

export interface PickedActor {
  id: string;
  name: string;
  email: string;
}

interface ActorPickerProps {
  /** Selected actor user id (mirrors filters.operatorId). */
  value: string | null;
  onChange: (actor: PickedActor | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface ActorApiRow {
  id: string;
  name?: string;
  email?: string;
}

/**
 * FR-13.10: searchable actor filter for the audit trail. Searches admin
 * accounts by name or email via the users list API instead of asking the
 * operator to paste a raw user UUID.
 */
export function ActorPicker({
  value,
  onChange,
  placeholder = "Filter by actor (name or email)…",
  disabled = false,
}: ActorPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PickedActor[]>([]);
  const [selected, setSelected] = useState<PickedActor | null>(null);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search against the users API.
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
        const response = await api.get<{ data: ActorApiRow[] }>(
          `/users?search=${encodeURIComponent(trimmed)}&limit=10`
        );
        setResults(
          (response.data ?? []).map((row) => ({
            id: row.id,
            name: row.name ?? row.id,
            email: row.email ?? "",
          }))
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

  const selectedLabel = selected ? `${selected.name} · ${selected.email}` : null;

  const pick = (actor: PickedActor) => {
    setSelected(actor);
    onChange(actor);
    setQuery("");
    setOpen(false);
  };

  const clear = () => {
    setSelected(null);
    onChange(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative sm:max-w-xs">
      {selected ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <p className="min-w-0 truncate text-sm">{selectedLabel}</p>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="ml-3 shrink-0 text-xs underline underline-offset-2"
            aria-label="Clear selected actor"
          >
            Change
          </button>
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
            aria-label="Filter by actor"
          />
          {searching && (
            <div className="absolute right-3 top-2.5">
              <Spinner size="sm" />
            </div>
          )}
          {open && results.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
              {results.map((actor) => (
                <li key={actor.id}>
                  <button
                    type="button"
                    onClick={() => pick(actor)}
                    className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-muted"
                  >
                    <span className="text-sm font-medium">{actor.name}</span>
                    <span className="text-xs text-muted-foreground">{actor.email}</span>
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
