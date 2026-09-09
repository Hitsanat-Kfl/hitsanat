import * as React from "react";
import { cn } from "../../../lib/utils";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";
import { Badge } from "../badge";
import { Separator } from "../separator";
import { CalendarDays, MapPin, User } from "lucide-react";
import type { EventItem, WidgetState } from "../../../types/dashboard";

interface UpcomingEventsWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items: EventItem[];
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

const UpcomingEventsWidget = React.forwardRef<HTMLDivElement, UpcomingEventsWidgetProps>(
  (
    {
      className,
      title = "Upcoming Events",
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
            title="No upcoming events"
            description="No events scheduled."
            icon={<CalendarDays className="h-8 w-8" />}
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
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-muted text-primary">
                    <span className="text-[10px] font-bold leading-none uppercase">
                      {new Date(item.date).toLocaleDateString("en", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold leading-none tabular-nums">
                      {new Date(item.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      {item.status && item.status !== "default" && (
                        <Badge
                          variant={statusVariantMap[item.status] ?? "default"}
                          className="shrink-0 text-[10px] px-1.5 py-0"
                        >
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {item.time && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {item.time}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      )}
                      {(item.responsiblePerson || item.responsibleRole) && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.responsiblePerson ?? item.responsibleRole}
                        </span>
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
UpcomingEventsWidget.displayName = "UpcomingEventsWidget";

export { UpcomingEventsWidget, type UpcomingEventsWidgetProps };
