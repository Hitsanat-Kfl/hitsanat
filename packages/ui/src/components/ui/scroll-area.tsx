import * as React from "react";
import { cn } from "../../lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  maxHeight?: number | string;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = "vertical", maxHeight, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-auto",
        orientation === "vertical" && "overflow-y-auto",
        orientation === "horizontal" && "overflow-x-auto",
        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border",
        "[&::-webkit-scrollbar-thumb]:hover:bg-border-strong",
        className
      )}
      style={{
        maxHeight: orientation === "vertical" ? maxHeight : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
