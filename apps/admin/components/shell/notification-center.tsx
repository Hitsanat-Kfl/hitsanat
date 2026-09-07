"use client";

import type * as React from "react";
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle } from "lucide-react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
  ScrollArea,
  EmptyState,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { useI18n } from "./i18n";

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New child registration",
    description: "A new child has been registered in the system.",
    timestamp: "2 min ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Schedule updated",
    description: "The weekly schedule has been updated for next Sunday.",
    timestamp: "1 hour ago",
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "Meeting reminder",
    description: "Leadership meeting starts in 30 minutes.",
    timestamp: "3 hours ago",
    read: true,
    type: "warning",
  },
];

const typeIcons: Record<Notification["type"], React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <Check className="h-4 w-4 text-emerald-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  error: <XCircle className="h-4 w-4 text-destructive" />,
};

export function NotificationCenter({
  notifications = mockNotifications,
  onMarkAllRead,
  onNotificationClick,
}: NotificationCenterProps) {
  const { t } = useI18n();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "relative inline-flex items-center justify-center rounded-md p-2 transition-colors",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto md:h-10 md:w-10"
        )}
        aria-label={`${t("notifications.title")}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">{t("notifications.title")}</h2>
          {unreadCount > 0 && (
            <Button variant="ghost" size="xs" onClick={onMarkAllRead} className="text-xs">
              <CheckCheck className="mr-1 h-3 w-3" aria-hidden="true" />
              {t("notifications.mark-all-read")}
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-8 w-8" />}
            title={t("notifications.empty")}
            className="py-8"
          />
        ) : (
          <ScrollArea maxHeight={320}>
            <ul className="divide-y divide-border">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => onNotificationClick?.(notification)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                      "hover:bg-accent/50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <span className="mt-0.5 shrink-0">{typeIcons[notification.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium text-foreground",
                          !notification.read && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read && (
                      <span
                        className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                        aria-label="Unread"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
