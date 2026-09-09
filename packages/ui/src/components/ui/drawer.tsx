import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: "left" | "right" | "bottom";
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) throw new Error("Drawer components must be used within <Drawer>");
  return context;
}

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right" | "bottom";
  children: React.ReactNode;
}

function Drawer({ open: controlledOpen, onOpenChange, side = "right", children }: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <DrawerContext.Provider value={{ open, onOpenChange: handleOpenChange, side }}>
      {children}
    </DrawerContext.Provider>
  );
}

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ onClick, ...props }, ref) => {
    const { onOpenChange } = useDrawer();

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(true);
        }}
        {...props}
      />
    );
  }
);
DrawerTrigger.displayName = "DrawerTrigger";

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange, side } = useDrawer();

    React.useEffect(() => {
      if (!open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };

      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [open, onOpenChange]);

    if (!open) return null;

    const isHorizontal = side === "left" || side === "right";

    return (
      <div className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 bg-black/80"
          onClick={() => onOpenChange(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onOpenChange(false);
          }}
          aria-hidden="true"
        />

        <div
          ref={ref}
          // biome-ignore lint/a11y/useSemanticElements: Drawer uses portal-based rendering
          role="dialog"
          aria-modal="true"
          data-state={open ? "open" : "closed"}
          data-side={side}
          className={cn(
            "fixed z-50 bg-background shadow-lg",
            isHorizontal && "inset-y-0 h-full w-72",
            !isHorizontal && "inset-x-0 bottom-0 h-[85vh] rounded-t-xl sm:w-full",
            side === "left" &&
              "left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            side === "right" &&
              "right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            side === "bottom" &&
              "bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in",
            className
          )}
          tabIndex={-1}
          {...props}
        >
          <div className="flex h-full flex-col overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 text-center sm:text-left", className)}
      {...props}
    />
  )
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = "DrawerDescription";

const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-6", className)} {...props} />
  )
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const { onOpenChange } = useDrawer();

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      className={cn(
        "absolute right-4 top-4 min-h-[44px] min-w-[44px] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "sm:right-2 sm:top-2 sm:h-4 sm:w-4 sm:min-h-auto sm:min-w-auto",
        "disabled:pointer-events-none"
      )}
      aria-label="Close"
      {...props}
    />
  );
});
DrawerClose.displayName = "DrawerClose";

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
};

export type { DrawerProps, DrawerTriggerProps, DrawerContentProps };
