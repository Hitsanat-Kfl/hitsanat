import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = "Something went wrong",
      message,
      onRetry,
      retryText = "Try again",
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn("flex flex-col items-center justify-center py-12 text-center", className)}
      {...props}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>

      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{message}</p>

      {onRetry && (
        <Button variant="tertiary" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  )
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
export type { ErrorStateProps };
