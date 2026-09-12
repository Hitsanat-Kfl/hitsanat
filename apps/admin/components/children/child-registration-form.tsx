"use client";

import { Button, Input, Select } from "@repo/ui";
import { useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { Child, CollectionLocation, KutrGroup } from "../../lib/types";

const KUTR_GROUPS: KutrGroup[] = ["Kutr 1", "Kutr 2"];
const COLLECTION_LOCATIONS: CollectionLocation[] = [
  "Apartama",
  "Gende Boy",
  "Gende Je",
  "Cobalt",
  "Bate",
];

interface ChildRegistrationFormProps {
  onSuccess?: (child: Child) => void;
  onCancel?: () => void;
}

export function ChildRegistrationForm({ onSuccess, onCancel }: ChildRegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    christianName: "",
    gender: "" as "Male" | "Female" | "",
    dateOfBirth: "",
    address: "",
    kutrGroup: "" as KutrGroup | "",
    collectionLocation: "" as CollectionLocation | "",
    photoUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.christianName.trim()) newErrors.christianName = "Christian name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.kutrGroup) newErrors.kutrGroup = "Kutr group is required";
    if (!formData.collectionLocation)
      newErrors.collectionLocation = "Collection location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        gender: formData.gender as "Male" | "Female",
        kutrGroup: formData.kutrGroup as KutrGroup,
        collectionLocation: formData.collectionLocation as CollectionLocation,
        photoUrl: formData.photoUrl || undefined,
      };

      const response = await api.post<ApiResponse<Child>>("/children", payload);
      onSuccess?.(response.data);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Register New Child</h2>

      {errors.submit && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="child-fullName" className="text-sm font-medium">
            Full Name *
          </label>
          <Input
            id="child-fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Full name"
          />
          {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="child-christianName" className="text-sm font-medium">
            Christian Name *
          </label>
          <Input
            id="child-christianName"
            value={formData.christianName}
            onChange={(e) => setFormData({ ...formData, christianName: e.target.value })}
            placeholder="Christian name"
          />
          {errors.christianName && (
            <p className="text-xs text-destructive mt-1">{errors.christianName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="child-gender" className="text-sm font-medium">
            Gender *
          </label>
          <Select
            id="child-gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })
            }
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
        </div>
        <div>
          <label htmlFor="child-dateOfBirth" className="text-sm font-medium">
            Date of Birth *
          </label>
          <Input
            id="child-dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="child-address" className="text-sm font-medium">
          Address *
        </label>
        <Input
          id="child-address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Address"
        />
        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="child-kutrGroup" className="text-sm font-medium">
            Kutr Group * (BR-012)
          </label>
          <Select
            id="child-kutrGroup"
            value={formData.kutrGroup}
            onChange={(e) => setFormData({ ...formData, kutrGroup: e.target.value as KutrGroup })}
          >
            <option value="">Select kutr group</option>
            {KUTR_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </Select>
          {errors.kutrGroup && <p className="text-xs text-destructive mt-1">{errors.kutrGroup}</p>}
        </div>
        <div>
          <label htmlFor="child-collectionLocation" className="text-sm font-medium">
            Collection Location * (BR-013)
          </label>
          <Select
            id="child-collectionLocation"
            value={formData.collectionLocation}
            onChange={(e) =>
              setFormData({ ...formData, collectionLocation: e.target.value as CollectionLocation })
            }
          >
            <option value="">Select location</option>
            {COLLECTION_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
          {errors.collectionLocation && (
            <p className="text-xs text-destructive mt-1">{errors.collectionLocation}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="child-photoUrl" className="text-sm font-medium">
          Photo URL
        </label>
        <Input
          id="child-photoUrl"
          value={formData.photoUrl}
          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Registering..." : "Register Child"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
