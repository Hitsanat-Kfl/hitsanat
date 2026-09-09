import * as React from "react";
import { cn } from "../../../lib/utils";

interface DashboardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardSection = React.forwardRef<HTMLDivElement, DashboardSectionProps>(
  ({ className, title, description, action, children, ...props }, ref) => (
    <section ref={ref} className={cn("space-y-4", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
            )}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="flex shrink-0 items-center">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
);
DashboardSection.displayName = "DashboardSection";

export { DashboardSection, type DashboardSectionProps };
