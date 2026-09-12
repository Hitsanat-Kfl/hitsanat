import { formatEthiopianDate, toEthiopianDate } from "@repo/calendar";
import { Button } from "@repo/ui";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { Badge } from "@repo/ui";

export default function HomePage() {
  const today = new Date();
  const ethDate = toEthiopianDate({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
  const formattedEthDate = formatEthiopianDate(ethDate);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-surface-muted">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="mb-2">
            Hitsanat Kifl Portal
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            ህፃናት ክፍል — Children's Ministry
          </h1>
          <p className="text-muted-foreground text-sm">ዛሬ {formattedEthDate}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Hitsanat Kifl</CardTitle>
            <CardDescription>Public Ministry Foundation &amp; Announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Repository foundation is active. Monorepo packages, shared UI components, and calendar
              system are linked and operational.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Learn More</Button>
            <Button>Get Started</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
