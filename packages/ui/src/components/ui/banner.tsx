import { type VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

const bannerVariants = cva("relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm", {
  variants: {
    variant: {
      default: "border-border bg-background text-foreground",
      success: "border-success/30 bg-success/10 text-success-foreground",
      warning: "border-warning/30 bg-warning/10 text-warning-foreground",
      error: "border-destructive/30 bg-destructive/10 text-destructive-foreground",
      info: "border-info/30 bg-info/10 text-info-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const bannerIconMap = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant = "default", dismissible, onDismiss, icon, children, ...props }, ref) => {
    const Icon = icon === undefined ? bannerIconMap[variant ?? "default"] : null;

    return (
      <div ref={ref} role="alert" className={cn(bannerVariants({ variant }), className)} {...props}>
        <div className="mt-0.5 shrink-0">{icon ?? (Icon && <Icon className="h-4 w-4" />)}</div>
        <div className="flex-1 text-sm">{children}</div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 min-h-[44px] min-w-[44px] md:min-h-[28px] md:min-w-[28px] flex items-center justify-center -m-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Banner.displayName = "Banner";

export { Banner, bannerVariants };
