import * as React from "react";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

function Tooltip({ content, children, side = "top", delay = 300 }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (side) {
      case "top":
        x = trigger.left + trigger.width / 2 - tooltip.width / 2;
        y = trigger.top - tooltip.height - 8;
        break;
      case "bottom":
        x = trigger.left + trigger.width / 2 - tooltip.width / 2;
        y = trigger.bottom + 8;
        break;
      case "left":
        x = trigger.left - tooltip.width - 8;
        y = trigger.top + trigger.height / 2 - tooltip.height / 2;
        break;
      case "right":
        x = trigger.right + 8;
        y = trigger.top + trigger.height / 2 - tooltip.height / 2;
        break;
    }

    setPosition({
      x: Math.max(8, Math.min(x, window.innerWidth - tooltip.width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - tooltip.height - 8)),
    });
  }, [side]);

  const show = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delay);
  }, [delay]);

  const hide = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipId = React.useId();

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={open ? tooltipId : undefined}
        className="inline-flex"
      >
        {children}
      </div>

      {open && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={cn(
            "fixed z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
          style={{ left: position.x, top: position.y }}
          data-side={side}
        >
          {content}
        </div>
      )}
    </>
  );
}

Tooltip.displayName = "Tooltip";

export { Tooltip };
export type { TooltipProps };
