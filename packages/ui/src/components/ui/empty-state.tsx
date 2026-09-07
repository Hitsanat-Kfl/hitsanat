import * as React from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center py-12 text-center", className)}
      {...props}
    >
      {icon && <div className="mb-4 text-muted-foreground/50">{icon}</div>}

      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>

      {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>}

      {action && <div>{action}</div>}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
export type { EmptyStateProps };
