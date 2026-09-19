"use client";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { PageShell } from "@/features/shell";

/**
 * Permission matrix defined from packages/permissions/src/matrix.ts.
 * This is a static reference view — the actual enforcement happens server-side.
 */
const ROLES = ["SUPER_ADMIN", "CHAIRPERSON", "SUB_CHAIRPERSON", "SECRETARY"] as const;

const RESOURCES = [
  "Members",
  "Families",
  "Children",
  "Parents",
  "Sub-Departments",
  "Attendance",
  "Academic",
  "Planning",
  "Events",
  "Reports",
  "Announcements",
] as const;

const ACTIONS = ["Create", "Read", "Update", "Delete", "Approve"] as const;

/**
 * Permission data derived from packages/permissions/src/matrix.ts.
 * Key: "ROLE:RESOURCE" → set of allowed actions.
 */
const PERMISSIONS: Record<string, Set<string>> = {
  // SUPER_ADMIN — full access to all resources
  "SUPER_ADMIN:Members": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Families": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Children": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Parents": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Sub-Departments": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Attendance": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Academic": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Planning": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Events": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Reports": new Set(["Create", "Read", "Update", "Delete"]),
  "SUPER_ADMIN:Announcements": new Set(["Create", "Read", "Update", "Delete"]),

  // CHAIRPERSON — full CRUD + Approve on most resources
  "CHAIRPERSON:Members": new Set(["Create", "Read", "Update", "Delete"]),
  "CHAIRPERSON:Families": new Set(["Create", "Read", "Update", "Delete"]),
  "CHAIRPERSON:Children": new Set(["Create", "Read", "Update", "Delete"]),
  "CHAIRPERSON:Parents": new Set(["Create", "Read", "Update", "Delete"]),
  "CHAIRPERSON:Sub-Departments": new Set(),
  "CHAIRPERSON:Attendance": new Set(),
  "CHAIRPERSON:Academic": new Set(),
  "CHAIRPERSON:Planning": new Set(["Create", "Read", "Update", "Delete", "Approve"]),
  "CHAIRPERSON:Events": new Set(["Create", "Read", "Update", "Delete", "Approve"]),
  "CHAIRPERSON:Reports": new Set(["Create", "Read", "Update", "Delete", "Approve"]),
  "CHAIRPERSON:Announcements": new Set(["Create", "Read", "Update", "Delete", "Approve"]),

  // SUB_CHAIRPERSON — same as Chairperson
  "SUB_CHAIRPERSON:Members": new Set(["Create", "Read", "Update", "Delete"]),
  "SUB_CHAIRPERSON:Families": new Set(["Create", "Read", "Update", "Delete"]),
  "SUB_CHAIRPERSON:Children": new Set(["Create", "Read", "Update", "Delete"]),
  "SUB_CHAIRPERSON:Parents": new Set(["Create", "Read", "Update", "Delete"]),
  "SUB_CHAIRPERSON:Sub-Departments": new Set(),
  "SUB_CHAIRPERSON:Attendance": new Set(),
  "SUB_CHAIRPERSON:Academic": new Set(),
  "SUB_CHAIRPERSON:Planning": new Set(["Create", "Read", "Update", "Delete", "Approve"]),
  "SUB_CHAIRPERSON:Events": new Set(["Create", "Read", "Update", "Delete", "Approve"]),
  "SUB_CHAIRPERSON:Reports": new Set(["Create", "Read", "Update", "Delete", "Approve"]),
  "SUB_CHAIRPERSON:Announcements": new Set(["Create", "Read", "Update", "Delete", "Approve"]),

  // SECRETARY — CRUD on members/families/children/parents, Read-only on others
  "SECRETARY:Members": new Set(["Create", "Read", "Update", "Delete"]),
  "SECRETARY:Families": new Set(["Create", "Read", "Update", "Delete"]),
  "SECRETARY:Children": new Set(["Create", "Read", "Update", "Delete"]),
  "SECRETARY:Parents": new Set(["Create", "Read", "Update", "Delete"]),
  "SECRETARY:Sub-Departments": new Set(),
  "SECRETARY:Attendance": new Set(["Read"]),
  "SECRETARY:Academic": new Set(["Read"]),
  "SECRETARY:Planning": new Set(["Read"]),
  "SECRETARY:Events": new Set(["Read"]),
  "SECRETARY:Reports": new Set(["Read"]),
  "SECRETARY:Announcements": new Set(["Create", "Read", "Update", "Delete"]),
};

function hasPermission(role: string, resource: string, action: string): boolean {
  const key = `${role}:${resource}`;
  return PERMISSIONS[key]?.has(action) ?? false;
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
                  ACTIONS.map((action) => (
                    <TableHead
                      key={`${role}-${action}`}
                      className="text-center text-xs font-normal text-muted-foreground border-l first:border-l-0"
                    >
                      {action}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESOURCES.map((resource) => (
                <TableRow key={resource}>
                  <TableCell className="sticky left-0 bg-background z-10 font-medium">
                    {resource}
                  </TableCell>
                  {ROLES.map((role) =>
                    ACTIONS.map((action) => (
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
