import type { Member } from "@/domains/definitions";
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import Link from "next/link";
import type { ManagedUser } from "../hooks/use-users";
import { LinkedMemberSection } from "./linked-member-section";
import { Field, FieldList, Panel, SectionTitle } from "./user-detail-sections";
import { UserInformation } from "./user-information";
import { RolesPermissionsTab, UserPermissions } from "./user-permissions";
import { UserRecentActivity } from "./user-recent-activity";
import { formatCreatedDate, formatDateTime } from "./user-shared";

const TABS = [
  { value: "overview", label: "Overview", short: "Overview" },
  { value: "member", label: "Member Information", short: "Member" },
  { value: "permissions", label: "Roles & Permissions", short: "Roles" },
  { value: "activity", label: "Activity", short: "Activity" },
] as const;

interface UserDetailsTabsProps {
  user: ManagedUser;
  member: Member | null;
  memberLoading: boolean;
  memberError: string | null;
  canManage: boolean;
  onEdit: () => void;
  /** Opens the edit dialog so the account can be linked/unlinked. */
  onLinkMember: () => void;
}

/**
 * The record's four chapters.
 *
 * Overview carries the dossier body, Member Information opens the canonical
 * Members feature, Roles & Permissions stays read-only, and Activity is the
 * account's own audit trail.
 */
export function UserDetailsTabs({
  user,
  member,
  memberLoading,
  memberError,
  canManage,
  onEdit,
  onLinkMember,
}: UserDetailsTabsProps) {
  return (
    <Tabs defaultValue="overview" className="mt-5 md:mt-6">
      <div className="border-b border-[#E5E7EB]">
        <TabsList className="h-auto justify-start gap-1 overflow-x-auto rounded-none border-b border-[#E5E7EB] bg-transparent p-0">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              id={`trigger-${tab.value}`}
              value={tab.value}
              className="-mb-px min-h-[48px] rounded-none border-b-2 border-transparent bg-transparent px-0 pr-6 text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-[#5F0113] data-[state=active]:bg-transparent data-[state=active]:text-[#5F0113] data-[state=active]:shadow-none sm:min-h-[44px] sm:pr-8"
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden" aria-hidden="true">
                {tab.short}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-5">
        <div className="grid gap-4 md:gap-5 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-7">
            <UserInformation user={user} canManage={canManage} onEdit={onEdit} />
          </div>
          <div className="space-y-4 lg:col-span-5">
            <LinkedMemberSection
              memberId={user.memberId}
              member={member}
              loading={memberLoading}
              error={memberError}
              canManage={canManage}
              onLinkMember={onLinkMember}
            />
            <UserPermissions user={user} />
          </div>
        </div>

        {/* The account's own trail closes the dossier (spec §11). */}
        <div className="mt-4 md:mt-5">
          <UserRecentActivity
            operatorId={user.id}
            subtitle="Latest actions performed by this user."
            titleId="overview-recent-activity-title"
          />
        </div>
      </TabsContent>

      <TabsContent value="member" className="mt-5">
        <MemberRecordPanel
          memberId={user.memberId}
          member={member}
          loading={memberLoading}
          error={memberError}
          canManage={canManage}
          onLinkMember={onLinkMember}
        />
      </TabsContent>

      <TabsContent value="permissions" className="mt-5">
        <RolesPermissionsTab user={user} />
      </TabsContent>

      <TabsContent value="activity" className="mt-5">
        <UserRecentActivity
          operatorId={user.id}
          subtitle="Latest actions performed by this user."
        />
      </TabsContent>
    </Tabs>
  );
}

/* ------------------------------------------------------------------ */
/* Member record (canonical Members feature)                          */
/* ------------------------------------------------------------------ */

function MemberRecordPanel({
  memberId,
  member,
  loading,
  error,
  canManage,
  onLinkMember,
}: {
  memberId: string | null;
  member: Member | null;
  loading: boolean;
  error: string | null;
  canManage: boolean;
  onLinkMember: () => void;
}) {
  if (!memberId) {
    return (
      <Panel titleId="member-record-title">
        <SectionTitle id="member-record-title">Member Record</SectionTitle>
        <div className="mt-2">
          <EmptyState
            title="No member linked"
            description="This account is not currently linked to a member record."
            action={
              canManage ? (
                <Button variant="outline" size="sm" onClick={onLinkMember}>
                  Link member
                </Button>
              ) : undefined
            }
            className="py-8"
          />
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-12 lg:gap-5 lg:space-y-0">
      <div className="lg:col-span-7">
        <Panel titleId="member-record-title">
          <SectionTitle id="member-record-title">Member Record</SectionTitle>

          {loading && (
            <div className="mt-4 space-y-3" aria-busy="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-5 w-full rounded" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mt-4 rounded-md border border-[#E5E7EB] bg-[#F7F8F9] p-3">
              <p className="text-sm text-foreground">
                The linked member record could not be loaded.
              </p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{memberId}</p>
            </div>
          )}

          {!loading && !error && member && (
            <>
              <div className="mt-4 flex items-center gap-3">
                <Avatar src={member.photoUrl ?? undefined} name={member.fullName} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">
                    {member.fullName}
                  </p>
                  <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">
                    {member.id}
                  </p>
                </div>
              </div>

              <FieldList className="mt-4">
                <Field label="Christian Name">{member.christianName || "—"}</Field>
                <Field label="Phone Number">{member.phoneNumber || "—"}</Field>
                <Field label="Year of Study">{member.yearOfStudy}</Field>
                <Field label="Academic Department">{member.academicDepartment || "—"}</Field>
                <Field label="Campus">{member.campus || "—"}</Field>
                <Field label="Date Joined">
                  <span className="tabular-nums">{formatCreatedDate(member.dateJoined)}</span>
                </Field>
              </FieldList>
            </>
          )}
        </Panel>
      </div>

      <div className="lg:col-span-5">
        <Panel titleId="member-account-title">
          <SectionTitle id="member-account-title">Account Link</SectionTitle>
          <FieldList>
            <Field label="Member ID">
              <span className="break-all font-mono text-[13px]">{memberId}</span>
            </Field>
            <Field label="Link status">
              {member ? (
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Linked
                </Badge>
              ) : (
                <span className="text-muted-foreground">
                  {loading ? "Checking…" : "Record unavailable"}
                </span>
              )}
            </Field>
            <Field label="Member record updated">
              <span className="tabular-nums">
                {member ? formatDateTime(member.updatedAt) : "—"}
              </span>
            </Field>
          </FieldList>

          <div className="mt-4">
            <Link
              href={`/members/${memberId}`}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-9 sm:w-auto"
            >
              View Member
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
