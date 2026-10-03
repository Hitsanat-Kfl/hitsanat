import { AccountStatus, displayRoleTitle } from "./user-shared";
import { FieldList, Field, Panel, SectionTitle } from "./user-detail-sections";
import type { ManagedUser } from "../hooks/use-users";

interface UserQuickInfoProps {
  user: ManagedUser;
  titleId?: string;
}

/**
 * Compact fact sheet for the account.
 *
 * Only fields the user API actually returns are listed — nothing here is
 * invented. `Account Type` is derived from the BR-007 member link, the one
 * distinction the record itself carries.
 */
export function UserQuickInfo({ user, titleId = "user-quick-info-title" }: UserQuickInfoProps) {
  const subDeptCodes = user.subDepartments.map((entry) => entry.code);

  return (
    <Panel titleId={titleId}>
      <SectionTitle id={titleId}>Quick Info</SectionTitle>
      <FieldList>
        <Field label="Account Type">{user.memberId ? "Member" : "Unlinked account"}</Field>
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
            subDeptCodes.join(", ")
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </Field>
      </FieldList>
    </Panel>
  );
}
