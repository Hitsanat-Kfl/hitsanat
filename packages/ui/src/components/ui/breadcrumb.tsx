import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, ...props }, ref) => {
    const [showMenu, setShowMenu] = React.useState(false);

    const visibleItems = React.useMemo(() => {
      if (items.length <= 3) return items;
      return items.slice(-2);
    }, [items]);

    const hiddenItems = React.useMemo(() => {
      if (items.length <= 3) return [];
      return items.slice(0, -2);
    }, [items]);

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn("relative", className)} {...props}>
        <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
          {hiddenItems.length > 0 && (
            <li className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Show hidden breadcrumbs"
                aria-expanded={showMenu}
                className={cn(
                  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-1 hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "sm:min-h-auto sm:min-w-auto sm:p-0"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowMenu(false);
                    }}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className={cn(
                      "absolute left-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                      "animate-in fade-in-0 zoom-in-95"
                    )}
                  >
                    {hiddenItems.map((item) => (
                      <MenuItem
                        key={item.href ?? item.label}
                        item={item}
                        onSelect={() => setShowMenu(false)}
                      />
                    ))}
                  </div>
                </>
              )}
            </li>
          )}

          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const actualIndex = hiddenItems.length + index;

            return (
              <li key={actualIndex} className="flex items-center gap-1">
                {(hiddenItems.length > 0 || index > 0) && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                )}

                {isLast || !item.href ? (
                  <span
                    className={cn(
                      "font-medium",
                      isLast ? "text-foreground" : "text-muted-foreground"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-[44px] items-center rounded-md px-1 py-1 transition-colors hover:text-foreground sm:min-h-auto",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

function MenuItem({ item, onSelect }: { item: BreadcrumbItem; onSelect: () => void }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        role="menuitem"
        onClick={onSelect}
        className={cn(
          "flex min-h-[44px] items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground",
          "sm:min-h-auto"
        )}
      >
        {item.label}
      </a>
    );
  }

  return (
    <span className="flex min-h-[44px] items-center rounded-sm px-2 py-1.5 text-sm text-foreground sm:min-h-auto">
      {item.label}
    </span>
  );
}

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
