"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
} from "@repo/ui";
import { useState } from "react";

interface ResetPasswordDialogProps {
  userName: string;
  onConfirm: (newPassword: string) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

/**
 * Admin-triggered credential reset (BR-008). The admin sets a temporary
 * password and shares it out-of-band; the user should change it after
 * signing in.
 */
export function ResetPasswordDialog({
  userName,
  onConfirm,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm(password);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Set a temporary password for {userName}. They should change it after signing in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="New password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
            />
          </FormField>

          <FormField label="Confirm password" required error={error ?? undefined}>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Reset password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
