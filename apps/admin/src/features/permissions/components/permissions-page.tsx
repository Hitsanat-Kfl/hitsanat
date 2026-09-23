"use client";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { ActionType, GlobalRole, PERMISSION_MATRIX, ResourceType } from "@repo/permissions";
import { PageShell } from "@/widgets/shell";

/**
 * Reference view of the shared permission matrix (FR-13.3).
 * Data comes from packages/permissions/src/matrix.ts — no hand-copied sets.
 * Actual enforcement happens server-side.
 */
const ROLES = [
  GlobalRole.SUPER_ADMIN,
  GlobalRole.CHAIRPERSON,
  GlobalRole.SUB_CHAIRPERSON,
  GlobalRole.SECRETARY,
] as const;

const RESOURCE_ORDER = [
  ResourceType.MEMBERS,
  ResourceType.FAMILIES,
  ResourceType.CHILDREN,
  ResourceType.PARENTS,
  ResourceType.SUB_DEPARTMENTS,
  ResourceType.ATTENDANCE,
  ResourceType.ACADEMIC,
  ResourceType.PLANNING,
  ResourceType.EVENTS,
  ResourceType.REPORTS,
  ResourceType.ANNOUNCEMENTS,
] as const;

const RESOURCE_LABELS: Record<ResourceType, string> = {
  [ResourceType.MEMBERS]: "Members",
  [ResourceType.FAMILIES]: "Families",
  [ResourceType.CHILDREN]: "Children",
  [ResourceType.PARENTS]: "Parents",
  [ResourceType.SUB_DEPARTMENTS]: "Sub-Departments",
  [ResourceType.ATTENDANCE]: "Attendance",
  [ResourceType.ACADEMIC]: "Academic",
  [ResourceType.PLANNING]: "Planning",
  [ResourceType.EVENTS]: "Events",
  [ResourceType.REPORTS]: "Reports",
  [ResourceType.ANNOUNCEMENTS]: "Announcements",
};

const ACTIONS = [
  { action: ActionType.CREATE, label: "Create" },
  { action: ActionType.READ, label: "Read" },
  { action: ActionType.UPDATE, label: "Update" },
  { action: ActionType.DELETE, label: "Delete" },
  { action: ActionType.APPROVE, label: "Approve" },
] as const;

function hasPermission(role: GlobalRole, resource: ResourceType, action: ActionType): boolean {
  return PERMISSION_MATRIX[role].some((p) => p.resource === resource && p.action === action);
}

function PermissionCell({ allowed }: { allowed: boolean }) {
  return (
    <TableCell className="text-center">
      {allowed ? (
        <Badge variant="default" className="text-xs">
          ✓
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </TableCell>
  );
}

export default function PermissionsPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Permissions" }]}
      title="Permission Matrix"
      description="Reference view of role-based access control. Enforced server-side."
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This matrix shows what each leadership role can access. Actual enforcement happens via API
          middleware — this is a reference view only.
        </p>

        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10">Resource</TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role} colSpan={ACTIONS.length} className="text-center border-l">
                    {role.replaceAll("_", " ")}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10" />
                {ROLES.map((role) =>
                  ACTIONS.map(({ action, label }) => (
                    <TableHead
                      key={`${role}-${action}`}
                      className="text-center text-xs font-normal text-muted-foreground border-l first:border-l-0"
                    >
                      {label}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESOURCE_ORDER.map((resource) => (
                <TableRow key={resource}>
                  <TableCell className="sticky left-0 bg-background z-10 font-medium">
                    {RESOURCE_LABELS[resource]}
                  </TableCell>
                  {ROLES.map((role) =>
                    ACTIONS.map(({ action }) => (
                      <PermissionCell
                        key={`${role}-${resource}-${action}`}
                        allowed={hasPermission(role, resource, action)}
                      />
                    ))
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>
            <Badge variant="default" className="mr-1 text-xs">
              ✓
            </Badge>
            Allowed
          </span>
          <span>
            <span className="mr-1">—</span>
            Not allowed
          </span>
        </div>
      </div>
    </PageShell>
  );
}
