"use client";

import { Button, Input, Select } from "@repo/ui";
import { useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { Member, SubDeptCode } from "../../lib/types";

const SUB_DEPARTMENTS: { value: SubDeptCode; label: string }[] = [
  { value: "TIMIHRT", label: "ትምህርት (Timihrt)" },
  { value: "MEZMUR", label: "መዝሙር (Mezmur)" },
  { value: "KUTITR", label: "ቁጥጥር (Kutitr)" },
  { value: "EKD", label: "እቅድ (Ekd)" },
  { value: "KINETIBEB", label: "ኪነ-ጥበብ (Kinetibeb)" },
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "GC"] as const;

interface Stage1Data {
  fullName: string;
  christianName: string;
  phoneNumber: string;
  yearOfStudy: string;
  academicDepartment: string;
  campus: string;
  gender: string;
}

interface Stage2Data {
  subDepartmentIds: string[];
  familyId: string;
  photoUrl: string;
  telegramUsername: string;
}

interface MemberRegistrationWizardProps {
  onSuccess?: (member: Member) => void;
  onCancel?: () => void;
}

export function MemberRegistrationWizard({ onSuccess, onCancel }: MemberRegistrationWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [stage1, setStage1] = useState<Stage1Data>({
    fullName: "",
    christianName: "",
    phoneNumber: "",
    yearOfStudy: "",
    academicDepartment: "",
    campus: "",
    gender: "",
  });
  const [stage2, setStage2] = useState<Stage2Data>({
    subDepartmentIds: [],
    familyId: "",
    photoUrl: "",
    telegramUsername: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  const validateStage1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!stage1.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!stage1.christianName.trim()) newErrors.christianName = "Christian name is required";
    if (!stage1.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(stage1.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number";
    if (!stage1.yearOfStudy) newErrors.yearOfStudy = "Year of study is required";
    if (!stage1.academicDepartment.trim())
      newErrors.academicDepartment = "Academic department is required";
    if (!stage1.campus.trim()) newErrors.campus = "Campus is required";
    if (!stage1.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStage1Submit = async () => {
    if (!validateStage1()) return;

    setLoading(true);
    try {
      const response = await api.post<ApiResponse<{ id: string }>>("/members/stage1", stage1);
      setMemberId(response.data.id);
      setStep(2);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleStage2Submit = async () => {
    if (!memberId) return;

    setLoading(true);
    try {
      const payload = {
        ...stage2,
        subDepartmentIds: stage2.subDepartmentIds.filter(Boolean),
        familyId: stage2.familyId || undefined,
        photoUrl: stage2.photoUrl || undefined,
        telegramUsername: stage2.telegramUsername || undefined,
      };

      const response = await api.patch<ApiResponse<Member>>(`/members/${memberId}/stage2`, payload);
      onSuccess?.(response.data);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSubDept = (code: string) => {
    setStage2((prev) => ({
      ...prev,
      subDepartmentIds: prev.subDepartmentIds.includes(code)
        ? prev.subDepartmentIds.filter((id) => id !== code)
        : [...prev.subDepartmentIds, code],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Register New Member</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Step {step} of 2 — {step === 1 ? "Personal Information" : "Department Assignment"}
        </p>
        <div className="flex gap-2 mt-3">
          <div className={`h-1 flex-1 rounded ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1 flex-1 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
          {errors.submit}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-fullName" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="reg-fullName"
                value={stage1.fullName}
                onChange={(e) => setStage1({ ...stage1, fullName: e.target.value })}
                placeholder="Full name"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label htmlFor="reg-christianName" className="text-sm font-medium">
                Christian Name *
              </label>
              <Input
                id="reg-christianName"
                value={stage1.christianName}
                onChange={(e) => setStage1({ ...stage1, christianName: e.target.value })}
                placeholder="Christian name"
              />
              {errors.christianName && (
                <p className="text-xs text-destructive mt-1">{errors.christianName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-phoneNumber" className="text-sm font-medium">
                Phone Number *
              </label>
              <Input
                id="reg-phoneNumber"
                value={stage1.phoneNumber}
                onChange={(e) => setStage1({ ...stage1, phoneNumber: e.target.value })}
                placeholder="+251 9XX XXX XXX"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label htmlFor="reg-gender" className="text-sm font-medium">
                Gender *
              </label>
              <Select
                id="reg-gender"
                value={stage1.gender}
                onChange={(e) => setStage1({ ...stage1, gender: e.target.value })}
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
              <label htmlFor="reg-yearOfStudy" className="text-sm font-medium">
                Year of Study *
              </label>
              <Select
                id="reg-yearOfStudy"
                value={stage1.yearOfStudy}
                onChange={(e) => setStage1({ ...stage1, yearOfStudy: e.target.value })}
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
              <label htmlFor="reg-campus" className="text-sm font-medium">
                Campus *
              </label>
              <Input
                id="reg-campus"
                value={stage1.campus}
                onChange={(e) => setStage1({ ...stage1, campus: e.target.value })}
                placeholder="e.g. Main Campus"
              />
              {errors.campus && <p className="text-xs text-destructive mt-1">{errors.campus}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="reg-academicDepartment" className="text-sm font-medium">
              Academic Department *
            </label>
            <Input
              id="reg-academicDepartment"
              value={stage1.academicDepartment}
              onChange={(e) => setStage1({ ...stage1, academicDepartment: e.target.value })}
              placeholder="e.g. Computer Science"
            />
            {errors.academicDepartment && (
              <p className="text-xs text-destructive mt-1">{errors.academicDepartment}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleStage1Submit} disabled={loading}>
              {loading ? "Saving..." : "Continue to Step 2"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Sub-Departments *</p>
            <p className="text-xs text-muted-foreground mb-2">Select one or more departments</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUB_DEPARTMENTS.map((dept) => (
                <label
                  key={dept.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    stage2.subDepartmentIds.includes(dept.value)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={stage2.subDepartmentIds.includes(dept.value)}
                    onChange={() => toggleSubDept(dept.value)}
                    className="rounded"
                  />
                  <span className="text-sm">{dept.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-telegramUsername" className="text-sm font-medium">
                Telegram Username
              </label>
              <Input
                id="reg-telegramUsername"
                value={stage2.telegramUsername}
                onChange={(e) => setStage2({ ...stage2, telegramUsername: e.target.value })}
                placeholder="@username"
              />
            </div>
            <div>
              <label htmlFor="reg-photoUrl" className="text-sm font-medium">
                Photo URL
              </label>
              <Input
                id="reg-photoUrl"
                value={stage2.photoUrl}
                onChange={(e) => setStage2({ ...stage2, photoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleStage2Submit} disabled={loading}>
              {loading ? "Saving..." : "Complete Registration"}
            </Button>
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
