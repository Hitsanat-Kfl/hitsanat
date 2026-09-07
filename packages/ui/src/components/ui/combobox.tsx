import * as React from "react";
import { cn } from "../../lib/utils";

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  emptyMessage?: string;
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  multiple = false,
  disabled = false,
  error = false,
  className,
  emptyMessage = "No results found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedValues = React.useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    return value ? [value as string] : [];
  }, [value, multiple]);

  const filtered = React.useMemo(() => {
    if (!query) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onValueChange?.(next);
    } else {
      onValueChange?.(optionValue);
      setOpen(false);
    }
    inputRef.current?.focus();
  };

  const removeValue = (removeVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onValueChange?.(value.filter((v) => v !== removeVal));
    }
  };

  const selectedLabels = selectedValues
    .map((v) => options.find((opt) => opt.value === v)?.label)
    .filter(Boolean);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        // biome-ignore lint/a11y/useSemanticElements: Custom combobox uses button with listbox
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="combobox-listbox"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex min-h-[44px] w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive" : "border-input",
          open && "ring-2 ring-ring"
        )}
      >
        <span className="flex flex-wrap gap-1 min-w-0">
          {selectedLabels.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {multiple &&
            selectedLabels.map((label, i) => (
              <span
                key={selectedValues[i]}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => removeValue(selectedValues[i], e)}
                  className="rounded-full p-0.5 hover:bg-secondary-foreground/20"
                  aria-label={`Remove ${label}`}
                >
                  ×
                </button>
              </span>
            ))}
          {!multiple && selectedLabels.length > 0 && <span>{selectedLabels[0]}</span>}
        </span>
        <svg
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="p-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {/* biome-ignore lint/a11y/useSemanticElements: Custom combobox listbox - not a native select */}
          {/* biome-ignore lint/a11y/useFocusableInteractive: listbox is scrollable container, options are focusable */}
          <div
            role="listbox"
            id="combobox-listbox"
            aria-multiselectable={multiple}
            className="max-h-48 overflow-auto"
          >
            {filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
            )}
            {filtered.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  // biome-ignore lint/a11y/useSemanticElements: option uses button for better keyboard support
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "min-h-[44px] md:min-h-[36px]"
                  )}
                >
                  {multiple && (
                    <span
                      className={cn(
                        "absolute left-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input"
                      )}
                    >
                      {isSelected && (
                        <svg
                          aria-hidden="true"
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                  )}
                  {!multiple && isSelected && (
                    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
