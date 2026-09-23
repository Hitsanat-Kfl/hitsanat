"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@repo/ui";
import { useState } from "react";
import { LEADERSHIP_ROLE_SET, type ManagedUser } from "../hooks/use-users";
import { MemberPicker, type PickedMember } from "./member-picker";

interface HandoverDialogProps {
  user: ManagedUser;
  onOpenChange: (open: boolean) => void;
  onCreateSuccessor: (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    memberId: string;
  }) => Promise<void>;
  /** Step 2: demote the outgoing leader off their leadership role (FR-13.9). */
  onDemoteOutgoing: (userId: string) => Promise<void>;
  onDeactivateOutgoing: (userId: string) => Promise<void>;
}

const STEPS = [
  "Provision the successor's account",
  "Demote the outgoing leader",
  "Deactivate the outgoing leader",
] as const;

/**
 * PE-04 / FR-13.9: guided leadership handover for the annual rotation.
 * Walks the documented three-step sequence with validation at each step:
 *   1. create the successor's account (BR-008) linked to the incoming
 *      member (BR-007), taking over the outgoing leader's role;
 *   2. demote the outgoing leader off the leadership role (PATCH role);
 *   3. deactivate the outgoing leader's account.
 */
export function HandoverDialog({
  user,
  onOpenChange,
  onCreateSuccessor,
  onDemoteOutgoing,
  onDeactivateOutgoing,
}: HandoverDialogProps) {
  const [step, setStep] = useState(0);
  const [successorName, setSuccessorName] = useState("");
  const [successorEmail, setSuccessorEmail] = useState("");
  const [successorPassword, setSuccessorPassword] = useState("");
  const [successorMember, setSuccessorMember] = useState<PickedMember | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isLeadership = LEADERSHIP_ROLE_SET.has(user.role);

  const handleCreateSuccessor = async () => {
    setError(null);
    if (!successorName.trim() || !successorEmail.trim() || !successorPassword) {
      setError("Successor name, email, and a temporary password are required.");
      return;
    }
    if (isLeadership && !successorMember) {
      setError("The successor must be linked to a registered member (BR-007).");
      return;
    }
    setBusy(true);
    try {
      await onCreateSuccessor({
        name: successorName.trim(),
        email: successorEmail.trim(),
        password: successorPassword,
        role: user.role,
        memberId: successorMember?.id ?? "",
      });
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Successor account creation failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleDemoteOutgoing = async () => {
    setError(null);
    setBusy(true);
    try {
      await onDemoteOutgoing(user.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role demotion failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivateOutgoing = async () => {
    setError(null);
    setBusy(true);
    try {
      await onDeactivateOutgoing(user.id);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deactivation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Leadership handover — {user.role}</DialogTitle>
          <DialogDescription>
            Guided rotation: provision the successor with the same role, demote {user.name} off the
            leadership post, then deactivate their account. BR-009 conflicts are validated at each
            step.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-1 text-sm text-muted-foreground" aria-label="Handover steps">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={index === step && !done ? "font-medium text-foreground" : ""}
            >
              {index + 1}. {label}
              {(index < step || done) && " ✓"}
            </li>
          ))}
        </ol>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {done ? (
          <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            Handover complete. {user.name}&apos;s account is deactivated and the successor holds the{" "}
            {user.role} role.
          </div>
        ) : step === 0 ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Successor full name</span>
                <input
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                  value={successorName}
                  onChange={(e) => setSuccessorName(e.target.value)}
                  autoComplete="off"
                  aria-label="Successor full name"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Successor email</span>
                <input
                  type="email"
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                  value={successorEmail}
                  onChange={(e) => setSuccessorEmail(e.target.value)}
                  autoComplete="off"
                  aria-label="Successor email"
                />
              </label>
            </div>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Temporary password</span>
              <input
                type="password"
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                value={successorPassword}
                onChange={(e) => setSuccessorPassword(e.target.value)}
                autoComplete="new-password"
                aria-label="Temporary password"
              />
            </label>
            {isLeadership && (
              <div className="block space-y-1 text-sm">
                <span className="font-medium">Successor&apos;s member record (BR-007)</span>
                <MemberPicker value={successorMember} onChange={setSuccessorMember} />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={handleCreateSuccessor} disabled={busy}>
                {busy ? <Spinner size="sm" /> : null}
                Create successor account
              </Button>
            </DialogFooter>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm">
              The successor holds the {user.role} role. Demote{" "}
              <span className="font-medium">{user.name}</span> ({user.email}) to a regular member so
              only the successor holds the leadership post.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={handleDemoteOutgoing} disabled={busy}>
                {busy ? <Spinner size="sm" /> : null}
                Demote outgoing leader
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              {user.name} no longer holds the leadership post. Deactivating{" "}
              <span className="font-medium">{user.name}</span> ({user.email}) blocks their sign-in
              immediately.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeactivateOutgoing} disabled={busy}>
                {busy ? <Spinner size="sm" /> : null}
                Deactivate outgoing leader
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
