import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  Eye,
  Timer,
  Ban,
  Send,
  Archive,
} from "lucide-react";
import { cn } from "../../lib/utils";

const statusConfig = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: Circle },
  pending: { label: "Pending", color: "bg-warning/15 text-warning", icon: Clock },
  active: { label: "Active", color: "bg-success/15 text-success", icon: CheckCircle2 },
  inactive: { label: "Inactive", color: "bg-muted text-muted-foreground", icon: MinusCircle },
  expected: { label: "Expected", color: "bg-info/15 text-info", icon: Eye },
  present: { label: "Present", color: "bg-success/15 text-success", icon: CheckCircle2 },
  absent: { label: "Absent", color: "bg-destructive/15 text-destructive", icon: XCircle },
  excused: { label: "Excused", color: "bg-warning/15 text-warning", icon: AlertCircle },
  assigned: { label: "Assigned", color: "bg-info/15 text-info", icon: Send },
  "in-progress": { label: "In Progress", color: "bg-primary/15 text-primary", icon: Timer },
  completed: { label: "Completed", color: "bg-success/15 text-success", icon: CheckCircle2 },
  delayed: { label: "Delayed", color: "bg-warning/15 text-warning", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-destructive/15 text-destructive", icon: Ban },
  published: { label: "Published", color: "bg-success/15 text-success", icon: Send },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", icon: Archive },
} as const;

type StatusType = keyof typeof statusConfig;

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: StatusType;
  showDot?: boolean;
  showIcon?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size, showDot = false, showIcon = true, ...props }, ref) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        ref={ref}
        // biome-ignore lint/a11y/useSemanticElements: StatusBadge is a visual indicator, not output
        role="status"
        className={cn(statusBadgeVariants({ size }), config.color, className)}
        {...props}
      >
        {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
        {showIcon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
        <span>{config.label}</span>
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusConfig, type StatusBadgeProps, type StatusType };
