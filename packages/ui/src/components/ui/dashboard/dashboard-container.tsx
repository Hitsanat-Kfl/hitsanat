import * as React from "react";
import { cn } from "../../../lib/utils";

interface DashboardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const DashboardContainer = React.forwardRef<HTMLDivElement, DashboardContainerProps>(
  ({ className, children, fullWidth = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full px-4 py-6 sm:px-6 lg:px-8",
        fullWidth ? "max-w-full" : "max-w-7xl mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DashboardContainer.displayName = "DashboardContainer";

export { DashboardContainer, type DashboardContainerProps };
