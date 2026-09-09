import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "../card";
import { Skeleton } from "../skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../button";
import type { WidgetState } from "../../../types/dashboard";

// ============================================================
// WidgetHeader
// ============================================================

interface WidgetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  action?: React.ReactNode;
}

function WidgetHeader({ title, description, action, className, ...props }: WidgetHeaderProps) {
  return (
    <CardHeader className={cn("pb-2", className)} {...props}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && <CardDescription className="mt-0.5">{description}</CardDescription>}
        </div>
        {action && <CardAction>{action}</CardAction>}
      </div>
    </CardHeader>
  );
}

// ============================================================
// WidgetContent
// ============================================================

interface WidgetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function WidgetContent({ className, ...props }: WidgetContentProps) {
  return <CardContent className={cn("pt-0", className)} {...props} />;
}

// ============================================================
// WidgetFooter
// ============================================================

interface WidgetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function WidgetFooter({ className, ...props }: WidgetFooterProps) {
  return <CardFooter className={cn("pt-0", className)} {...props} />;
}

// ============================================================
// Widget Loading State
// ============================================================

interface WidgetLoadingProps {
  rows?: number;
  className?: string;
}

function WidgetLoading({ rows = 3, className }: WidgetLoadingProps) {
  return (
    <div className={cn("space-y-3 p-6", className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      {rows > 3 &&
        Array.from({ length: rows - 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <Skeleton key={`skeleton-row-${i}`} className="h-3 w-full" />
        ))}
    </div>
  );
}

// ============================================================
// Widget Empty State
// ============================================================

interface WidgetEmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function WidgetEmpty({
  title = "No data",
  description = "There is nothing to display yet.",
  icon,
  action,
  className,
}: WidgetEmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 text-center", className)}>
      {icon && <div className="mb-3 text-muted-foreground/50">{icon}</div>}
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      {description && <p className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

// ============================================================
// Widget Error State
// ============================================================

interface WidgetErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

function WidgetError({
  title = "Something went wrong",
  message = "Failed to load data.",
  onRetry,
  retryText = "Try again",
  className,
}: WidgetErrorProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center justify-center py-8 text-center", className)}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="tertiary" size="sm" onClick={onRetry} className="mt-3">
          <RefreshCw className="h-3 w-3" />
          {retryText}
        </Button>
      )}
    </div>
  );
}

// ============================================================
// DashboardWidget (base composition)
// ============================================================

interface DashboardWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  state?: WidgetState;
  onRetry?: () => void;
  variant?: "default" | "outlined" | "elevated";
}

const DashboardWidget = React.forwardRef<HTMLDivElement, DashboardWidgetProps>(
  (
    {
      className,
      title,
      titleAm,
      description,
      headerAction,
      footer,
      state = "default",
      onRetry,
      variant = "default",
      children,
      ...props
    },
    ref
  ) => {
    if (state === "loading") {
      return (
        <Card ref={ref} variant={variant} className={cn("overflow-hidden", className)} {...props}>
          <WidgetLoading />
        </Card>
      );
    }

    if (state === "error") {
      return (
        <Card ref={ref} variant={variant} className={cn("overflow-hidden", className)} {...props}>
          <WidgetError onRetry={onRetry} />
        </Card>
      );
    }

    if (state === "empty") {
      return (
        <Card ref={ref} variant={variant} className={cn("overflow-hidden", className)} {...props}>
          {title && <WidgetHeader title={title} titleAm={titleAm} action={headerAction} />}
          <WidgetEmpty />
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        variant={variant}
        className={cn(
          "overflow-hidden",
          state === "disabled" && "opacity-50 pointer-events-none",
          className
        )}
        aria-disabled={state === "disabled"}
        {...props}
      >
        {title && (
          <WidgetHeader
            title={title}
            titleAm={titleAm}
            description={description}
            action={headerAction}
          />
        )}
        <WidgetContent>{children}</WidgetContent>
        {footer && <WidgetFooter>{footer}</WidgetFooter>}
      </Card>
    );
  }
);
DashboardWidget.displayName = "DashboardWidget";

export {
  DashboardWidget,
  WidgetHeader,
  WidgetContent,
  WidgetFooter,
  WidgetLoading,
  WidgetEmpty,
  WidgetError,
  type DashboardWidgetProps,
  type WidgetHeaderProps,
  type WidgetContentProps,
  type WidgetFooterProps,
  type WidgetLoadingProps,
  type WidgetEmptyProps,
  type WidgetErrorProps,
};
