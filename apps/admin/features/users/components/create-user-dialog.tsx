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
  Select,
  Spinner,
} from "@repo/ui";
import { useState } from "react";
import { type CreateUserPayload, LEADERSHIP_ROLE_SET } from "../hooks/use-users";
import { MemberPicker, type PickedMember } from "./member-picker";
import { SubDepartmentPicker } from "./sub-department-picker";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: CreateUserPayload) => Promise<void>;
}

const ROLE_OPTIONS = [
  { value: "SECRETARY", label: "Secretary" },
  { value: "SUB_CHAIRPERSON", label: "Sub-Chairperson" },
  { value: "CHAIRPERSON", label: "Chairperson" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MEMBER_REGULAR", label: "Regular Member" },
];

/**
 * Provision a new account (BR-008). Leadership roles require a linked
 * member id (BR-007) — enforced again server-side.
 */
export function CreateUserDialog({ open, onOpenChange, onCreate }: CreateUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [member, setMember] = useState<PickedMember | null>(null);
  const [subDepartmentIds, setSubDepartmentIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const requiresMember = role !== "" && LEADERSHIP_ROLE_SET.has(role);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setMember(null);
    setSubDepartmentIds([]);
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!name || !email || !password || !role) {
      setFormError("Name, email, password, and role are required.");
      return;
    }
    if (requiresMember && !member) {
      setFormError("Leadership roles require a member link (BR-007).");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        name,
        email,
        password,
        role,
        ...(member ? { memberId: member.id } : {}),
        ...(subDepartmentIds.length > 0 ? { subDepartmentIds } : {}),
      });
      resetForm();
      onOpenChange(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Account creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create user account</DialogTitle>
          <DialogDescription>
            Credentials are provisioned in the auth system and the account is mirrored locally.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField label="Full name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hitsanat.org"
              autoComplete="off"
            />
          </FormField>

          <FormField
            label="Temporary password"
            required
            helperText="Minimum 8 characters. The user should change it after first sign-in."
          >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Temporary password"
              autoComplete="new-password"
            />
          </FormField>

          <FormField
            label="Role"
            required
            error={formError?.startsWith("Leadership") ? formError : undefined}
            helperText={requiresMember ? undefined : "Leadership roles require a member link."}
          >
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Select role"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Linked member"
            required={requiresMember}
            helperText={
              requiresMember
                ? "Required for leadership roles (BR-007). Search by name or phone."
                : "Optional — link this account to a registered member."
            }
          >
            <MemberPicker value={member} onChange={setMember} />
          </FormField>

          {member && (
            <FormField
              label="Sub-departments"
              helperText="Optional — assign this account to one or more sub-departments."
            >
              <SubDepartmentPicker
                value={subDepartmentIds}
                onChange={setSubDepartmentIds}
                disabled={submitting}
              />
            </FormField>
          )}

          {formError && !formError.startsWith("Leadership") && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}

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
              Create account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
