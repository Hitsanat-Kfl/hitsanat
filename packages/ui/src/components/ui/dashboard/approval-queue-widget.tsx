import * as React from "react";
import { cn } from "../../../lib/utils";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import { Button } from "../button";
import { Separator } from "../separator";
import { ClipboardCheck } from "lucide-react";
import type { ApprovalQueueItem, WidgetState } from "../../../types/dashboard";

interface ApprovalQueueWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: ApprovalQueueItem[];
  state?: WidgetState;
  onRetry?: () => void;
  maxItems?: number;
  headerAction?: React.ReactNode;
}

const statusConfig: Record<
  string,
  { variant: "default" | "success" | "warning" | "destructive" | "info"; label: string }
> = {
  pending: { variant: "warning", label: "Pending" },
  active: { variant: "info", label: "In Review" },
  completed: { variant: "success", label: "Approved" },
  draft: { variant: "default", label: "Draft" },
};

const ApprovalQueueWidget = React.forwardRef<HTMLDivElement, ApprovalQueueWidgetProps>(
  (
    {
      className,
      title = "Approval Queue",
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
            title="No pending approvals"
            description="All caught up."
            icon={<ClipboardCheck className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-0">
            {displayItems.map((item, index) => {
              const statusInfo = statusConfig[item.status] ?? statusConfig.pending;

              return (
                <React.Fragment key={item.id}>
                  <div className="flex items-start gap-3 py-3">
                    <Avatar
                      src={item.requesterAvatar}
                      name={item.requester}
                      size="sm"
                      className="mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.requester}</span>
                        <span className="tabular-nums">{item.date}</span>
                      </div>
                    </div>
                    <Badge variant={statusInfo.variant} className="shrink-0 text-[10px]">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  {item.status === "pending" && (item.onApprove || item.onReject) && (
                    <div className="flex items-center gap-2 pb-3 pl-11">
                      {item.onApprove && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={item.onApprove}
                          className="h-8 text-xs"
                        >
                          Approve
                        </Button>
                      )}
                      {item.onReject && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={item.onReject}
                          className="h-8 text-xs"
                        >
                          Reject
                        </Button>
                      )}
                      {item.onView && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={item.onView}
                          className="h-8 text-xs"
                        >
                          View
                        </Button>
                      )}
                    </div>
                  )}
                  {index < displayItems.length - 1 && <Separator />}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </DashboardWidget>
    );
  }
);
ApprovalQueueWidget.displayName = "ApprovalQueueWidget";

export { ApprovalQueueWidget, type ApprovalQueueWidgetProps };
