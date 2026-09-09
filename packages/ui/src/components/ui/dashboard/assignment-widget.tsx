import * as React from "react";
import { cn } from "../../../lib/utils";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";
import { Avatar } from "../avatar";
import { StatusBadge } from "../status-badge";
import { Badge } from "../badge";
import { Separator } from "../separator";
import { ClipboardList } from "lucide-react";
import type { AssignmentItem, WidgetState } from "../../../types/dashboard";

interface AssignmentWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: AssignmentItem[];
  state?: WidgetState;
  onRetry?: () => void;
  maxItems?: number;
  headerAction?: React.ReactNode;
}

const priorityConfig: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" }
> = {
  low: { label: "Low", variant: "info" },
  medium: { label: "Medium", variant: "warning" },
  high: { label: "High", variant: "destructive" },
};

const AssignmentWidget = React.forwardRef<HTMLDivElement, AssignmentWidgetProps>(
  (
    {
      className,
      title = "Assignments",
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
            title="No assignments"
            description="Nothing assigned yet."
            icon={<ClipboardList className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-0">
            {displayItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  className={cn(
                    "flex items-start gap-3 py-3",
                    item.onClick && "cursor-pointer -mx-6 px-6 hover:bg-muted/50"
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
                  <Avatar
                    src={item.assigneeAvatar}
                    name={item.assignee}
                    size="sm"
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.assignee}</span>
                      {item.deadline && <span className="tabular-nums">Due {item.deadline}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={item.status} size="sm" />
                    {item.priority && item.priority !== "medium" && (
                      <Badge
                        variant={priorityConfig[item.priority]?.variant ?? "default"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {priorityConfig[item.priority]?.label}
                      </Badge>
                    )}
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
AssignmentWidget.displayName = "AssignmentWidget";

export { AssignmentWidget, type AssignmentWidgetProps };
