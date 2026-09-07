import * as React from "react";
import { cn } from "../../lib/utils";
import { Label } from "./label";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, helperText, required, children, className }, ref) => {
    const errorId = React.useId();
    const helperId = React.useId();

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(" ");

    const childArray = React.Children.toArray(children);
    const enhancedChildren = childArray.map((child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          "aria-describedby": describedBy || undefined,
          "aria-invalid": error ? true : undefined,
        });
      }
      return child;
    });

    return (
      <div ref={ref} className={cn("space-y-1.5", className)}>
        {label && (
          <Label error={!!error} required={required}>
            {label}
          </Label>
        )}
        {enhancedChildren}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
