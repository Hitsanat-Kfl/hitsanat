import { Avatar, Button, EmptyState, Skeleton } from "@repo/ui";
import Link from "next/link";
import type { Member } from "@/domains/definitions";
import { Field, FieldList, Panel, SectionTitle } from "./user-detail-sections";
import { formatCreatedDate } from "./user-shared";

interface LinkedMemberSectionProps {
  memberId: string | null;
  member: Member | null;
  loading: boolean;
  error: string | null;
  canManage: boolean;
  /** Opens the existing edit dialog so the account can be linked/unlinked. */
  onLinkMember: () => void;
  titleId?: string;
}

/**
 * The member record behind this login (BR-007).
 *
 * Uses the canonical Members feature — no second member model. When the
 * account has no link the panel degrades to a professional empty state
 * instead of showing placeholder data.
 */
export function LinkedMemberSection({
  memberId,
  member,
  loading,
  error,
  canManage,
  onLinkMember,
  titleId = "linked-member-title",
}: LinkedMemberSectionProps) {
  if (!memberId) {
    return (
      <Panel titleId={titleId}>
        <SectionTitle id={titleId}>Linked Member</SectionTitle>
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
    <Panel titleId={titleId}>
      <SectionTitle id={titleId}>Linked Member</SectionTitle>

      {loading && (
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
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
              <p className="truncate text-sm font-semibold text-foreground">{member.fullName}</p>
              <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">
                {member.id}
              </p>
            </div>
          </div>

          <FieldList className="mt-4">
            <Field label="Academic Department">{member.academicDepartment || "—"}</Field>
            <Field label="Year of Study">{member.yearOfStudy}</Field>
            <Field label="Campus">{member.campus || "—"}</Field>
            <Field label="Joined">{formatCreatedDate(member.dateJoined)}</Field>
          </FieldList>
        </>
      )}

      <div className="mt-4">
        <Link
          href={`/members/${memberId}`}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-9 sm:w-auto"
        >
          View Member
        </Link>
      </div>
    </Panel>
  );
}
