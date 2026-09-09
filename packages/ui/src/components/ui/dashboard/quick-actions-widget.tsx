import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { DashboardWidget, WidgetHeader, WidgetContent } from "./dashboard-widget";
import type { QuickAction, WidgetState } from "../../../types/dashboard";

interface QuickActionsWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions: QuickAction[];
  state?: WidgetState;
  onRetry?: () => void;
}

const QuickActionsWidget = React.forwardRef<HTMLDivElement, QuickActionsWidgetProps>(
  ({ className, title = "Quick Actions", actions, state = "default", onRetry, ...props }, ref) => (
    <DashboardWidget
      ref={ref}
      title={title}
      state={state}
      onRetry={onRetry}
      variant="outlined"
      className={cn("h-full", className)}
      {...props}
    >
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant ?? "outline"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className="min-h-[44px]"
          >
            {action.icon && <span className="mr-1.5">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </DashboardWidget>
  )
);
QuickActionsWidget.displayName = "QuickActionsWidget";

export { QuickActionsWidget, type QuickActionsWidgetProps };
