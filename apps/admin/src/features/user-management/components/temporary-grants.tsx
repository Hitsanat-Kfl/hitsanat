"use client";

import { ActionType, MAX_GRANT_DURATION_DAYS, ResourceType } from "@repo/permissions";
import { Badge, Button, FormField, Input, Select, Spinner } from "@repo/ui";
import { Clock, KeyRound, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useAuthUser } from "@/features/authentication";
import {
  grantStatus,
  usePermissionGrants,
  type PermissionGrant,
} from "../hooks/use-permission-grants";

const RESOURCE_OPTIONS = Object.values(ResourceType);
const ACTION_OPTIONS = [
  { value: ActionType.CREATE, label: "Create (C)" },
  { value: ActionType.READ, label: "Read (R)" },
  { value: ActionType.UPDATE, label: "Update (U)" },
  { value: ActionType.DELETE, label: "Delete (D)" },
  { value: ActionType.APPROVE, label: "Approve (A)" },
];
const DURATION_DAYS = [1, 3, MAX_GRANT_DURATION_DAYS];

function formatExpiry(value: string | Date): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("en-ET", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "Expired"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-border bg-background text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      {status}
    </span>
  );
}

interface GrantRowProps {
  grant: PermissionGrant;
  revoking: boolean;
  onRevoke: (id: string) => void;
}

function GrantRow({ grant, revoking, onRevoke }: GrantRowProps) {
  const status = grantStatus(grant);
  return (
    <div className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {grant.resource}:{grant.action}
          </Badge>
          <StatusPill status={status} />
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
          Expires {formatExpiry(grant.expiresAt)}
        </p>
        {grant.reason && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{grant.reason}</p>
        )}
      </div>
      {status === "Active" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={revoking}
          onClick={() => onRevoke(grant.id)}
          className="shrink-0 self-start sm:self-auto"
        >
          {revoking ? <Spinner className="h-4 w-4" /> : "Revoke"}
        </Button>
      )}
    </div>
  );
}

interface GrantFormProps {
  userId: string;
  onCreate: (payload: {
    userId: string;
    resource: string;
    action: string;
    expiresAt: string;
    reason?: string;
  }) => Promise<void>;
  creating: boolean;
}

function GrantForm({ userId, onCreate, creating }: GrantFormProps) {
  const [resource, setResource] = useState<string>(ResourceType.MEMBERS);
  const [action, setAction] = useState<string>(ActionType.CREATE);
  const [days, setDays] = useState<string>("3");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const expiresAt = new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000);
    try {
      await onCreate({
        userId,
        resource,
        action,
        expiresAt: expiresAt.toISOString(),
        reason: reason.trim() || undefined,
      });
      setReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create grant.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t pt-4" noValidate>
      <div className="grid gap-3 sm:grid-cols-3">
        <FormField label="Resource" required>
          <Select value={resource} onChange={(e) => setResource(e.target.value)}>
            {RESOURCE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Action" required>
          <Select value={action} onChange={(e) => setAction(e.target.value)}>
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Duration" required helperText={`Max ${MAX_GRANT_DURATION_DAYS} days`}>
          <Select value={days} onChange={(e) => setDays(e.target.value)}>
            {DURATION_DAYS.map((d) => (
              <option key={d} value={String(d)}>
                {d} day{d > 1 ? "s" : ""}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <FormField label="Reason (optional)">
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Secretary unavailable for member registration"
          maxLength={255}
        />
      </FormField>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" loading={creating}>
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        Grant temporary access
      </Button>
    </form>
  );
}

/**
 * BR-035 / ADR-0019: SUPER_ADMIN-only temporary permission grants for a
 * single user. Rendered only on the user detail page for Super Admins.
 */
export function TemporaryGrantsSection({ userId }: { userId: string }) {
  const authUser = useAuthUser();
  const isSuperAdmin = authUser?.globalRoles.includes("SUPER_ADMIN") ?? false;
  const { grants, loading, error, createGrant, revokeGrant, creating, revoking } =
    usePermissionGrants(isSuperAdmin ? userId : null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isSuperAdmin) return null;

  const handleRevoke = async (grantId: string) => {
    try {
      await revokeGrant(grantId);
      setNotice("Grant revoked.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Revocation failed.");
    }
  };

  const handleCreate = async (payload: Parameters<typeof createGrant>[0]) => {
    await createGrant(payload);
    setNotice("Temporary grant created.");
  };

  return (
    <section aria-labelledby="temporary-grants-heading" className="rounded-md border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="temporary-grants-heading"
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Temporary Permission Grants
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Super Admin may grant a single resource+action for up to {MAX_GRANT_DURATION_DAYS} days.
            Grants expire automatically and can be revoked early (BR-035).
          </p>
        </div>
      </div>

      {notice && (
        <output className="mt-3 flex items-center justify-between rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="ml-3 shrink-0 underline underline-offset-2"
            aria-label="Dismiss notification"
          >
            Dismiss
          </button>
        </output>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="h-4 w-4" /> Loading grants…
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && grants.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">No temporary grants for this user.</p>
      )}

      {grants.length > 0 && (
        <div className="mt-2 divide-y">
          {grants.map((grant) => (
            <GrantRow
              key={grant.id}
              grant={grant}
              revoking={revoking}
              onRevoke={(id) => {
                void handleRevoke(id);
              }}
            />
          ))}
        </div>
      )}

      <GrantForm userId={userId} onCreate={handleCreate} creating={creating} />
    </section>
  );
}
