import * as React from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "peer h-5 w-5 shrink-0 rounded border border-primary bg-transparent shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=checked]]:bg-primary [&[data-state=checked]]:text-primary-foreground",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "cursor-pointer text-sm font-medium leading-none",
              disabled && "cursor-not-allowed opacity-50",
              error && "text-destructive"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
