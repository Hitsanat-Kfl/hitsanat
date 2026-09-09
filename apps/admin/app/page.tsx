import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { PageShell, PageHeader } from "../components/shell/page-shell";

export default function AdminDashboardPage() {
  return (
    <PageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}>
      <PageHeader title="Dashboard" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>System Status</CardDescription>
            <CardTitle className="text-2xl">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground text-sm">Integrated with ethiopian-calendar-new</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>UI Components</CardDescription>
            <CardTitle className="text-2xl">@repo/ui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Shared shadcn/ui library ready</p>
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
          <p className="text-muted-foreground text-sm">
            This administrative application foundation provides the base navigation shell and shared
            component bindings for the Hitsanat Kifl system.
          </p>
        </CardContent>
      </Card>

      {/* TODO PLN-007 (Frontend 1 - Eyob): Planning Matrix UI
          Build interactive planning matrix in apps/admin
          - Display 25 activities with weight bars, quarterly distribution, progress indicators
          - Interactive table with Budget, People, Time columns
          - Edit capability for authorized users (Ekd)
          - Responsive layout
          - Depends on: PLN-003, PLN-004 */}

      {/* TODO PLN-008 (Frontend 2 - TBD): Sub-Department Plan Execution UI
          Build sub-department plan execution view in apps/admin
          - Show activities distributed to user's sub-department
          - Weekly task list
          - Progress recording form (actual result, status, challenges)
          - Roll-up progress indicator
          - Scoped to user's sub-department (RBAC)
          - Depends on: PLN-004, PLN-005 */}
    </PageShell>
  );
}
