import { Activity } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ActivityItem, WidgetState } from "../../../types/dashboard";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import { Separator } from "../separator";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";

interface ActivityWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: ActivityItem[];
  state?: WidgetState;
  onRetry?: () => void;
  maxItems?: number;
  headerAction?: React.ReactNode;
}

const statusVariantMap: Record<string, "default" | "success" | "warning" | "destructive" | "info"> =
  {
    default: "default",
    success: "success",
    warning: "warning",
    destructive: "destructive",
    info: "info",
  };

const ActivityWidget = React.forwardRef<HTMLDivElement, ActivityWidgetProps>(
  (
    {
      className,
      title = "Recent Activity",
      items,
      state = "default",
      onRetry,
      maxItems = 5,
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
            title="No activity"
            description="No recent activity to display."
            icon={<Activity className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-0">
            {displayItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-start gap-3 py-3">
                  <Avatar
                    src={item.actorAvatar}
                    name={item.actor}
                    size="sm"
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.actor}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>
                      {item.entity && (
                        <>
                          {" "}
                          <span className="font-medium">{item.entity}</span>
                        </>
                      )}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <time className="text-xs text-muted-foreground tabular-nums">
                        {item.timestamp}
                      </time>
                      {item.status && item.status !== "default" && (
                        <Badge
                          variant={statusVariantMap[item.status] ?? "default"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {index < displayItems.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        )}
      </DashboardWidget>
    );
  }
);
ActivityWidget.displayName = "ActivityWidget";

export { ActivityWidget, type ActivityWidgetProps };
