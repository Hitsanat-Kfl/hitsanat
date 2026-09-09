import * as React from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  label?: string;
  error?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;

    return (
      <div className="flex items-center gap-3">
        <label
          htmlFor={switchId}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "bg-input peer-checked:bg-primary",
            error && "ring-2 ring-destructive",
            className
          )}
        >
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            disabled={disabled}
            className="peer sr-only"
            aria-invalid={error ? true : undefined}
            {...props}
          />
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
              "translate-x-0 peer-checked:translate-x-5"
            )}
          />
        </label>
        {label && (
          <label
            htmlFor={switchId}
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
Switch.displayName = "Switch";

export { Switch };
