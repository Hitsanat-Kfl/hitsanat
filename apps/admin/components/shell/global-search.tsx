"use client";

import * as React from "react";
import { Search, FileText, Users, Calendar, Settings } from "lucide-react";
import { Button, Input, EmptyState } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { useShell } from "./shell-context";
import { useI18n } from "./i18n";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "page" | "child" | "event" | "setting";
  icon: React.ReactNode;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Dashboard",
    description: "Main dashboard",
    href: "/",
    type: "page",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "Children Management",
    description: "Manage children records",
    href: "/children",
    type: "child",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Schedule",
    description: "Weekly schedule",
    href: "/schedule",
    type: "event",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: "4",
    title: "Settings",
    description: "System settings",
    href: "/settings",
    type: "setting",
    icon: <Settings className="h-4 w-4" />,
  },
];

const typeLabels: Record<SearchResult["type"], string> = {
  page: "Pages",
  child: "Children",
  event: "Events",
  setting: "Settings",
};

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useShell();
  const { t } = useI18n();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return mockResults;
    const lower = query.toLowerCase();
    return mockResults.filter(
      (r) => r.title.toLowerCase().includes(lower) || r.description.toLowerCase().includes(lower)
    );
  }, [query]);

  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const result of filteredResults) {
      const label = typeLabels[result.type];
      if (!groups[label]) groups[label] = [];
      groups[label].push(result);
    }
    return groups;
  }, [filteredResults]);

  // Keyboard shortcut: Cmd/Ctrl + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  React.useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setSearchOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setSearchOpen(false);
        }}
        aria-hidden="true"
      />

      {/* Search dialog */}
      <div className="fixed inset-x-4 top-[10vh] mx-auto max-w-lg">
        {/* biome-ignore lint/a11y/useSemanticElements: Custom search dialog overlay */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
          className={cn(
            "rounded-xl border bg-background shadow-xl",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("search.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0 h-auto py-0"
              aria-label="Search"
            />
            <kbd className="hidden sm:inline-flex items-center rounded-md border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {filteredResults.length === 0 ? (
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title={t("search.no-results")}
                className="py-6"
              />
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedResults).map(([groupLabel, results]) => (
                  <div key={groupLabel}>
                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {groupLabel}
                    </p>
                    <ul className="space-y-0.5">
                      {results.map((result) => (
                        <li key={result.id}>
                          <a
                            href={result.href}
                            onClick={() => setSearchOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                              "hover:bg-accent hover:text-accent-foreground",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              "min-h-[44px]"
                            )}
                          >
                            <span className="text-muted-foreground">{result.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <span className="mr-2">⌘K</span> to toggle search
          </div>
        </div>
      </div>
    </div>
  );
}

interface SearchTriggerProps {
  className?: string;
}

export function SearchTrigger({ className }: SearchTriggerProps) {
  const { setSearchOpen } = useShell();
  const { t } = useI18n();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSearchOpen(true)}
      className={cn("h-9 gap-2 text-muted-foreground", "min-h-[44px] md:min-h-9", className)}
      aria-label={t("search.placeholder")}
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline text-xs">{t("search.placeholder")}</span>
      <kbd className="hidden lg:inline-flex items-center rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ml-2">
        ⌘K
      </kbd>
    </Button>
  );
}
