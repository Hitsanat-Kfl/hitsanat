import { cn } from "@repo/ui/lib/utils";
import {
  ArrowRightLeft,
  ChevronRight,
  KeyRound,
  Pencil,
  RefreshCw,
  ShieldOff,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { SectionTitle, Panel } from "./user-detail-sections";
import { LEADERSHIP_ROLE_SET, type ManagedUser } from "../hooks/use-users";

export interface AdminAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  destructive?: boolean;
  onClick: () => void;
}

function ActionRow({ action }: { action: AdminAction }) {
  const Icon = action.icon;
  return (
    <button
      type="button"
      onClick={action.onClick}
      className={cn(
        "group flex w-full items-center gap-3 border-b border-[#F1F3F5] py-3 text-left transition-colors last:border-b-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          action.destructive ? "bg-[#FEF3F2] text-[#B42318]" : "bg-[#FBF1F3] text-[#5F0113]"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm font-semibold",
            action.destructive ? "text-[#B42318]" : "text-foreground"
          )}
        >
          {action.label}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{action.description}</span>
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  );
}

interface UserAdminActionsProps {
  actions: AdminAction[];
  titleId?: string;
}

/**
 * The administrative action list — rows, not a wall of buttons.
 *
 * The caller decides which actions exist (authorization happens upstream);
 * this component only renders the set it is given.
 */
export function UserAdminActions({
  actions,
  titleId = "user-admin-actions-title",
}: UserAdminActionsProps) {
  return (
    <Panel titleId={titleId}>
      <SectionTitle id={titleId}>Administrative Actions</SectionTitle>
      <div className="mt-2">
        {actions.map((action) => (
          <ActionRow key={action.id} action={action} />
        ))}
      </div>
    </Panel>
  );
}

/** Action set for an account the viewer is allowed to manage. */
export function buildAdminActions({
  user,
  onEdit,
  onResetPassword,
  onHandover,
  onRevokeSessions,
  onDeactivate,
  onReactivate,
}: {
  user: ManagedUser;
  onEdit: () => void;
  onResetPassword: () => void;
  onHandover: () => void;
  onRevokeSessions: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}): AdminAction[] {
  const deactivated = user.status === "DEACTIVATED";

  const actions: AdminAction[] = [
    {
      id: "edit",
      label: "Edit User",
      description: "Update account information and settings",
      icon: Pencil,
      onClick: onEdit,
    },
    {
      id: "reset-password",
      label: "Reset Password",
      description: "Generate a new temporary password",
      icon: KeyRound,
      onClick: onResetPassword,
    },
  ];

  // Handover is a leadership rotation (FR-13.9) — only meaningful for the
  // roles the backend accepts it for.
  if (LEADERSHIP_ROLE_SET.has(user.role)) {
    actions.push({
      id: "handover",
      label: "Handover",
      description: "Transfer account responsibility",
      icon: ArrowRightLeft,
      onClick: onHandover,
    });
  }

  actions.push({
    id: "revoke-sessions",
    label: "Revoke Sessions",
    description: "Sign out all active sessions",
    icon: ShieldOff,
    onClick: onRevokeSessions,
  });

  actions.push(
    deactivated
      ? {
          id: "status",
          label: "Reactivate",
          description: "Restore sign-in access for this account",
          icon: RefreshCw,
          onClick: onReactivate,
        }
      : {
          id: "status",
          label: "Deactivate",
          description: "Disable account access",
          icon: UserX,
          destructive: true,
          onClick: onDeactivate,
        }
  );

  return actions;
}
