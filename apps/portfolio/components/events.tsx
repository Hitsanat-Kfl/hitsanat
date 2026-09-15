import { Badge, Card, CardContent } from "@repo/ui";
import { Calendar, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "Upcoming" | "Completed" | "Cancelled";
}

interface EventsProps {
  events: Event[];
}

export function Events({ events }: EventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <section id="events" className="bg-surface-muted py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-h1 text-foreground">Upcoming Events</h2>
          <p className="mt-1 text-body-large text-muted-foreground">የሚቀጥሉ ዝግጅቶች</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="transition-shadow hover:shadow-elevation-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-h4 text-foreground">{event.title}</h3>
                  <Badge variant={event.status === "Upcoming" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1 text-body-small text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
