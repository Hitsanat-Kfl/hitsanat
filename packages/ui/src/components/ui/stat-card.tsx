import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "./card";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, description, icon, trend, ...props }, ref) => (
    <Card ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-caption uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="mt-1 text-kpi font-bold tracking-tight text-foreground">{value}</p>
            {description && (
              <p className="mt-1 text-body-small text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1 text-body-small">
                {trend.direction === "up" && <TrendingUp className="h-3 w-3 text-success" />}
                {trend.direction === "down" && (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                {trend.direction === "neutral" && (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    trend.direction === "up" && "text-success",
                    trend.direction === "down" && "text-destructive",
                    trend.direction === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary sm:h-12 sm:w-12">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);
StatCard.displayName = "StatCard";

export { StatCard, type StatCardProps };
