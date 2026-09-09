import * as React from "react";
import { cn } from "../../lib/utils";

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: "default" | "divided" | "flush";
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        "w-full",
        variant === "divided" && "divide-y divide-border",
        variant === "flush" && "divide-y divide-border [&>li]:px-0",
        variant === "default" && "space-y-1",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, leading, trailing, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-body transition-colors hover:bg-muted/50 sm:text-body",
        className
      )}
      {...props}
    >
      {leading && <div className="flex shrink-0 items-center">{leading}</div>}
      <div className="min-w-0 flex-1">{children}</div>
      {trailing && <div className="flex shrink-0 items-center">{trailing}</div>}
    </li>
  )
);
ListItem.displayName = "ListItem";

interface ListItemTextProps extends React.HTMLAttributes<HTMLDivElement> {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}

const ListItemText = React.forwardRef<HTMLDivElement, ListItemTextProps>(
  ({ className, primary, secondary, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props}>
      <p className="truncate text-body font-medium text-foreground">{primary}</p>
      {secondary && (
        <p className="mt-0.5 truncate text-caption text-muted-foreground">{secondary}</p>
      )}
    </div>
  )
);
ListItemText.displayName = "ListItemText";

export { List, ListItem, ListItemText, type ListProps, type ListItemProps, type ListItemTextProps };
