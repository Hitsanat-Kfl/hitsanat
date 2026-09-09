# Card & Data Display Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a card system and data display primitives (StatCard, Table, List, Progress, Skeleton, StatusBadge) for the Hitsanat Kifl design system.

**Architecture:** Each component is a self-contained file in `packages/ui/src/components/ui/`. All use `React.forwardRef`, `cn()` utility, and `cva` for variants. Components follow existing conventions from `button.tsx` and `badge.tsx`. Exports are centralized through `components/index.ts` and `src/index.ts`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, class-variance-authority, clsx, tailwind-merge, lucide-react, `@repo/ui` package.

**Spec:** This plan implements the card system and data display primitives spec (8 components).

## Global Constraints
- React 19 + TypeScript 5.7+
- Tailwind CSS with HSL CSS variables for design tokens
- `cn()` from `../../lib/utils` for className merging
- `cva` for variant definitions
- `lucide-react` for icons
- Mobile-first: min touch targets 44px, horizontal scroll for tables
- All components: `React.forwardRef`, `displayName`, accessible ARIA
- Output path: `packages/ui/src/components/ui/`

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `packages/ui/src/components/ui/card.tsx` | Overwrite | Add variant support + CardAction |
| `packages/ui/src/components/ui/stat-card.tsx` | Create | KPI/metric display card |
| `packages/ui/src/components/ui/table.tsx` | Create | Data table with mobile scroll |
| `packages/ui/src/components/ui/list.tsx` | Create | List with leading/trailing slots |
| `packages/ui/src/components/ui/progress.tsx` | Create | Accessible progress bar |
| `packages/ui/src/components/ui/skeleton.tsx` | Create | Loading placeholders |
| `packages/ui/src/components/ui/status-badge.tsx` | Create | Semantic status badges |
| `packages/ui/src/components/index.ts` | Modify | Add new exports |
| `packages/ui/src/index.ts` | Modify | Add new exports |

---

### Task 1: Card (overwrite existing)

**Files:**
- Overwrite: `packages/ui/src/components/ui/card.tsx`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`
- Produces: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`, `CardProps`, `cardVariants`

- [ ] **Step 1: Write the updated card.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-colors",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        outlined: "border-border-strong shadow-none",
        elevated: "shadow-lg",
        interactive:
          "shadow-sm hover:shadow-md hover:border-primary/30 cursor-pointer active:scale-[0.99] transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center ml-auto", className)}
    {...props}
  />
));
CardAction.displayName = "CardAction";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  cardVariants,
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/card.tsx
git commit -m "feat(ui): add card variants and CardAction component"
```

---

### Task 2: StatCard

**Files:**
- Create: `packages/ui/src/components/ui/stat-card.tsx`

**Interfaces:**
- Consumes: `Card` from `./card`, `cn()` from `../../lib/utils`, lucide-react icons
- Produces: `StatCard`, `StatCardProps`

- [ ] **Step 1: Create stat-card.tsx**

```tsx
import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card } from "./card";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  neutral: {
    icon: Minus,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
} as const;

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, title, value, description, icon, trend, ...props },
    ref
  ) => {
    const trendInfo = trend ? trendConfig[trend.direction] : null;
    const TrendIcon = trendInfo?.icon;

    return (
      <Card
        ref={ref}
        className={cn("p-6", className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              {value}
            </p>
            {(description || trend) && (
              <div className="mt-2 flex items-center gap-2">
                {trend && trendInfo && TrendIcon && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      trendInfo.bg,
                      trendInfo.color
                    )}
                  >
                    <TrendIcon className="h-3 w-3" aria-hidden="true" />
                    {trend.value}%
                  </span>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/stat-card.tsx
git commit -m "feat(ui): add StatCard component for KPI dashboards"
```

---

### Task 3: Table

**Files:**
- Create: `packages/ui/src/components/ui/table.tsx`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`
- Produces: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableWrapper`, `TableProps`

- [ ] **Step 1: Create table.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const tableWrapperVariants = cva("w-full overflow-x-auto rounded-lg border", {
  variants: {
    variant: {
      default: "border-border",
      compact: "border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TableWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableWrapperVariants> {}

const TableWrapper = React.forwardRef<HTMLDivElement, TableWrapperProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(tableWrapperVariants({ variant }), className)}
      role="region"
      aria-label="Data table"
      tabIndex={0}
      {...props}
    />
  )
);
TableWrapper.displayName = "TableWrapper";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] whitespace-nowrap",
      "first:sticky first:left-0 first:z-10 first:bg-background",
      className
    )}
    scope="col"
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "first:sticky first:left-0 first:z-10 first:bg-background",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableWrapper,
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/table.tsx
git commit -m "feat(ui): add Table components with mobile scroll and sticky column"
```

---

### Task 4: List

**Files:**
- Create: `packages/ui/src/components/ui/list.tsx`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`
- Produces: `List`, `ListItem`, `ListProps`, `ListItemProps`

- [ ] **Step 1: Create list.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const listVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      divided: "",
      flush: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listVariants> {}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, variant, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(listVariants({ variant }), className)}
      role="list"
      {...props}
    />
  )
);
List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, leading, trailing, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-4 py-3 min-h-[44px]",
        "border-b border-border last:border-b-0",
        className
      )}
      {...props}
    >
      {leading && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
          {leading}
        </span>
      )}
      <span className="flex-1 min-w-0">{children}</span>
      {trailing && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
          {trailing}
        </span>
      )}
    </li>
  )
);
ListItem.displayName = "ListItem";

export { List, ListItem };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/list.tsx
git commit -m "feat(ui): add List and ListItem with leading/trailing slots"
```

---

### Task 5: Progress

**Files:**
- Create: `packages/ui/src/components/ui/progress.tsx`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`
- Produces: `Progress`, `ProgressProps`

- [ ] **Step 1: Create progress.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const progressTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-primary/20",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const progressFillVariants = cva(
  "h-full rounded-full transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        destructive: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressTrackVariants> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "destructive";
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant = "default",
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className="w-full">
        {showLabel && (
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-sm font-medium tabular-nums">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(progressTrackVariants({ size }), className)}
          {...props}
        >
          <div
            className={cn(progressFillVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/progress.tsx
git commit -m "feat(ui): add Progress bar with variants and ARIA support"
```

---

### Task 6: Skeleton

**Files:**
- Create: `packages/ui/src/components/ui/skeleton.tsx`

**Interfaces:**
- Consumes: `cn()` from `../../lib/utils`
- Produces: `Skeleton`, `SkeletonProps`

- [ ] **Step 1: Create skeleton.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const skeletonVariants = cva("animate-pulse bg-muted", {
  variants: {
    variant: {
      text: "h-4 w-full rounded",
      circular: "rounded-full",
      rectangular: "rounded-lg",
      card: "rounded-xl",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant }), className)}
      aria-hidden="true"
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/skeleton.tsx
git commit -m "feat(ui): add Skeleton loading placeholder with variants"
```

---

### Task 7: StatusBadge

**Files:**
- Create: `packages/ui/src/components/ui/status-badge.tsx`

**Interfaces:**
- Consumes: `Badge` from `./badge`, `cn()` from `../../lib/utils`, lucide-react icons
- Produces: `StatusBadge`, `StatusBadgeProps`, `StatusType`

- [ ] **Step 1: Create status-badge.tsx**

```tsx
import * as React from "react";
import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileEdit,
  Archive,
  Eye,
  PlayCircle,
  PauseCircle,
  Ban,
  Loader2,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge, type BadgeProps } from "./badge";

export type StatusType =
  | "draft"
  | "pending"
  | "active"
  | "inactive"
  | "expected"
  | "present"
  | "absent"
  | "excused"
  | "assigned"
  | "in-progress"
  | "completed"
  | "delayed"
  | "cancelled"
  | "published"
  | "archived";

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: BadgeProps["variant"];
  dotColor: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  draft: {
    label: "Draft",
    icon: FileEdit,
    variant: "secondary",
    dotColor: "bg-secondary-foreground/60",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    variant: "warning",
    dotColor: "bg-amber-500",
  },
  active: {
    label: "Active",
    icon: CheckCircle2,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    icon: XCircle,
    variant: "secondary",
    dotColor: "bg-secondary-foreground/60",
  },
  expected: {
    label: "Expected",
    icon: Eye,
    variant: "info",
    dotColor: "bg-blue-500",
  },
  present: {
    label: "Present",
    icon: UserCheck,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  absent: {
    label: "Absent",
    icon: UserX,
    variant: "destructive",
    dotColor: "bg-destructive",
  },
  excused: {
    label: "Excused",
    icon: ShieldCheck,
    variant: "info",
    dotColor: "bg-blue-500",
  },
  assigned: {
    label: "Assigned",
    icon: Circle,
    variant: "secondary",
    dotColor: "bg-secondary-foreground/60",
  },
  "in-progress": {
    label: "In Progress",
    icon: Loader2,
    variant: "info",
    dotColor: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  delayed: {
    label: "Delayed",
    icon: AlertCircle,
    variant: "warning",
    dotColor: "bg-amber-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    variant: "destructive",
    dotColor: "bg-destructive",
  },
  published: {
    label: "Published",
    icon: PlayCircle,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    variant: "secondary",
    dotColor: "bg-secondary-foreground/60",
  },
};

export interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "default" | "lg";
  showDot?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  default: "text-xs px-2.5 py-0.5 gap-1.5",
  lg: "text-sm px-3 py-1 gap-2",
} as const;

const iconSizeClasses = {
  sm: "h-3 w-3",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
} as const;

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, size = "default", showDot = false, className, ...props }, ref) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    const isInProgress = status === "in-progress";

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={cn(sizeClasses[size], className)}
        role="status"
        aria-label={`Status: ${config.label}`}
        {...props}
      >
        {showDot && (
          <span
            className={cn("inline-block h-2 w-2 rounded-full", config.dotColor)}
            aria-hidden="true"
          />
        )}
        <Icon
          className={cn(
            iconSizeClasses[size],
            isInProgress && "animate-spin"
          )}
          aria-hidden="true"
        />
        {config.label}
      </Badge>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusConfig };
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/status-badge.tsx
git commit -m "feat(ui): add StatusBadge with 15 semantic statuses"
```

---

### Task 8: Update exports

**Files:**
- Modify: `packages/ui/src/components/index.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: All components from Tasks 1-7
- Produces: Updated barrel exports

- [ ] **Step 1: Update components/index.ts**

```ts
export * from "./button";
export * from "./card";
export * from "./badge";
export * from "./avatar";
```

Replace with:

```ts
export * from "./button";
export * from "./card";
export * from "./badge";
export * from "./avatar";
export * from "./ui/stat-card";
export * from "./ui/table";
export * from "./ui/list";
export * from "./ui/progress";
export * from "./ui/skeleton";
export * from "./ui/status-badge";
```

- [ ] **Step 2: Update src/index.ts**

Add after the existing `form-field` export:

```ts
export * from "./components/ui/stat-card";
export * from "./components/ui/table";
export * from "./components/ui/list";
export * from "./components/ui/progress";
export * from "./components/ui/skeleton";
export * from "./components/ui/status-badge";
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/index.ts packages/ui/src/index.ts
git commit -m "feat(ui): export card, stat-card, table, list, progress, skeleton, status-badge"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run type check**

Run: `pnpm check-types` in `packages/ui`
Expected: No errors

- [ ] **Step 2: Run lint**

Run: `pnpm lint` in `packages/ui`
Expected: No errors or warnings

- [ ] **Step 3: Verify all exports resolve**

Check that importing each component from `@repo/ui` resolves correctly.

---

## Summary of Files

| # | File | Action |
|---|------|--------|
| 1 | `packages/ui/src/components/ui/card.tsx` | Overwrite |
| 2 | `packages/ui/src/components/ui/stat-card.tsx` | Create |
| 3 | `packages/ui/src/components/ui/table.tsx` | Create |
| 4 | `packages/ui/src/components/ui/list.tsx` | Create |
| 5 | `packages/ui/src/components/ui/progress.tsx` | Create |
| 6 | `packages/ui/src/components/ui/skeleton.tsx` | Create |
| 7 | `packages/ui/src/components/ui/status-badge.tsx` | Create |
| 8 | `packages/ui/src/components/index.ts` | Modify |
| 9 | `packages/ui/src/index.ts` | Modify |
