import * as React from "react";
import { cn } from "../../lib/utils";

export interface RadioProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  error?: boolean;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    return (
      <div className="flex items-center gap-3">
        <input
          type="radio"
          id={radioId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "peer h-5 w-5 shrink-0 rounded-full border border-primary bg-transparent shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=checked]]:border-primary [&[data-state=checked]]:bg-primary",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
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
Radio.displayName = "Radio";

export { Radio };
