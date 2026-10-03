import { ActionType, PERMISSION_MATRIX, type Permission, ResourceType } from "@repo/permissions";
import { Badge } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { Field, FieldList, Panel, SectionTitle } from "./user-detail-sections";
import { displayRoleTitle } from "./user-shared";
import type { ManagedUser } from "../hooks/use-users";

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

const ACTION_LABELS: Record<ActionType, string> = {
  [ActionType.CREATE]: "Create",
  [ActionType.READ]: "Read",
  [ActionType.UPDATE]: "Update",
  [ActionType.DELETE]: "Delete",
  [ActionType.APPROVE]: "Approve",
};

const ACTION_ORDER = [
  ActionType.CREATE,
  ActionType.READ,
  ActionType.UPDATE,
  ActionType.DELETE,
  ActionType.APPROVE,
];

/** Read-only view of the shared matrix — MEMBER_REGULAR carries no system permissions. */
function permissionsFor(role: string): readonly Permission[] {
  if (role === "MEMBER_REGULAR") return [];
  return PERMISSION_MATRIX[role as keyof typeof PERMISSION_MATRIX] ?? [];
}

function resourceCount(role: string): number {
  return new Set(permissionsFor(role).map((permission) => permission.resource)).size;
}

interface UserPermissionsProps {
  user: ManagedUser;
  titleId?: string;
}

/**
 * Informational summary of the permissions this account inherits.
 *
 * Deliberately read-only: roles and the permission matrix stay in the
 * existing Roles & Permissions architecture, and the backend is the only
 * authority that grants access.
 */
export function UserPermissions({
  user,
  titleId = "user-permissions-title",
}: UserPermissionsProps) {
  const resources = resourceCount(user.role);

  return (
    <Panel titleId={titleId}>
      <SectionTitle id={titleId}>Permissions</SectionTitle>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        View and manage the permissions assigned to this user.
      </p>

      <div className="mt-4 border-t border-[#F1F3F5] pt-3.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
          Assigned Roles
        </p>
        <div className="mt-1.5">
          <Badge variant="secondary" className="text-[11px] font-medium">
            {displayRoleTitle(user.role)}
          </Badge>
        </div>
      </div>

      <div className="mt-3 border-t border-[#F1F3F5] pt-3.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
          Inherited Permissions
        </p>
        <p className="mt-1.5 text-sm text-foreground">
          {resources > 0 ? `${resources} resources` : "No system permissions"}
        </p>
      </div>

      <div className="mt-4 border-t border-[#F1F3F5] pt-3.5">
        <Link
          href="/permissions"
          className="inline-flex min-h-[44px] items-center rounded-md text-sm font-medium text-[#5F0113] transition-colors hover:underline hover:underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
        >
          View Permissions
        </Link>
      </div>
    </Panel>
  );
}

/**
 * Roles & Permissions tab: the assigned role, the resources it inherits
 * from the shared matrix, and the account's sub-department posts.
 */
export function RolesPermissionsTab({ user }: { user: ManagedUser }) {
  const permissions = permissionsFor(user.role);
  const byResource = new Map<ResourceType, Set<ActionType>>();

  for (const permission of permissions) {
    const actions = byResource.get(permission.resource) ?? new Set<ActionType>();
    actions.add(permission.action);
    byResource.set(permission.resource, actions);
  }

  const rows = Object.values(ResourceType).filter((resource) => byResource.has(resource));

  return (
    <div className="space-y-4">
      <Panel titleId="assigned-role-title">
        <SectionTitle id="assigned-role-title">Assigned Role</SectionTitle>
        <FieldList>
          <Field label="Role">{displayRoleTitle(user.role)}</Field>
          <Field label="Role code">
            <span className="font-mono text-[13px]">{user.role}</span>
          </Field>
          <Field label="Permission model">RBAC — role based, enforced by the API</Field>
        </FieldList>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Permissions are read from the shared role matrix. Changes to roles are made through the
          existing Roles &amp; Permissions screen — never per user.
        </p>
      </Panel>

      <Panel titleId="role-permissions-title">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle id="role-permissions-title">Inherited Permissions</SectionTitle>
          <Link
            href="/permissions"
            className="shrink-0 text-xs font-medium text-[#5F0113] transition-colors hover:underline hover:underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Full matrix
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            This role carries no system permissions.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-[#F1F3F5] border-t border-[#F1F3F5]">
            {rows.map((resource) => {
              const actions = byResource.get(resource) ?? new Set<ActionType>();
              const granted = ACTION_ORDER.filter((action) => actions.has(action));
              return (
                <li
                  key={resource}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
                >
                  <span className="text-sm text-foreground">{RESOURCE_LABELS[resource]}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {granted.map((action) => (
                      <span
                        key={action}
                        className={cn(
                          "inline-flex h-[22px] items-center rounded border border-[#E8DDE0] bg-[#F4F0F1] px-1.5 text-[11px] font-medium text-[#5F0113]"
                        )}
                      >
                        {ACTION_LABELS[action]}
                      </span>
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Panel titleId="sub-department-assignments-title">
        <SectionTitle id="sub-department-assignments-title">
          Sub-Department Assignments
        </SectionTitle>
        {user.subDepartments.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            This account is not assigned to a sub-department.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-[#F1F3F5] border-t border-[#F1F3F5]">
            {user.subDepartments.map((entry) => (
              <li
                key={entry.subDepartmentId}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
              >
                <span className="text-sm text-foreground">{entry.nameEn}</span>
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-[22px] items-center rounded border border-[#E8DDE0] bg-[#F4F0F1] px-1.5 text-[11px] font-medium text-[#5F0113]">
                    {entry.code}
                  </span>
                  <span className="text-xs text-muted-foreground">{entry.role}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
