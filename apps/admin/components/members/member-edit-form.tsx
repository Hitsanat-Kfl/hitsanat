"use client";

import { Button, Input, Select, Spinner } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { Member, SubDeptCode, YearOfStudy } from "../../lib/types";

const SUB_DEPARTMENTS: { value: SubDeptCode; label: string }[] = [
  { value: "TIMIHRT", label: "ትምህርት (Timihrt)" },
  { value: "MEZMUR", label: "መዝሙር (Mezmur)" },
  { value: "KUTITR", label: "ቁጥጥር (Kutitr)" },
  { value: "EKD", label: "እቅድ (Ekd)" },
  { value: "KINETIBEB", label: "ኪነ-ጥበብ (Kinetibeb)" },
];

const YEARS: YearOfStudy[] = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "GC"];

interface MemberEditFormProps {
  memberId: string;
  onSuccess?: (member: Member) => void;
  onCancel?: () => void;
}

export function MemberEditForm({ memberId, onSuccess, onCancel }: MemberEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [member, setMember] = useState<Partial<Member>>({});

  const fetchMember = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<Member>>(`/members/${memberId}`);
      setMember(response.data);
    } catch (err) {
      setErrors({ fetch: err instanceof Error ? err.message : "Failed to load member" });
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!member.fullName?.trim()) newErrors.fullName = "Full name is required";
    if (!member.christianName?.trim()) newErrors.christianName = "Christian name is required";
    if (!member.phoneNumber?.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(member.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";
    if (!member.yearOfStudy) newErrors.yearOfStudy = "Year of study is required";
    if (!member.academicDepartment?.trim())
      newErrors.academicDepartment = "Academic department is required";
    if (!member.campus?.trim()) newErrors.campus = "Campus is required";
    if (!member.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await api.put<ApiResponse<Member>>(`/members/${memberId}`, {
        fullName: member.fullName,
        christianName: member.christianName,
        phoneNumber: member.phoneNumber,
        yearOfStudy: member.yearOfStudy,
        academicDepartment: member.academicDepartment,
        campus: member.campus,
        gender: member.gender,
        photoUrl: member.photoUrl || undefined,
        telegramUsername: member.telegramUsername || undefined,
        isActive: member.isActive,
      });
      onSuccess?.(response.data);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{errors.fetch}</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Edit Member</h2>

      {errors.submit && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-fullName" className="text-sm font-medium">
            Full Name *
          </label>
          <Input
            id="edit-fullName"
            value={member.fullName || ""}
            onChange={(e) => setMember({ ...member, fullName: e.target.value })}
          />
          {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="edit-christianName" className="text-sm font-medium">
            Christian Name *
          </label>
          <Input
            id="edit-christianName"
            value={member.christianName || ""}
            onChange={(e) => setMember({ ...member, christianName: e.target.value })}
          />
          {errors.christianName && (
            <p className="text-xs text-destructive mt-1">{errors.christianName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-phoneNumber" className="text-sm font-medium">
            Phone Number *
          </label>
          <Input
            id="edit-phoneNumber"
            value={member.phoneNumber || ""}
            onChange={(e) => setMember({ ...member, phoneNumber: e.target.value })}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive mt-1">{errors.phoneNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="edit-gender" className="text-sm font-medium">
            Gender *
          </label>
          <Select
            id="edit-gender"
            value={member.gender || ""}
            onChange={(e) => setMember({ ...member, gender: e.target.value as "Male" | "Female" })}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-yearOfStudy" className="text-sm font-medium">
            Year of Study *
          </label>
          <Select
            id="edit-yearOfStudy"
            value={member.yearOfStudy || ""}
            onChange={(e) => setMember({ ...member, yearOfStudy: e.target.value as YearOfStudy })}
          >
            <option value="">Select year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          {errors.yearOfStudy && (
            <p className="text-xs text-destructive mt-1">{errors.yearOfStudy}</p>
          )}
        </div>
        <div>
          <label htmlFor="edit-campus" className="text-sm font-medium">
            Campus *
          </label>
          <Input
            id="edit-campus"
            value={member.campus || ""}
            onChange={(e) => setMember({ ...member, campus: e.target.value })}
          />
          {errors.campus && <p className="text-xs text-destructive mt-1">{errors.campus}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="edit-academicDepartment" className="text-sm font-medium">
          Academic Department *
        </label>
        <Input
          id="edit-academicDepartment"
          value={member.academicDepartment || ""}
          onChange={(e) => setMember({ ...member, academicDepartment: e.target.value })}
        />
        {errors.academicDepartment && (
          <p className="text-xs text-destructive mt-1">{errors.academicDepartment}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-telegramUsername" className="text-sm font-medium">
            Telegram Username
          </label>
          <Input
            id="edit-telegramUsername"
            value={member.telegramUsername || ""}
            onChange={(e) => setMember({ ...member, telegramUsername: e.target.value })}
            placeholder="@username"
          />
        </div>
        <div>
          <label htmlFor="edit-photoUrl" className="text-sm font-medium">
            Photo URL
          </label>
          <Input
            id="edit-photoUrl"
            value={member.photoUrl || ""}
            onChange={(e) => setMember({ ...member, photoUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="edit-isActive"
          checked={member.isActive ?? true}
          onChange={(e) => setMember({ ...member, isActive: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="edit-isActive" className="text-sm font-medium">
          Active Member
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={onCancel || (() => router.back())}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
