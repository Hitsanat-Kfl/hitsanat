"use client";

import { Badge, Card, CardContent } from "@repo/ui";
import type { Event } from "@/domains/definitions";

const EVENT_TYPE_LABELS: Record<string, string> = {
  Special: "Special Event",
  Extra_Training: "Extra Training",
  Awdemerit: "Awdemerit",
  Adar: "Adar",
};

const EVENT_TYPE_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Special: "default",
  Extra_Training: "secondary",
  Awdemerit: "outline",
  Adar: "destructive",
};

interface EventListProps {
  events: Event[];
  loading?: boolean;
}

export function EventList({ events, loading }: EventListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {["sk-1", "sk-2", "sk-3"].map((k) => (
          <div key={k} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{event.eventName}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>
                    {new Date(event.eventDate).toLocaleDateString("en-ET", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={EVENT_TYPE_BADGE[event.eventType] || "secondary"}>
                  {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                </Badge>
                <Badge variant={event.isPublished ? "default" : "outline"}>
                  {event.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
