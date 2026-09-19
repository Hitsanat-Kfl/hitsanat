import * as React from "react";
import { cn } from "../../../lib/utils";
import { useLocalizedText } from "./i18n-context";

interface DashboardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardSection = React.forwardRef<HTMLDivElement, DashboardSectionProps>(
  ({ className, title, titleAm, description, descriptionAm, action, children, ...props }, ref) => {
    // Phase 06 §22: the shell's locale switcher must reach dashboard
    // headings. English title is the fallback when no Amharic is provided.
    const t = useLocalizedText();
    const heading = t(title, titleAm);
    const headingDescription = t(description, descriptionAm);

    return (
      <section ref={ref} className={cn("space-y-4", className)} {...props}>
        {(heading || action) && (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              {heading && (
                <h2 className="text-lg font-semibold text-foreground tracking-tight">{heading}</h2>
              )}
              {headingDescription && (
                <p className="mt-0.5 text-sm text-muted-foreground">{headingDescription}</p>
              )}
            </div>
            {action && <div className="flex shrink-0 items-center">{action}</div>}
          </div>
        )}
        {children}
      </section>
    );
  }
);
DashboardSection.displayName = "DashboardSection";

export { DashboardSection, type DashboardSectionProps };
