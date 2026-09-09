import * as React from "react";
import { cn } from "../../../lib/utils";
import { DashboardWidget, WidgetContent } from "./dashboard-widget";
import { Progress } from "../progress";
import type { ProgressData, WidgetState } from "../../../types/dashboard";

interface ProgressWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProgressData;
  state?: WidgetState;
  onRetry?: () => void;
  headerAction?: React.ReactNode;
}

const statusToProgressVariant = (
  status?: string
): "default" | "success" | "warning" | "destructive" => {
  switch (status) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "destructive":
      return "destructive";
    default:
      return "default";
  }
};

const ProgressWidget = React.forwardRef<HTMLDivElement, ProgressWidgetProps>(
  ({ className, data, state = "default", onRetry, headerAction, ...props }, ref) => (
    <DashboardWidget
      ref={ref}
      title={data.label}
      headerAction={headerAction}
      state={state}
      onRetry={onRetry}
      variant="outlined"
      className={cn("h-full", className)}
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {Math.round(data.percentage)}%
          </span>
          {data.deadline && (
            <span className="text-xs text-muted-foreground">Due {data.deadline}</span>
          )}
        </div>
        <Progress
          value={data.percentage}
          variant={statusToProgressVariant(data.status)}
          aria-label={`${data.label} progress`}
        />
        {(data.completed !== undefined || data.target !== undefined) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {data.completed !== undefined && (
              <span>
                <span className="font-medium text-foreground tabular-nums">{data.completed}</span>
                {data.target !== undefined && (
                  <>
                    {" / "}
                    <span className="tabular-nums">{data.target}</span>
                  </>
                )}
                {" completed"}
              </span>
            )}
          </div>
        )}
      </div>
    </DashboardWidget>
  )
);
ProgressWidget.displayName = "ProgressWidget";

export { ProgressWidget, type ProgressWidgetProps };
