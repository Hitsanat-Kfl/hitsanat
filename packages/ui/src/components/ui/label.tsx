import * as React from "react";
import { cn } from "../../lib/utils";

export interface LabelProps extends React.ComponentProps<"label"> {
  error?: boolean;
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, error, required, children, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: Label is a reusable primitive, paired with htmlFor at usage site
      <label
        ref={ref}
        className={cn(
          "text-xs font-medium uppercase tracking-wider",
          error ? "text-destructive" : "text-foreground",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
