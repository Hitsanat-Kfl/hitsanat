import { Button } from "@repo/ui";
import { CircleCheck, Pencil } from "lucide-react";
import { AccountStatus, displayRoleTitle, formatDateTime, SubDepartmentChips } from "./user-shared";
import { Field, FieldList, Panel, SectionTitle } from "./user-detail-sections";
import type { ManagedUser } from "../hooks/use-users";

interface UserInformationProps {
  user: ManagedUser;
  canManage: boolean;
  onEdit: () => void;
  titleId?: string;
}

/**
 * Account / member facts of record — the Overview tab's left column.
 *
 * Every value comes from `GET /users/:id`; fields the API does not expose
 * (last login, for example) are simply not shown.
 */
export function UserInformation({
  user,
  canManage,
  onEdit,
  titleId = "user-member-information-title",
}: UserInformationProps) {
  const subDeptCodes = user.subDepartments.map((entry) => entry.code);

  return (
    <Panel titleId={titleId}>
      <div className="flex items-center justify-between gap-3">
        <SectionTitle id={titleId}>Member Information</SectionTitle>
        {canManage && (
          <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0">
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
        )}
      </div>

      <FieldList>
        <Field label="Full Name">{user.name}</Field>
        <Field label="Email">
          <span className="break-all">{user.email}</span>
        </Field>
        <Field label="Email Verification">
          {user.emailVerified ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-[#16834A]">
              <CircleCheck className="h-4 w-4" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className="text-muted-foreground">Not verified</span>
          )}
        </Field>
        <Field label="Role">{displayRoleTitle(user.role)}</Field>
        <Field label="Status">
          <AccountStatus status={user.status} />
        </Field>
        <Field label="Member ID">
          {user.memberId ? (
            <span className="break-all font-mono text-[13px]">{user.memberId}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </Field>
        <Field label="Sub-department">
          {subDeptCodes.length > 0 ? (
            <SubDepartmentChips codes={subDeptCodes} />
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </Field>
        <Field label="Created At">
          <span className="tabular-nums">{formatDateTime(user.createdAt)}</span>
        </Field>
        <Field label="Last Updated">
          <span className="tabular-nums">{formatDateTime(user.updatedAt)}</span>
        </Field>
      </FieldList>
    </Panel>
  );
}
