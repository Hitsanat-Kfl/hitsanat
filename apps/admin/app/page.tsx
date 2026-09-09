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

      {/* TODO OPS-008 (Frontend 2): Attendance Checksheets UI
          Build attendance checksheets in apps/admin for Kutitr officials
          - Session selection dropdown
          - Member/child list with status toggles (Present/Absent/Excused)
          - Batch save capability
          - Mobile-optimized (touch-friendly)
          - Depends on: OPS-002, OPS-003 */}

      {/* TODO OPS-009 (Frontend 2): Transport Dispatcher UI
          Build Saturday transport route dispatcher in apps/admin
          - 5 route columns (Apartama, Gende Boy, Gende Je, Cobalt, Bate)
          - Drag-and-drop or multi-select member assignment
          - Minimum 2 members per route indicator
          - Depends on: OPS-004 */}

      {/* TODO OPS-010 (Frontend 2): Event Management UI
          Build event creation and management interface in apps/admin
          - Event list with filtering by type
          - Event creation form
          - Program assignment interface
          - Multi-member selection for programs
          - Depends on: OPS-006 */}

      {/* TODO OPS-011 (Frontend 2): Academic Score Entry UI
          Build Timihrt gradebook interface in apps/admin
          - Assessment list
          - Score entry form (student, score)
          - Score summary per assessment
          - Depends on: OPS-005 */}

      {/* TODO HRD-007 (Frontend 2): Admin Accessibility Audit
          Perform comprehensive accessibility audit on all admin pages
          - All pages pass axe-core WCAG 2.1 AA
          - Keyboard navigation works on all interactive elements
          - Screen reader compatibility verified
          - Color contrast ratios meet standards
          - Focus management correct */}

      {/* TODO HRD-008 (Frontend 1 - Eyob): Portfolio Accessibility Audit
          Perform comprehensive accessibility audit on all portfolio pages
          - All pages pass axe-core WCAG 2.1 AA
          - Keyboard navigation works
          - Screen reader compatibility verified
          - Mobile accessibility verified
          - Language attributes correct (Amharic) */}
    </PageShell>
  );
}
