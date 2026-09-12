import { Clock, UserCheck, UserX, Users } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import type { AttendanceData, WidgetState } from "../../../types/dashboard";
import { Progress } from "../progress";
import { DashboardWidget, WidgetContent } from "./dashboard-widget";

interface AttendanceWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AttendanceData;
  state?: WidgetState;
  onRetry?: () => void;
  headerAction?: React.ReactNode;
  labels?: {
    expected?: string;
    present?: string;
    absent?: string;
    excused?: string;
    rate?: string;
  };
}

const AttendanceWidget = React.forwardRef<HTMLDivElement, AttendanceWidgetProps>(
  ({ className, data, state = "default", onRetry, headerAction, labels, ...props }, ref) => {
    const rate =
      data.attendanceRate ??
      (data.expected > 0 ? Math.round((data.present / data.expected) * 100) : 0);

    const progressVariant = rate >= 80 ? "success" : rate >= 50 ? "warning" : "destructive";

    return (
      <DashboardWidget
        ref={ref}
        title="Attendance"
        headerAction={headerAction}
        state={state}
        onRetry={onRetry}
        variant="outlined"
        className={cn("h-full", className)}
        {...props}
      >
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold tabular-nums text-foreground">{rate}%</span>
              {labels?.rate && (
                <span className="ml-2 text-xs text-muted-foreground">{labels.rate}</span>
              )}
            </div>
            {data.period && <span className="text-xs text-muted-foreground">{data.period}</span>}
          </div>

          <Progress
            value={rate}
            variant={progressVariant}
            aria-label={`Attendance rate: ${rate}%`}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{labels?.expected ?? "Expected"}</p>
                <p className="text-sm font-medium tabular-nums">{data.expected}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-success/5 p-2">
              <UserCheck className="h-4 w-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">{labels?.present ?? "Present"}</p>
                <p className="text-sm font-medium tabular-nums text-success">{data.present}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-destructive/5 p-2">
              <UserX className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">{labels?.absent ?? "Absent"}</p>
                <p className="text-sm font-medium tabular-nums text-destructive">{data.absent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-warning/5 p-2">
              <Clock className="h-4 w-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">{labels?.excused ?? "Excused"}</p>
                <p className="text-sm font-medium tabular-nums text-warning">{data.excused}</p>
              </div>
            </div>
          </div>

          {data.location && <p className="text-xs text-muted-foreground">{data.location}</p>}
        </div>
      </DashboardWidget>
    );
  }
);
AttendanceWidget.displayName = "AttendanceWidget";

export { AttendanceWidget, type AttendanceWidgetProps };
