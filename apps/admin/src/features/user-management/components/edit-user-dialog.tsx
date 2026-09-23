"use client";

import {
  Badge,
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
} from "@repo/ui";
import { useEffect, useState } from "react";
import { api } from "@/infrastructure/api/client";
import { LEADERSHIP_ROLE_SET, type ManagedUser, type UpdateUserPayload } from "../hooks/use-users";
import {
  formatMemberLabel,
  MemberPicker,
  type MemberApiRow,
  type PickedMember,
} from "./member-picker";
import { SubDepartmentPicker } from "./sub-department-picker";

const ROLE_OPTIONS = [
  { value: "SECRETARY", label: "Secretary" },
  { value: "SUB_CHAIRPERSON", label: "Sub-Chairperson" },
  { value: "CHAIRPERSON", label: "Chairperson" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MEMBER_REGULAR", label: "Regular Member" },
];

interface EditUserDialogProps {
  user: ManagedUser;
  onOpenChange: (open: boolean) => void;
  onUpdate: (userId: string, payload: UpdateUserPayload) => Promise<void>;
}

/**
 * PE-02 / FR-13.7: edit a user account — full name, email, role, and
 * linked member — wired to PATCH /users/:id. Role changes re-validate
 * BR-007 (leadership requires member) and BR-009 (one leadership post)
 * server-side; conflict errors are surfaced here.
 */
export function EditUserDialog({ user, onOpenChange, onUpdate }: EditUserDialogProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [member, setMember] = useState<PickedMember | null>(null);
  const [subDepartmentIds, setSubDepartmentIds] = useState<string[]>(
    user.subDepartments.map((sd) => sd.subDepartmentId)
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setSubDepartmentIds(user.subDepartments.map((sd) => sd.subDepartmentId));
    if (!user.memberId) {
      setMember(null);
      return;
    }
    // PE-02: resolve the linked member's real name/phone so the dialog
    // shows who the account is linked to instead of a placeholder.
    let cancelled = false;
    const memberId = user.memberId;
    setMember({ id: memberId, fullName: `Member ${memberId.slice(0, 8)}…`, phone: null });
    api
      .get<{ data: MemberApiRow }>(`/members/${memberId}`)
      .then((response) => {
        if (cancelled || !response?.data) return;
        const { name, phone } = formatMemberLabel(response.data);
        setMember({ id: memberId, fullName: name, phone });
      })
      .catch(() => {
        /* keep the id-based placeholder if the member lookup fails */
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const requiresMember = LEADERSHIP_ROLE_SET.has(role);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    if (requiresMember && !member) {
      setFormError("Leadership roles require a member link (BR-007).");
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateUserPayload = {
        name: name.trim(),
        email: email.trim(),
        role,
        memberId: member ? member.id : null,
        subDepartmentIds,
      };
      await onUpdate(user.id, payload);
      onOpenChange(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit user account</DialogTitle>
          <DialogDescription>
            Changes to role and member link are re-validated against BR-007 and BR-009.
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

          <FormField label="Role" required>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
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

          <div className="flex items-center gap-2">
            <Badge variant="outline">{user.status}</Badge>
            {user.status === "DEACTIVATED" && (
              <span className="text-xs text-muted-foreground">
                Deactivated accounts cannot sign in until reactivated.
              </span>
            )}
          </div>

          {formError && (
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
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
