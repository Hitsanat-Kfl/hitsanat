import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { formatEthiopianDate, toEthiopianDate } from "@repo/calendar";
import { Calendar, LayoutDashboard, Settings, Shield, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const today = new Date();
  const ethDate = toEthiopianDate({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
  const formattedEthDate = formatEthiopianDate(ethDate);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar navigation placeholder */}
      <aside className="w-64 border-r bg-card text-card-foreground p-4 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Hitsanat Admin</span>
          </div>

          <nav className="space-y-1">
            <a
              href="#dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-accent/50 cursor-not-allowed">
              <Users className="h-4 w-4" />
              <span>Ministry Management (Upcoming)</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-accent/50 cursor-not-allowed">
              <Calendar className="h-4 w-4" />
              <span>Schedule &amp; Planning (Upcoming)</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-accent/50 cursor-not-allowed">
              <Settings className="h-4 w-4" />
              <span>Settings (Upcoming)</span>
            </div>
          </nav>
        </div>

        <div className="border-t pt-4 text-xs text-slate-600 dark:text-slate-400">
          Hitsanat Kifl v1.0.0 (Foundation)
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">Ministry Administration</h2>
            <Badge variant="outline">Foundation Mode</Badge>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{formattedEthDate}</div>
        </header>

        {/* Dashboard Placeholder Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>System Status</CardDescription>
                <CardTitle className="text-2xl">Healthy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Monorepo foundation &amp; services active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Calendar System</CardDescription>
                <CardTitle className="text-2xl">Ethiopian</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Integrated with ethiopian-calendar-new
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>UI Components</CardDescription>
                <CardTitle className="text-2xl">@repo/ui</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Shared shadcn/ui library ready
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Shell Overview</CardTitle>
              <CardDescription>
                Infrastructure setup complete. Domain modules will be enabled in subsequent phases.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This administrative application foundation provides the base navigation shell and
                shared component bindings for the Hitsanat Kifl system.
              </p>
              <Button variant="outline">View API Health</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
