import { formatEthiopianDate, toEthiopianDate } from "@repo/calendar";
import { Badge, Card, CardContent, CardHeader } from "@repo/ui";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchPublicStats() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

async function fetchPublicEvents() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

async function fetchPublicAnnouncements() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/announcements`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const [stats, events, announcements] = await Promise.all([
    fetchPublicStats(),
    fetchPublicEvents(),
    fetchPublicAnnouncements(),
  ]);

  const today = new Date();
  const ethDate = toEthiopianDate({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
  const formattedEthDate = formatEthiopianDate(ethDate);

  return (
    <main className="min-h-screen bg-surface-muted">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            ህፃናት ክፍል
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hitsanat Kifl</h1>
          <p className="mt-2 text-lg text-blue-100">Children&apos;s Ministry</p>
          <p className="mt-4 text-sm text-blue-200">ዛሬ {formattedEthDate}</p>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="mx-auto max-w-4xl px-4 -mt-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.activeMembers}</p>
                <p className="text-sm text-gray-500">Active Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.enrolledChildren}</p>
                <p className="text-sm text-gray-500">Enrolled Children</p>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.completedEvents}</p>
                <p className="text-sm text-gray-500">Events This Year</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
        {/* Announcements Section */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Announcements</h2>
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No announcements at this time.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {announcements.map(
                (ann: {
                  id: string;
                  title: string;
                  content: string;
                  targetAudience: string;
                  publishedAt: string | null;
                }) => (
                  <Card key={ann.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{ann.title}</h3>
                        <Badge variant="outline">{ann.targetAudience}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{ann.content}</p>
                      {ann.publishedAt && (
                        <p className="mt-2 text-xs text-gray-400">
                          Published: {new Date(ann.publishedAt).toLocaleDateString("en-ET")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}
        </section>

        {/* Events Section */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Upcoming Events</h2>
          {events.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No upcoming events.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map(
                (event: {
                  id: string;
                  title: string;
                  eventDate: string;
                  venue: string;
                  description: string;
                }) => {
                  const eventDate = new Date(event.eventDate);
                  const now = new Date();
                  const diffMs = eventDate.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                  return (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-semibold">{event.title}</h3>
                          {diffDays > 0 && (
                            <Badge variant="secondary">
                              {diffDays} day{diffDays !== 1 ? "s" : ""} away
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{event.venue}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {eventDate.toLocaleDateString("en-ET", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {event.description && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
        <p>Hitsanat Kifl — Children&apos;s Ministry</p>
        <p className="mt-1">Powered by Hitsanat Platform</p>
      </footer>
    </main>
  );
}
