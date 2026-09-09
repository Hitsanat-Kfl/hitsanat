import * as React from "react";
import { cn } from "../../../lib/utils";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";
import { Progress } from "../progress";
import { StatusBadge } from "../status-badge";
import { Badge } from "../badge";
import { ClipboardList } from "lucide-react";
import type { PlanningData, WidgetState } from "../../../types/dashboard";

interface PlanningWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: PlanningData[];
  state?: WidgetState;
  onRetry?: () => void;
  maxItems?: number;
  headerAction?: React.ReactNode;
}

const statusToProgressVariant = (
  status: PlanningData["status"]
): "default" | "success" | "warning" | "destructive" => {
  switch (status) {
    case "completed":
      return "success";
    case "delayed":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

const PlanningWidget = React.forwardRef<HTMLDivElement, PlanningWidgetProps>(
  (
    {
      className,
      title = "Planning",
      items,
      state = "default",
      onRetry,
      maxItems = 4,
      headerAction,
      ...props
    },
    ref
  ) => {
    const displayItems = items.slice(0, maxItems);

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
        {displayItems.length === 0 ? (
          <WidgetEmpty
            title="No plans"
            description="No active plans."
            icon={<ClipboardList className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-4">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "space-y-2 rounded-lg border p-3",
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
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.period}</span>
                      {item.responsibleRole && (
                        <>
                          <span className="text-border">|</span>
                          <span>{item.responsibleRole}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <Progress
                  value={item.progress}
                  variant={statusToProgressVariant(item.status)}
                  aria-label={`${item.title} progress`}
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground tabular-nums">
                      {item.progress}%
                    </span>
                    {" complete"}
                  </span>
                  {item.activityCount > 0 && (
                    <span>
                      {item.completedCount ?? 0}/{item.activityCount} activities
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardWidget>
    );
  }
);
PlanningWidget.displayName = "PlanningWidget";

export { PlanningWidget, type PlanningWidgetProps };
