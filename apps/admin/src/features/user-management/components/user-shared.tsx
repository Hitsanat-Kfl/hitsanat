import { ASSIGNABLE_ROLES, LEADERSHIP_ROLE_SET, type ManagedUser } from "../hooks/use-users";

export function isLeadershipRole(role: string): boolean {
  return (
    role === "SUPER_ADMIN" ||
    role === "CHAIRPERSON" ||
    role === "SUB_CHAIRPERSON" ||
    role === "SECRETARY"
  );
}

export function formatCreatedDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Date + time stamp used by the account dossier rows, e.g.
 * `Sep 12, 2026 · 10:24 AM`.
 */
export function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  const date = parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}

export function displayRole(role: string): string {
  return role.replaceAll("_", " ");
}

const ROLE_TITLES: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  CHAIRPERSON: "Chairperson",
  SUB_CHAIRPERSON: "Sub-Chairperson",
  SECRETARY: "Secretary",
  MEMBER_REGULAR: "Regular Member",
};

/** Friendly role label used on mobile cards / profile (title case). */
export function displayRoleTitle(role: string): string {
  return ROLE_TITLES[role] ?? role.replaceAll("_", " ");
}

export function AccountStatus({ status }: { status: ManagedUser["status"] }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[#067647]">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16834A] shadow-[0_0_0_3px_rgba(22,131,74,0.12)]"
          aria-hidden="true"
        />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#98A2B3]" aria-hidden="true" />
      Deactivated
    </span>
  );
}

/**
 * Role choices for the account forms, derived from the project's
 * assignable-role definition (BR-008) with human-readable labels.
 */
export const ROLE_OPTIONS = ASSIGNABLE_ROLES.map((value) => ({
  value,
  label: displayRoleTitle(value),
}));

export interface EditUserFieldErrors {
  name?: string;
  email?: string;
  role?: string;
  member?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Client-side layer for the edit form (§11 of the Edit User spec): BR-007
 * leadership-needs-member and basic field presence. The backend stays
 * authoritative — BR-009 conflicts and every other guard come from the API.
 */
export function validateEditUser(values: {
  name: string;
  email: string;
  role: string;
  member: { id: string } | null;
}): EditUserFieldErrors {
  const errors: EditUserFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.role) {
    errors.role = "Role is required.";
  } else if (LEADERSHIP_ROLE_SET.has(values.role) && !values.member) {
    errors.member = "Leadership roles require a linked active member (BR-007).";
  }

  return errors;
}

/** First validation message, for the dialog's single form-level error. */
export function firstEditUserError(errors: EditUserFieldErrors): string | null {
  return errors.name ?? errors.email ?? errors.role ?? errors.member ?? null;
}

export function SubDepartmentChips({ codes }: { codes: string[] }) {
  if (codes.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const visible = codes.slice(0, 2);
  const remaining = codes.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((code) => (
        <span
          key={code}
          className="inline-flex h-[22px] items-center rounded border border-[#E8DDE0] bg-[#F4F0F1] px-1.5 text-[11px] font-medium text-[#5F0113]"
        >
          {code}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-[11px] font-medium text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
