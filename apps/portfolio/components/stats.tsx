import { Card, CardContent } from "@repo/ui";

interface StatsProps {
  stats: {
    activeMembers: number;
    enrolledChildren: number;
    completedEvents: number;
  } | null;
}

export function Stats({ stats }: StatsProps) {
  if (!stats) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 -mt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="shadow-elevation-md">
          <CardContent className="p-4 text-center">
            <p className="text-kpi text-primary">{stats.activeMembers}</p>
            <p className="mt-1 text-caption text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-md">
          <CardContent className="p-4 text-center">
            <p className="text-kpi text-accent">{stats.enrolledChildren}</p>
            <p className="mt-1 text-caption text-muted-foreground">Enrolled Children</p>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-md">
          <CardContent className="p-4 text-center">
            <p className="text-kpi text-success">{stats.completedEvents}</p>
            <p className="mt-1 text-caption text-muted-foreground">Events This Year</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
