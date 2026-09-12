import * as React from "react";
import { cn } from "../../../lib/utils";
import type { StatusSummaryItem, WidgetState } from "../../../types/dashboard";
import { StatusBadge } from "../status-badge";
import { DashboardWidget, WidgetContent } from "./dashboard-widget";

interface StatusSummaryWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: StatusSummaryItem[];
  state?: WidgetState;
  onRetry?: () => void;
  headerAction?: React.ReactNode;
}

const StatusSummaryWidget = React.forwardRef<HTMLDivElement, StatusSummaryWidgetProps>(
  (
    {
      className,
      title = "Status Summary",
      items,
      state = "default",
      onRetry,
      headerAction,
      ...props
    },
    ref
  ) => {
    const total = items.reduce((sum, item) => sum + item.count, 0);

    return (
      <DashboardWidget
        ref={ref}
        title={title}
        headerAction={headerAction}
        state={state}
        onRetry={onRetry}
        variant="outlined"
        className={cn("h-full", className)}
        {...props}
      >
        <div className="space-y-3">
          {items.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div
                key={item.status}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 transition-colors",
                  item.onClick && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={item.onClick}
                role={item.onClick ? "button" : undefined}
                tabIndex={item.onClick ? 0 : undefined}
                onKeyDown={
                  item.onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          item.onClick?.();
                        }
                      }
                    : undefined
                }
              >
                <StatusBadge status={item.status} size="sm" showIcon={false} showDot />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <span className="text-sm font-medium tabular-nums text-foreground">
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/60 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardWidget>
    );
  }
);
StatusSummaryWidget.displayName = "StatusSummaryWidget";

export { StatusSummaryWidget, type StatusSummaryWidgetProps };
