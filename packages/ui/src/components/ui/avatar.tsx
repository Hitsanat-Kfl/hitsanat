import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-muted-foreground/50",
  away: "bg-amber-500",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "default" | "lg" | "xl";
  showStatus?: boolean;
  status?: "online" | "offline" | "away";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name,
      size = "default",
      showStatus = false,
      status = "online",
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);
    const showImage = src && !imgError;
    const initials = name ? getInitials(name) : "?";

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
          avatarSizes[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-medium text-muted-foreground select-none">{initials}</span>
        )}

        {showStatus && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
              size === "sm"
                ? "h-2 w-2"
                : size === "lg" || size === "xl"
                  ? "h-3.5 w-3.5"
                  : "h-2.5 w-2.5",
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 3, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visible = childArray.slice(0, max);
    const remaining = childArray.length - max;

    return (
      <div ref={ref} className={cn("flex items-center -space-x-2", className)} {...props}>
        {visible.map((child, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: position is stable in avatar group
            key={`avatar-${i}`}
            className="relative ring-2 ring-background rounded-full"
            style={{ zIndex: max - i }}
          >
            {child}
          </div>
        ))}

        {remaining > 0 && (
          <div
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background"
            style={{ zIndex: 0 }}
          >
            +{remaining}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
