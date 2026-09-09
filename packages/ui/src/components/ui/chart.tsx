import { cn } from "../../lib/utils";

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

function ChartContainer({ className, children, ...props }: ChartContainerProps) {
  return (
    <div className={cn("w-full rounded-lg border bg-background p-4", className)} {...props}>
      {children}
    </div>
  );
}

interface ChartTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function ChartTitle({ className, ...props }: ChartTitleProps) {
  return <h3 className={cn("text-sm font-semibold", className)} {...props} />;
}

interface ChartDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function ChartDescription({ className, ...props }: ChartDescriptionProps) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: string; color: string }[];
}

function ChartLegend({ items, className, ...props }: ChartLegendProps) {
  return (
    <div className={cn("flex flex-wrap gap-4 pt-2", className)} {...props}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  content?: React.ReactNode;
}

function ChartTooltip({ active, label, content }: ChartTooltipProps) {
  if (!active) return null;

  return (
    <div className="rounded-md border bg-popover p-2 text-popover-foreground shadow-md text-xs">
      {label && <div className="font-medium mb-1">{label}</div>}
      {content}
    </div>
  );
}

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  barHeight?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

function BarChart({
  data,
  maxValue: overrideMax,
  barHeight = 24,
  showLabels = true,
  showValues = true,
  className,
  ...props
}: BarChartProps) {
  const maxValue = overrideMax ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {showLabels && (
            <span className="w-24 shrink-0 truncate text-xs text-muted-foreground text-right">
              {item.label}
            </span>
          )}
          <div className="flex-1 overflow-hidden">
            <div
              className={cn("rounded-sm transition-all", item.color ?? "bg-primary")}
              style={{
                height: `${barHeight}px`,
                width: `${Math.max((item.value / maxValue) * 100, 2)}%`,
              }}
            />
          </div>
          {showValues && (
            <span className="w-12 shrink-0 text-xs font-medium tabular-nums text-right">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
}

function DonutChart({
  value,
  maxValue = 100,
  size = 80,
  strokeWidth = 8,
  color,
  trackColor,
  label,
  className,
  ...props
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / maxValue, 1);
  const offset = circumference * (1 - percentage);

  return (
    <div className={cn("flex flex-col items-center gap-1", className)} {...props}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg aria-hidden="true" width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={trackColor ?? "fill-muted stroke-muted"}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn("transition-all duration-500", color ?? "stroke-primary")}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold tabular-nums">
            {Math.round(percentage * 100)}%
          </span>
        </div>
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}

interface TrendProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  direction?: "up" | "down" | "neutral";
  label?: string;
  suffix?: string;
}

function Trend({
  value,
  direction = "neutral",
  label,
  suffix = "%",
  className,
  ...props
}: TrendProps) {
  const isPositive = direction === "up";
  const isNegative = direction === "down";

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)} {...props}>
      <span
        className={cn(
          "font-medium tabular-nums",
          isPositive && "text-success",
          isNegative && "text-destructive"
        )}
      >
        {isPositive && "↑"}
        {isNegative && "↓"}
        {Math.abs(value)}
        {suffix}
      </span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </div>
  );
}

export {
  ChartContainer,
  ChartTitle,
  ChartDescription,
  ChartLegend,
  ChartTooltip,
  BarChart,
  DonutChart,
  Trend,
};
