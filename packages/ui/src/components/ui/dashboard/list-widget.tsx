import { Inbox } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ListItemData, WidgetState } from "../../../types/dashboard";
import { Button } from "../button";
import { List, ListItem, ListItemText } from "../list";
import { DashboardWidget, WidgetContent, WidgetEmpty } from "./dashboard-widget";

interface ListWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleAm?: string;
  description?: string;
  items: ListItemData[];
  state?: WidgetState;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

const ListWidget = React.forwardRef<HTMLDivElement, ListWidgetProps>(
  (
    {
      className,
      title,
      description,
      items,
      state = "default",
      onRetry,
      emptyTitle,
      emptyDescription,
      headerAction,
      footer,
      ...props
    },
    ref
  ) => (
    <DashboardWidget
      ref={ref}
      title={title}
      description={description}
      headerAction={headerAction}
      state={state}
      onRetry={onRetry}
      footer={footer}
      variant="outlined"
      className={cn("h-full", className)}
      {...props}
    >
      {items.length === 0 ? (
        <WidgetEmpty
          title={emptyTitle ?? "No items"}
          description={emptyDescription ?? "Nothing to display."}
          icon={<Inbox className="h-8 w-8" />}
        />
      ) : (
        <List variant="divided">
          {items.map((item) => (
            <ListItem
              key={item.id}
              leading={item.leading}
              trailing={item.trailing}
              onClick={item.onClick}
              className={cn(item.onClick && "cursor-pointer")}
            >
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          ))}
        </List>
      )}
    </DashboardWidget>
  )
);
ListWidget.displayName = "ListWidget";

export { ListWidget, type ListWidgetProps };
