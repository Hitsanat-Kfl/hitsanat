import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.ComponentProps<"select"> {
  error?: boolean;
  success?: boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, success, disabled, placeholder, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-11 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-8 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:text-sm",
          error && "border-destructive focus-visible:ring-destructive",
          success && "border-success focus-visible:ring-success",
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
