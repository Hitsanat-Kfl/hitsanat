import * as React from "react";
import { cn } from "../../../lib/utils";
import type { KPIData, WidgetState } from "../../../types/dashboard";
import { Skeleton } from "../skeleton";
import { StatCard } from "../stat-card";
import { DashboardWidget, WidgetContent, WidgetHeader } from "./dashboard-widget";

interface KPIWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  data: KPIData;
  state?: WidgetState;
  onRetry?: () => void;
}

const KPIWidget = React.forwardRef<HTMLDivElement, KPIWidgetProps>(
  ({ className, data, state = "default", onRetry, ...props }, ref) => (
    <DashboardWidget
      ref={ref}
      state={state}
      onRetry={onRetry}
      variant="outlined"
      className={cn("h-full", className)}
      {...props}
    >
      <StatCard
        title={data.label}
        value={data.value}
        description={data.description}
        icon={data.icon}
        trend={data.trend}
        className="border-0 shadow-none p-0"
      />
      {data.comparison && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground px-0">
          <span className="tabular-nums font-medium text-foreground">{data.comparison.value}</span>
          {data.comparison.label && <span>{data.comparison.label}</span>}
        </div>
      )}
    </DashboardWidget>
  )
);
KPIWidget.displayName = "KPIWidget";

interface KPIRowProps {
  items: KPIData[];
  state?: WidgetState;
  className?: string;
}

function KPIRow({ items, state = "default", className }: KPIRowProps) {
  if (state === "loading") {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <div key={`kpi-skeleton-${i}`} className="rounded-xl border bg-card p-6">
            <Skeleton className="h-3 w-1/3 mb-2" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <KPIWidget key={item.label} data={item} />
      ))}
    </div>
  );
}

export { KPIWidget, KPIRow, type KPIWidgetProps, type KPIRowProps };
