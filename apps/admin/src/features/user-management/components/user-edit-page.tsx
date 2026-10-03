"use client";

import { canManageAccounts } from "@/authorization";
import { useAuthUser } from "@/features/authentication";
import { useMember } from "@/features/member-management/hooks/use-members";
import { PageShell } from "@/widgets/shell";
import {
  Avatar,
  Button,
  EmptyState,
  ErrorState,
  FormField,
  Input,
  Select,
  Skeleton,
  useToast,
  type BreadcrumbItem,
} from "@repo/ui";
import { ArrowLeft, Info, User, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  LEADERSHIP_ROLE_SET,
  type UpdateUserPayload,
  useUser,
  useUserMutations,
} from "../hooks/use-users";
import { MemberPicker, type PickedMember } from "./member-picker";
import { PageHeading, PageTopBar } from "./user-detail-identity";
import {
  AccountStatus,
  displayRoleTitle,
  ROLE_OPTIONS,
  type EditUserFieldErrors,
  validateEditUser,
} from "./user-shared";

const EDIT_CRUMBS: BreadcrumbItem[] = [
  { label: "Administration" },
  { label: "User Accounts", href: "/users" },
  { label: "Edit User" },
];

const PAGE_DESCRIPTION = "Update the user's account information and organization details.";

function RecordShell({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <div className="px-0.5 md:px-2 lg:px-3">{children}</div>
    </PageShell>
  );
}

/** Escape hatch back to the record — a plain link, not a nested button. */
function BackToUserDetails({ userId }: { userId?: string | null }) {
  return (
    <Link
      href={userId ? `/users/${userId}` : "/users"}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to User Details
    </Link>
  );
}

/** Small functional icon + title + thin rule — the dossier's section rhythm. */
function SectionHeading({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div>
      <h2
        id={id}
        className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground md:text-lg"
      >
        <Icon className="h-4 w-4 shrink-0 text-[#5F0113]" aria-hidden="true" />
        {children}
      </h2>
      <div className="mt-2 h-px bg-[#E5E7EB]" aria-hidden="true" />
    </div>
  );
}

/** Understated BR-007 notice — informational, never a warning card. */
function MemberRequirementNotice() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[#D9DEE5] bg-white p-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
      <p className="text-[13px] leading-snug text-muted-foreground">
        <span className="font-medium text-foreground">
          Leadership roles require a linked active member.
        </span>{" "}
        Ensure the selected member is active and valid.
      </p>
    </div>
  );
}

/** Mirrors the loaded form so the page never jumps when data lands. */
function EditSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading user…</span>

      <div className="md:hidden">
        <Skeleton className="h-[76px] w-full rounded-lg" />
      </div>

      <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-white p-4 md:p-6">
        {[0, 1].map((section) => (
          <div key={section} className={section > 0 ? "mt-6" : undefined}>
            <Skeleton className="h-5 w-44" />
            <div className="mt-3 h-px bg-[#E5E7EB]" />
            <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5">
              {[0, 1].map((field) => (
                <div key={field} className="space-y-2">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-11 w-full rounded-md md:h-10" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <Skeleton className="mt-6 h-11 w-full rounded-md sm:ml-auto sm:w-36" />
      </div>
    </div>
  );
}

function ShellState({ userId, children }: { userId?: string | null; children: ReactNode }) {
  return (
    <RecordShell>
      <PageTopBar
        crumbs={EDIT_CRUMBS}
        backLabel="Edit User"
        backAriaLabel="Back to User Details"
        backHref={userId ? `/users/${userId}` : "/users"}
      />
      <PageHeading title="Edit User" description={PAGE_DESCRIPTION} />
      {children}
    </RecordShell>
  );
}

/**
 * PE-02 / FR-13.7 — the full-page edit workspace for one account.
 *
 * Account-level fields only (name, email, role, linked member) over the
 * existing PATCH /users/:id contract; status, sessions, handover and
 * password live in their own workflows.
 */
export default function UserEditPage() {
  const params = useParams();
  const id = (params?.id as string | undefined) ?? null;
  const router = useRouter();
  const { user, loading, error, notFound, refresh } = useUser(id);
  const authUser = useAuthUser();
  const canManage = canManageAccounts(authUser?.globalRoles ?? []);
  const { toast } = useToast();

  const { member } = useMember(user?.memberId ?? null);
  const mutations = useUserMutations(user?.id ?? null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [linkedMember, setLinkedMember] = useState<PickedMember | null>(null);
  const [memberTouched, setMemberTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<EditUserFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [initialisedFor, setInitialisedFor] = useState<string | null>(null);

  // Seed the form once per account — later background refetches must not
  // wipe what the operator is typing.
  useEffect(() => {
    if (!user || initialisedFor === user.id) return;
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setMemberTouched(false);
    setFieldErrors({});
    setFormError(null);
    setLinkedMember(
      user.memberId
        ? { id: user.memberId, fullName: `Member ${user.memberId.slice(0, 8)}…`, phone: null }
        : null
    );
    setInitialisedFor(user.id);
  }, [user, initialisedFor]);

  // Resolve the linked member's real name once the member record lands.
  useEffect(() => {
    if (!user || memberTouched) return;
    if (!user.memberId) {
      setLinkedMember(null);
      return;
    }
    if (member && member.id === user.memberId) {
      setLinkedMember({
        id: member.id,
        fullName: member.fullName,
        phone: member.phoneNumber ?? null,
      });
    }
  }, [user, member, memberTouched]);

  const requiresMember = LEADERSHIP_ROLE_SET.has(role);
  const userId = user?.id ?? id;

  const clearFieldError = (key: keyof EditUserFieldErrors) => {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleMemberChange = (next: PickedMember | null) => {
    setLinkedMember(next);
    setMemberTouched(true);
    clearFieldError("member");
  };

  const handleCancel = () => {
    router.push(`/users/${userId}`);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || submitting) return;

    const errors = validateEditUser({ name, email, role, member: linkedMember });
    setFieldErrors(errors);
    setFormError(null);
    if (errors.name || errors.email || errors.role || errors.member) return;

    setSubmitting(true);
    try {
      const payload: UpdateUserPayload = {
        name: name.trim(),
        email: email.trim(),
        role,
        memberId: linkedMember ? linkedMember.id : null,
        // Preserved as-is: sub-departments are not editable on this form.
        subDepartmentIds: user.subDepartments.map((sd) => sd.subDepartmentId),
      };
      await mutations.updateUser(payload);
      toast("Account updated.", "success");
      router.push(`/users/${user.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <RecordShell>
        <PageTopBar
          crumbs={EDIT_CRUMBS}
          backLabel="Edit User"
          backAriaLabel="Back to User Details"
          backHref={userId ? `/users/${userId}` : "/users"}
        />
        <PageHeading title="Edit User" description={PAGE_DESCRIPTION} />
        <EditSkeleton />
      </RecordShell>
    );
  }

  if (notFound) {
    return (
      <ShellState>
        <div className="mx-auto max-w-xl py-4">
          <EmptyState
            title="User not found"
            description="The requested account could not be found."
            action={<BackToUserDetails />}
          />
        </div>
      </ShellState>
    );
  }

  if (error || !user) {
    return (
      <ShellState>
        <div className="mx-auto max-w-xl py-4">
          <ErrorState
            title="Unable to load user"
            message={error ?? "The requested user account is unavailable."}
            onRetry={refresh}
            retryText="Try Again"
          />
          <div className="flex justify-center">
            <BackToUserDetails />
          </div>
        </div>
      </ShellState>
    );
  }

  if (!canManage) {
    return (
      <ShellState>
        <div className="mx-auto max-w-xl py-4 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">
            You do not have permission to access this page.
          </p>
          <div className="mt-4 flex justify-center">
            <BackToUserDetails userId={user.id} />
          </div>
        </div>
      </ShellState>
    );
  }

  return (
    <RecordShell>
      <PageTopBar
        crumbs={EDIT_CRUMBS}
        backLabel="Edit User"
        backAriaLabel="Back to User Details"
        backHref={`/users/${user.id}`}
      />

      {/* Desktop back navigation — phones keep the labelled arrow above. */}
      <div className="mb-3 hidden md:block">
        <BackToUserDetails userId={user.id} />
      </div>

      <PageHeading title="Edit User" description={PAGE_DESCRIPTION} />

      {/* Compact identity context — phones only (§22), never editable here. */}
      <section
        aria-label="Account summary"
        className="mb-4 flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3 md:hidden"
      >
        <Avatar
          src={user.image ?? undefined}
          name={user.name}
          size="lg"
          showStatus
          status={user.status === "DEACTIVATED" ? "offline" : "online"}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
            <span>{displayRoleTitle(user.role)}</span>
            <span aria-hidden="true">·</span>
            <AccountStatus status={user.status} />
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
          {user.memberId && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Member · <span className="font-mono">{user.memberId}</span>
              {user.subDepartments[0] && <> · {user.subDepartments[0].code}</>}
            </p>
          )}
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={submitting}
        className="rounded-lg border border-[#E5E7EB] bg-white p-4 md:p-6"
      >
        <section aria-labelledby="account-information-title" className="space-y-4">
          <SectionHeading id="account-information-title" icon={User}>
            Account Information
          </SectionHeading>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <FormField label="Full Name" required error={fieldErrors.name}>
              <Input
                id="edit-user-name"
                aria-label="Full Name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  clearFieldError("name");
                }}
                placeholder="Full name"
                autoComplete="name"
                disabled={submitting}
                error={!!fieldErrors.name}
              />
            </FormField>

            <FormField label="Email Address" required error={fieldErrors.email}>
              <Input
                id="edit-user-email"
                aria-label="Email Address"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearFieldError("email");
                }}
                placeholder="name@hitsanat.org"
                autoComplete="email"
                disabled={submitting}
                error={!!fieldErrors.email}
              />
            </FormField>
          </div>
        </section>

        <section aria-labelledby="role-organization-title" className="mt-6 space-y-4">
          <SectionHeading id="role-organization-title" icon={Users}>
            Role &amp; Organization
          </SectionHeading>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <FormField label="Role" required error={fieldErrors.role}>
              <Select
                id="edit-user-role"
                aria-label="Role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  clearFieldError("role");
                  clearFieldError("member");
                }}
                disabled={submitting}
                error={!!fieldErrors.role}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Linked Member" required={requiresMember} error={fieldErrors.member}>
              <MemberPicker
                value={linkedMember}
                onChange={handleMemberChange}
                placeholder="Search registered member..."
                disabled={submitting}
              />
            </FormField>
          </div>

          <MemberRequirementNotice />
        </section>

        {formError && (
          <div className="mt-6">
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting} className="w-full sm:w-auto">
            {submitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </RecordShell>
  );
}
