import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
  Skeleton,
  type BreadcrumbItem,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { ArrowLeft, EllipsisVertical, Pencil } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import {
  AccountStatus,
  displayRoleTitle,
  formatCreatedDate,
  SubDepartmentChips,
} from "./user-shared";
import { MetaItem, Panel } from "./user-detail-sections";
import type { ManagedUser } from "../hooks/use-users";

const CRUMBS: BreadcrumbItem[] = [
  { label: "Administration" },
  { label: "User Accounts", href: "/users" },
  { label: "User Details" },
];

interface PageTopBarProps {
  overflow?: React.ReactNode;
  /** Desktop breadcrumb trail — defaults to the User Details trail. */
  crumbs?: BreadcrumbItem[];
  /** Mobile back-link label (the current page's own name, by convention). */
  backLabel?: string;
  backHref?: string;
  backAriaLabel?: string;
}

/**
 * Row above the dossier.
 *
 * Desktop keeps the institutional breadcrumb; phones get the compact
 * `← <page> ⋮` bar so the primary action stays in thumb reach.
 */
export function PageTopBar({
  overflow,
  crumbs = CRUMBS,
  backLabel = "User Details",
  backHref = "/users",
  backAriaLabel = "Back to User Accounts",
}: PageTopBarProps) {
  return (
    <div className="mb-4">
      <div className="hidden md:block">
        <Breadcrumb items={crumbs} />
      </div>

      <div className="flex items-center justify-between gap-2 md:hidden">
        <Link
          href={backHref}
          aria-label={backAriaLabel}
          className="-ml-2 inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
        {overflow}
      </div>
    </div>
  );
}

export interface OverflowItem {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  onClick: () => void;
  destructive?: boolean;
}

/** Secondary actions live behind this ⋮ so the identity block stays calm. */
export function OverflowMenu({ items, className }: { items: OverflowItem[]; className?: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="More actions"
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "md:h-9 md:w-9",
          className
        )}
      >
        <EllipsisVertical className="h-5 w-5" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-1">
        {items.map((item) => (
          <PopoverItem
            key={item.label}
            onClick={item.onClick}
            className={cn(
              "gap-2.5 pl-2.5",
              item.destructive && "text-[#B42318] focus:bg-[#FEF3F2] hover:bg-[#FEF3F2]"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden={true} />
            <span>{item.label}</span>
          </PopoverItem>
        ))}
      </PopoverContent>
    </Popover>
  );
}

interface UserProfileHeaderProps {
  user: ManagedUser;
  canManage: boolean;
  onEdit: () => void;
  overflow?: React.ReactNode;
}

/**
 * The primary object of the page: avatar, name, contact, role and status,
 * closed by a compact metadata strip (member id · sub-department · joined).
 *
 * Centred column on phones, three-part row from `md` up.
 */
export function UserProfileHeader({ user, canManage, onEdit, overflow }: UserProfileHeaderProps) {
  const deactivated = user.status === "DEACTIVATED";
  const subDeptCodes = user.subDepartments.map((entry) => entry.code);

  return (
    <Panel titleId="user-identity-title">
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:gap-4 md:text-left">
        <Avatar
          src={user.image ?? undefined}
          name={user.name}
          size="xl"
          showStatus
          status={deactivated ? "offline" : "online"}
          className="h-[72px] w-[72px] text-lg md:h-[76px] md:w-[76px]"
        />

        <div className="min-w-0 flex-1">
          <h2
            id="user-identity-title"
            className="text-xl font-semibold leading-tight tracking-[-0.01em] text-foreground md:text-[22px]"
          >
            {user.name}
          </h2>
          <p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p>

          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant="secondary" className="text-[11px] font-medium">
              {displayRoleTitle(user.role)}
            </Badge>
            <AccountStatus status={user.status} />
          </div>
        </div>

        {canManage && (
          <div className="hidden shrink-0 md:flex md:items-center md:gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={onEdit}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit User
            </Button>
            {overflow}
          </div>
        )}
      </div>

      {canManage && (
        <div className="mt-4 flex gap-2 md:hidden">
          <Button variant="outline" className="h-11 flex-1" onClick={onEdit}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit User
          </Button>
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#F1F3F5] pt-4 sm:grid-cols-3">
        <MetaItem label="Member ID">
          {user.memberId ? (
            <span className="break-all font-mono text-[13px]">{user.memberId}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </MetaItem>
        <MetaItem label="Sub-department">
          {subDeptCodes.length > 0 ? (
            <SubDepartmentChips codes={subDeptCodes} />
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </MetaItem>
        <MetaItem label="Joined">{formatCreatedDate(user.createdAt)}</MetaItem>
      </dl>
    </Panel>
  );
}

/** Page heading — hidden visually on phones, where the top bar owns the title. */
export function PageHeading({
  description,
  title = "User Details",
}: { description: string; title?: string }) {
  return (
    <header className="mb-4 md:mb-5">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        <span className="sr-only md:not-sr-only">{title}</span>
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </header>
  );
}

/** Mirrors the loaded dossier so the page never jumps when data lands. */
export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading user details…</span>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-7 xl:col-span-4">
          <Skeleton className="h-[196px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-5 xl:col-span-3">
          <Skeleton className="h-[196px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-12 xl:col-span-4 xl:col-start-9">
          <Skeleton className="h-[196px] w-full rounded-lg" />
        </div>
      </div>

      <div className="mt-5 border-b border-[#E5E7EB] pb-0">
        <div className="flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-7">
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-[180px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-12">
          <Skeleton className="h-[220px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
