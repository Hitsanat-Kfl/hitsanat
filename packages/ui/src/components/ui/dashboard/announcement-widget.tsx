import { Megaphone } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import type { AnnouncementItem, WidgetState } from "../../../types/dashboard";
import { Badge } from "../badge";
import { Separator } from "../separator";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";

interface AnnouncementWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: AnnouncementItem[];
  state?: WidgetState;
  onRetry?: () => void;
  maxItems?: number;
  headerAction?: React.ReactNode;
}

const priorityConfig: Record<
  string,
  { variant: "default" | "success" | "warning" | "destructive" | "info"; label: string }
> = {
  low: { variant: "info", label: "Low" },
  medium: { variant: "warning", label: "Medium" },
  high: { variant: "destructive", label: "High" },
};

const AnnouncementWidget = React.forwardRef<HTMLDivElement, AnnouncementWidgetProps>(
  (
    {
      className,
      title = "Announcements",
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
            title="No announcements"
            description="No new announcements."
            icon={<Megaphone className="h-8 w-8" />}
          />
        ) : (
          <div className="space-y-0">
            {displayItems.map((item, index) => {
              const pConfig = priorityConfig[item.priority] ?? priorityConfig.medium;

              return (
                <React.Fragment key={item.id}>
                  <div
                    className={cn(
                      "flex items-start gap-3 py-3",
                      item.onClick && "cursor-pointer -mx-6 px-6 hover:bg-muted/50",
                      !item.isRead && "bg-primary-muted/30"
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
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-sm truncate",
                            item.isRead ? "text-foreground" : "font-medium text-foreground"
                          )}
                        >
                          {item.title}
                        </p>
                        {!item.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {item.summary}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.author}</span>
                        <span className="tabular-nums">{item.date}</span>
                      </div>
                    </div>
                    <Badge variant={pConfig.variant} className="shrink-0 text-[10px]">
                      {pConfig.label}
                    </Badge>
                  </div>
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
AnnouncementWidget.displayName = "AnnouncementWidget";

export { AnnouncementWidget, type AnnouncementWidgetProps };
