import { Badge, Card, CardContent, CardHeader } from "@repo/ui";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  publishedAt: string | null;
}

interface AnnouncementsProps {
  announcements: Announcement[];
}

export function Announcements({ announcements }: AnnouncementsProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <section id="announcements" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-h1 text-foreground">Announcements</h2>
          <p className="mt-1 text-body-large text-muted-foreground">ስርጭቶች</p>
        </div>

        <div className="mt-8 space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} className="transition-shadow hover:shadow-elevation-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-h3 text-foreground">{ann.title}</h3>
                  <Badge variant="outline">{ann.targetAudience}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-body text-muted-foreground">{ann.content}</p>
                {ann.publishedAt && (
                  <p className="mt-2 text-caption text-muted-foreground">
                    Published: {new Date(ann.publishedAt).toLocaleDateString("en-ET")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
