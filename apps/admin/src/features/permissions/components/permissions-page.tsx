"use client";

import {
  ActionType,
  type GlobalRole,
  PERMISSION_MATRIX,
  ResourceType,
  SUB_DEPT_PERMISSIONS,
  type Permission,
  type SubDepartmentCode,
} from "@repo/permissions";
import { Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { Check, Minus } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/widgets/shell";

/**
 * Read-only reference of the shared permission matrix (FR-13.3).
 * Data comes from packages/permissions/src/matrix.ts — no hand-copied sets.
 * Actual enforcement happens server-side.
 */

type RoleId = "SUPER_ADMIN" | "CHAIRPERSON" | "SUB_CHAIRPERSON" | "SECRETARY" | "MEMBER_REGULAR";

interface DirectoryRole {
  id: RoleId;
  directoryName: string;
  optionLabel: string;
  directoryDescription: string;
  description: string;
  roleType: string;
  accessLevel: string;
  permissionModel: string;
}

const DIRECTORY_ROLES: DirectoryRole[] = [
  {
    id: "SUPER_ADMIN",
    directoryName: "SUPER ADMIN",
    optionLabel: "Super Admin",
    directoryDescription: "Full system administration",
    description: "Full system administration and access management.",
    roleType: "System administration",
    accessLevel: "Full access",
    permissionModel: "RBAC",
  },
  {
    id: "CHAIRPERSON",
    directoryName: "CHAIRPERSON",
    optionLabel: "Chairperson",
    directoryDescription: "Organization leadership",
    description: "Organization leadership and final decision authority.",
    roleType: "Organization leadership",
    accessLevel: "Leadership access",
    permissionModel: "RBAC",
  },
  {
    id: "SUB_CHAIRPERSON",
    directoryName: "SUB-CHAIRPERSON",
    optionLabel: "Sub-Chairperson",
    directoryDescription: "Coordination and delegated oversight",
    description: "Coordination and delegated oversight across the organization.",
    roleType: "Organization leadership",
    accessLevel: "Leadership access",
    permissionModel: "RBAC",
  },
  {
    id: "SECRETARY",
    directoryName: "SECRETARY",
    optionLabel: "Secretary",
    directoryDescription: "Administrative operations",
    description: "Administrative operations and organizational record keeping.",
    roleType: "Administrative operations",
    accessLevel: "Leadership access",
    permissionModel: "RBAC",
  },
  {
    id: "MEMBER_REGULAR",
    directoryName: "MEMBER",
    optionLabel: "Member",
    directoryDescription: "General organizational access",
    description: "General organizational access without admin dashboard permissions.",
    roleType: "General membership",
    accessLevel: "No system access",
    permissionModel: "RBAC",
  },
];

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
  { action: ActionType.CREATE, label: "Create", short: "C" },
  { action: ActionType.READ, label: "Read", short: "R" },
  { action: ActionType.UPDATE, label: "Update", short: "U" },
  { action: ActionType.DELETE, label: "Delete", short: "D" },
  { action: ActionType.APPROVE, label: "Approve", short: "A" },
] as const;

function permissionsFor(roleId: RoleId): readonly Permission[] {
  if (roleId === "MEMBER_REGULAR") return [];
  return PERMISSION_MATRIX[roleId as GlobalRole];
}

function hasPermission(roleId: RoleId, resource: ResourceType, action: ActionType): boolean {
  return permissionsFor(roleId).some((p) => p.resource === resource && p.action === action);
}

function PermissionIndicator({ allowed }: { allowed: boolean }) {
  return (
    <span
      role="img"
      aria-label={allowed ? "Allowed" : "Not allowed"}
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-full align-middle",
        allowed ? "bg-primary text-white" : "bg-[#F2F4F7] text-[#98A2B3]"
      )}
    >
      {allowed ? (
        <Check className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
      ) : (
        <Minus className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
      )}
    </span>
  );
}

function MatrixLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {ACTIONS.map(({ action, label, short }) => (
        <span key={action} className="inline-flex items-center gap-1">
          <span className="font-semibold text-foreground">{short}</span>
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}

function ActionLegend() {
  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Action Legend
      </p>
      <ul className="mt-3 space-y-2">
        {ACTIONS.map(({ action, label, short }) => (
          <li key={action} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-background text-[10px] font-semibold text-muted-foreground"
            >
              {short}
            </span>
            <span className="text-sm text-foreground">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoleInfo({ role }: { role: DirectoryRole }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <p className="text-base font-semibold text-foreground">{role.directoryName}</p>
      <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Role type
          </p>
          <p className="mt-1 text-sm text-foreground">{role.roleType}</p>
        </div>
        <div className="border-t" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Access level
          </p>
          <p className="mt-1 text-sm text-foreground">{role.accessLevel}</p>
        </div>
        <div className="border-t" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Permission model
          </p>
          <p className="mt-1 text-sm text-foreground">{role.permissionModel}</p>
        </div>
      </div>

      <ActionLegend />
    </div>
  );
}

interface RoleDirectoryProps {
  selectedId: RoleId;
  onSelect: (id: RoleId) => void;
}

function RoleDirectory({ selectedId, onSelect }: RoleDirectoryProps) {
  return (
    <section aria-labelledby="role-directory-heading">
      <h2
        id="role-directory-heading"
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        Role Directory
      </h2>
      <div className="mt-3 rounded-md border bg-white p-5">
        <div className="flex flex-col divide-y divide-border md:flex-row md:divide-x md:divide-y-0">
          {DIRECTORY_ROLES.map((role) => {
            const isSelected = role.id === selectedId;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelect(role.id)}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "min-w-0 flex-1 rounded-sm py-3 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "md:px-4 md:first:pl-0 md:last:pr-0",
                  isSelected ? "bg-accent/5" : "hover:bg-muted/50"
                )}
              >
                <p
                  className={cn(
                    "text-sm tracking-wide",
                    isSelected ? "font-semibold text-foreground" : "font-medium text-foreground/85"
                  )}
                >
                  {role.directoryName}
                </p>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 block h-0.5 w-6 rounded-full",
                    isSelected ? "bg-[#F3C913]" : "bg-transparent"
                  )}
                />
                <p className="mt-1 text-xs text-muted-foreground">{role.directoryDescription}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface RoleSelectProps {
  value: RoleId;
  onChange: (id: RoleId) => void;
  className?: string;
}

function RoleSelect({ value, onChange, className }: RoleSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as RoleId)}
      aria-label="Select role"
      className={className}
    >
      {DIRECTORY_ROLES.map((role) => (
        <option key={role.id} value={role.id}>
          {role.optionLabel}
        </option>
      ))}
    </Select>
  );
}

function PermissionTable({ roleId }: { roleId: RoleId }) {
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table className="min-w-[560px]">
        <TableHeader>
          <TableRow className="bg-background hover:bg-background">
            <TableHead
              scope="col"
              className="sticky left-0 z-10 h-11 w-[38%] min-w-[168px] bg-background px-4 text-sm font-semibold text-foreground"
            >
              Resource
            </TableHead>
            {ACTIONS.map(({ action, label, short }) => (
              <TableHead
                key={action}
                scope="col"
                className="h-11 px-2 text-center text-xs font-medium text-muted-foreground"
              >
                <span aria-hidden="true" className="hidden sm:inline">
                  {label}
                </span>
                <span aria-hidden="true" className="sm:hidden">
                  {short}
                </span>
                <span className="sr-only">{label}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {RESOURCE_ORDER.map((resource) => (
            <TableRow key={resource} className="h-12">
              <TableCell className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-semibold text-foreground">
                {RESOURCE_LABELS[resource]}
              </TableCell>
              {ACTIONS.map(({ action }) => (
                <TableCell key={action} className="px-3 py-3 text-center sm:px-4">
                  <PermissionIndicator allowed={hasPermission(roleId, resource, action)} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IndicatorNote() {
  return (
    <p className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"
        >
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
        Allowed
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#F2F4F7] text-[#98A2B3]"
        >
          <Minus className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
        Not allowed
      </span>
    </p>
  );
}

const SUB_DEPT_DIRECTORY: Array<{
  code: SubDepartmentCode;
  name: string;
  description: string;
}> = [
  {
    code: "TIMIHRT" as SubDepartmentCode,
    name: "TIMIHRT",
    description: "Education & syllabus",
  },
  {
    code: "MEZMUR" as SubDepartmentCode,
    name: "MEZMUR",
    description: "Hymns & choir",
  },
  {
    code: "KUTITR" as SubDepartmentCode,
    name: "KUTITR",
    description: "Attendance & transport",
  },
  {
    code: "EKD" as SubDepartmentCode,
    name: "EKD",
    description: "Planning & reports",
  },
  {
    code: "KINETIBEB" as SubDepartmentCode,
    name: "KINETIBEB",
    description: "Film, puppets & Yeteret Abat",
  },
];

const SUB_DEPT_ROLES = [
  { id: "leader", label: "Leader / Sub-Leader" },
  { id: "secretary", label: "Secretary" },
  { id: "member", label: "Member" },
] as const;

type SubDeptRoleId = (typeof SUB_DEPT_ROLES)[number]["id"];

/** Resources scoped to a sub-department, derived from SUB_DEPT_PERMISSIONS. */
function subDeptResources(code: SubDepartmentCode): ResourceType[] {
  const seen: ResourceType[] = [];
  for (const p of SUB_DEPT_PERMISSIONS[code] ?? []) {
    if (!seen.includes(p.resource)) seen.push(p.resource);
  }
  return seen;
}

/**
 * Leader/Sub-Leader: full SUB_DEPT_PERMISSIONS set.
 * Secretary: CREATE/READ/UPDATE subset (checker.ts).
 * Member: none (ADR-0007 / BR-033).
 */
function subDeptHasPermission(
  code: SubDepartmentCode,
  roleId: SubDeptRoleId,
  resource: ResourceType,
  action: ActionType
): boolean {
  if (roleId === "member") return false;
  const permissions = SUB_DEPT_PERMISSIONS[code] ?? [];
  const match = permissions.some((p) => p.resource === resource && p.action === action);
  if (roleId === "leader") return match;
  return (
    match &&
    (action === ActionType.CREATE || action === ActionType.READ || action === ActionType.UPDATE)
  );
}

function SubDeptDirectory({
  selectedCode,
  onSelect,
}: {
  selectedCode: SubDepartmentCode;
  onSelect: (code: SubDepartmentCode) => void;
}) {
  return (
    <section aria-labelledby="sub-dept-directory-heading">
      <h2
        id="sub-dept-directory-heading"
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        Sub-Department Directory
      </h2>
      <div className="mt-3 rounded-md border bg-white p-5">
        <div className="flex flex-col divide-y divide-border md:flex-row md:divide-x md:divide-y-0">
          {SUB_DEPT_DIRECTORY.map((dept) => {
            const isSelected = dept.code === selectedCode;
            return (
              <button
                key={dept.code}
                type="button"
                onClick={() => onSelect(dept.code)}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "min-w-0 flex-1 rounded-sm py-3 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "md:px-4 md:first:pl-0 md:last:pr-0",
                  isSelected ? "bg-accent/5" : "hover:bg-muted/50"
                )}
              >
                <p
                  className={cn(
                    "text-sm tracking-wide",
                    isSelected ? "font-semibold text-foreground" : "font-medium text-foreground/85"
                  )}
                >
                  {dept.name}
                </p>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 block h-0.5 w-6 rounded-full",
                    isSelected ? "bg-[#F3C913]" : "bg-transparent"
                  )}
                />
                <p className="mt-1 text-xs text-muted-foreground">{dept.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SubDeptRoleCards({
  selectedId,
  onSelect,
}: {
  selectedId: SubDeptRoleId;
  onSelect: (id: SubDeptRoleId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {SUB_DEPT_ROLES.map((role) => {
        const isSelected = role.id === selectedId;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            aria-current={isSelected ? "true" : undefined}
            className={cn(
              "rounded-md border bg-white p-4 text-left transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected ? "border-foreground/20 shadow-sm" : "hover:bg-muted/40"
            )}
          >
            <p className="text-sm font-semibold text-foreground">{role.label}</p>
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 block h-0.5 w-6 rounded-full",
                isSelected ? "bg-[#F3C913]" : "bg-transparent"
              )}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {role.id === "leader" && "Full scoped permission set for this department."}
              {role.id === "secretary" && "Create, read, and update within the department scope."}
              {role.id === "member" && "No system access (ADR-0007)."}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function SubDeptPermissionTable({
  code,
  roleId,
}: {
  code: SubDepartmentCode;
  roleId: SubDeptRoleId;
}) {
  const resources = subDeptResources(code);
  if (resources.length === 0) {
    return (
      <p className="rounded-md border bg-white p-4 text-sm text-muted-foreground">
        No scoped resources are configured for this sub-department.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table className="min-w-[560px]">
        <TableHeader>
          <TableRow className="bg-background hover:bg-background">
            <TableHead
              scope="col"
              className="sticky left-0 z-10 h-11 w-[38%] min-w-[168px] bg-background px-4 text-sm font-semibold text-foreground"
            >
              Resource
            </TableHead>
            {ACTIONS.map(({ action, label, short }) => (
              <TableHead
                key={action}
                scope="col"
                className="h-11 px-2 text-center text-xs font-medium text-muted-foreground"
              >
                <span aria-hidden="true" className="hidden sm:inline">
                  {label}
                </span>
                <span aria-hidden="true" className="sm:hidden">
                  {short}
                </span>
                <span className="sr-only">{label}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource} className="h-12">
              <TableCell className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-semibold text-foreground">
                {RESOURCE_LABELS[resource]}
              </TableCell>
              {ACTIONS.map(({ action }) => (
                <TableCell key={action} className="px-3 py-3 text-center sm:px-4">
                  <PermissionIndicator
                    allowed={subDeptHasPermission(code, roleId, resource, action)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SubDepartmentLeadershipSection() {
  const [selectedCode, setSelectedCode] = useState<SubDepartmentCode>(
    "TIMIHRT" as SubDepartmentCode
  );
  const [selectedRoleId, setSelectedRoleId] = useState<SubDeptRoleId>("leader");
  const selectedDept =
    SUB_DEPT_DIRECTORY.find((d) => d.code === selectedCode) ?? SUB_DEPT_DIRECTORY[0];

  return (
    <section aria-labelledby="sub-dept-leadership-heading" className="space-y-4">
      <div>
        <h2
          id="sub-dept-leadership-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Sub-Department Leadership
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each sub-department has three leadership posts: Leader, Sub-Leader, and Secretary.
          Read-only reference sourced from <code>SUB_DEPT_PERMISSIONS</code>.
        </p>
      </div>

      <SubDeptDirectory selectedCode={selectedCode} onSelect={setSelectedCode} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Scoped Permissions — {selectedDept.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a post to see which actions it holds within this department.
          </p>
        </div>
        <MatrixLegend />
      </div>

      <SubDeptRoleCards selectedId={selectedRoleId} onSelect={setSelectedRoleId} />

      <SubDeptPermissionTable code={selectedCode} roleId={selectedRoleId} />
      <IndicatorNote />
    </section>
  );
}

export default function PermissionsPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>("SUPER_ADMIN");
  const selectedRole =
    DIRECTORY_ROLES.find((role) => role.id === selectedRoleId) ?? DIRECTORY_ROLES[0];

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Roles & Permissions" }]}
      title="Roles & Permissions"
      description="Understand the roles and access capabilities configured for the Hitsanat Kifl management system."
    >
      <div className="space-y-4">
        <RoleDirectory selectedId={selectedRoleId} onSelect={setSelectedRoleId} />

        {/* Mobile: single-column layout */}
        <div className="space-y-4 lg:hidden">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Selected Role
            </h2>
            <div className="mt-2">
              <RoleSelect value={selectedRoleId} onChange={setSelectedRoleId} />
            </div>
          </div>

          <RoleInfo role={selectedRole} />

          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Permission Matrix
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Read-only reference of role capabilities across system resources.
                </p>
              </div>
              <MatrixLegend />
            </div>
          </div>

          <PermissionTable roleId={selectedRoleId} />
          <IndicatorNote />
        </div>

        {/* Desktop: 3/9 layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left: Selected Role — 3 columns */}
          <div className="col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Selected Role
            </h2>
            <div className="mt-3">
              <RoleInfo role={selectedRole} />
            </div>
          </div>

          {/* Right: Permission Matrix — 9 columns */}
          <div className="col-span-9 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Permission Matrix
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Read-only reference of role capabilities across system resources.
                </p>
              </div>
              <MatrixLegend />
            </div>

            <RoleSelect
              value={selectedRoleId}
              onChange={setSelectedRoleId}
              className="sm:max-w-48"
            />

            <PermissionTable roleId={selectedRoleId} />
            <IndicatorNote />
          </div>
        </div>

        {/* Sub-department scoped leadership posts (3 per department). */}
        <SubDepartmentLeadershipSection />
      </div>
    </PageShell>
  );
}
