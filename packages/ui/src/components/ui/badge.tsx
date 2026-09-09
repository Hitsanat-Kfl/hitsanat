import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground border-current",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        info: "border-transparent bg-info/15 text-info",
        dot: "border-transparent bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const dotColorMap: Record<string, string> = {
  default: "bg-primary",
  secondary: "bg-secondary-foreground/60",
  destructive: "bg-destructive",
  outline: "bg-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  dot: "bg-secondary-foreground/60",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

function Badge({ className, variant, showDot = false, children, ...props }: BadgeProps) {
  const isDot = variant === "dot" || showDot;
  const dotColor = dotColorMap[variant ?? "default"] ?? dotColorMap.default;

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      // biome-ignore lint/a11y/useSemanticElements: Badge is a status indicator, not output
      role="status"
      {...props}
    >
      {isDot && (
        <span
          className={cn("mr-1.5 inline-block h-2 w-2 rounded-full", dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
Badge.displayName = "Badge";

export { Badge, badgeVariants };
