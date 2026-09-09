import * as React from "react";
import { cn } from "../../../lib/utils";
import type { WidgetSize } from "../../../types/dashboard";

interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const sizeClasses: Record<WidgetSize, string> = {
  sm: "col-span-1",
  md: "col-span-1 sm:col-span-1 md:col-span-1",
  lg: "col-span-1 sm:col-span-2",
  xl: "col-span-1 sm:col-span-2 md:col-span-2",
  full: "col-span-full",
};

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DashboardGrid.displayName = "DashboardGrid";

interface DashboardGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: WidgetSize;
  span?: number;
}

const DashboardGridItem = React.forwardRef<HTMLDivElement, DashboardGridItemProps>(
  ({ className, children, size = "md", span, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        span
          ? `col-span-1 sm:col-span-${Math.min(span, 2)} lg:col-span-${Math.min(span, 3)}`
          : sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DashboardGridItem.displayName = "DashboardGridItem";

export {
  DashboardGrid,
  DashboardGridItem,
  sizeClasses,
  type DashboardGridProps,
  type DashboardGridItemProps,
};
