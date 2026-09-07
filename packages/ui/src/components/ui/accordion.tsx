import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContext = React.createContext<{
  openItems: string[];
  toggle: (value: string) => void;
}>({ openItems: [], toggle: () => {} });

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

function Accordion({
  type = "single",
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  children,
  className,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const openItems = isControlled ? controlledValue : uncontrolledValue;

  const toggle = React.useCallback(
    (itemValue: string) => {
      const newValue =
        type === "single"
          ? openItems.includes(itemValue)
            ? []
            : [itemValue]
          : openItems.includes(itemValue)
            ? openItems.filter((v) => v !== itemValue)
            : [...openItems, itemValue];

      if (!isControlled) setUncontrolledValue(newValue);
      onValueChange?.(newValue);
    },
    [type, openItems, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div data-state={isOpen ? "open" : "closed"} className={cn("border-b", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { toggle } = React.useContext(AccordionContext);
    const { value } = React.useContext(AccordionItemContext);
    const { openItems } = React.useContext(AccordionContext);
    const isOpen = openItems.includes(value);

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        onClick={() => toggle(value)}
        className={cn(
          "flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline min-h-[44px] md:min-h-[36px]",
          "[&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { openItems } = React.useContext(AccordionContext);
    const { value } = React.useContext(AccordionItemContext);
    const isOpen = openItems.includes(value);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        data-state="open"
        className={cn("overflow-hidden text-sm", className)}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
