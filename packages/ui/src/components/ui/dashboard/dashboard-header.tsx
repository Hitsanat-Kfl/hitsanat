import * as React from "react";
import { cn } from "../../../lib/utils";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  date?: string;
  actions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}

const DashboardHeader = React.forwardRef<HTMLDivElement, DashboardHeaderProps>(
  ({ className, title, description, date, actions, secondaryActions, ...props }, ref) => (
    <div ref={ref} className={cn("mb-6 space-y-4", className)} {...props}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {date && <span className="text-sm text-muted-foreground tabular-nums">{date}</span>}
          {secondaryActions && <div className="flex items-center gap-2">{secondaryActions}</div>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  )
);
DashboardHeader.displayName = "DashboardHeader";

export { DashboardHeader, type DashboardHeaderProps };
