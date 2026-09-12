"use client";

import { Button, Select, Spinner } from "@repo/ui";
import { useCallback, useEffect, useState } from "react";
import { type ApiResponse, api } from "../../lib/api-client";
import type { Child, Parent, ParentRelation, ParentWithRelation } from "../../lib/types";

interface ParentLinkingDialogProps {
  child: Child;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ParentLinkingDialog({ child, onSuccess, onCancel }: ParentLinkingDialogProps) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [linkedParents, setLinkedParents] = useState<ParentWithRelation[]>([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [relation, setRelation] = useState<ParentRelation | "">("");
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [parentsRes, linkedRes] = await Promise.all([
        api.get<ApiResponse<Parent[]>>("/children/parents/all"),
        api.get<ApiResponse<ParentWithRelation[]>>(`/children/${child.id}/parents`),
      ]);
      setParents(parentsRes.data);
      setLinkedParents(linkedRes.data);
    } catch (err) {
      setErrors({ fetch: err instanceof Error ? err.message : "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }, [child.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLink = async () => {
    if (!selectedParentId || !relation) {
      setErrors({ link: "Select a parent and relation" });
      return;
    }

    // BR-010: Check if child already has this relation
    const existingRelation = linkedParents.find((p) => p.relation === relation);
    if (existingRelation) {
      setErrors({ link: `Child already has a ${relation} linked` });
      return;
    }

    setLinking(true);
    setErrors({});
    try {
      await api.post(`/children/${child.id}/parents`, {
        parentId: selectedParentId,
        relation,
      });
      setSelectedParentId("");
      setRelation("");
      await fetchData();
      onSuccess?.();
    } catch (err) {
      setErrors({ link: err instanceof Error ? err.message : "Failed to link parent" });
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = async (childParentId: string, parentId: string) => {
    setLinking(true);
    try {
      await api.delete(`/children/${child.id}/parents/${parentId}`);
      await fetchData();
    } catch (err) {
      setErrors({ link: err instanceof Error ? err.message : "Failed to unlink parent" });
    } finally {
      setLinking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Manage Parents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Link or unlink parents for {child.fullName}
        </p>
      </div>

      {errors.fetch && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errors.fetch}
        </div>
      )}

      {/* Current Links */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Current Parents</h3>
        {linkedParents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No parents linked yet</p>
        ) : (
          linkedParents.map((parent) => (
            <div
              key={parent.childParentId}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <span className="font-medium">{parent.fullName}</span>
                <span className="ml-2 text-sm text-muted-foreground">({parent.relation})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnlink(parent.childParentId, parent.id)}
                disabled={linking}
              >
                Unlink
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Link New Parent */}
      <div className="space-y-4 p-4 rounded-lg border bg-accent/30">
        <h3 className="text-sm font-medium">Link New Parent</h3>

        {errors.link && (
          <div className="p-2 rounded bg-destructive/10 text-destructive text-xs">
            {errors.link}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="parent-select" className="text-sm font-medium">
              Parent
            </label>
            <Select
              id="parent-select"
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
            >
              <option value="">Select parent</option>
              {parents
                .filter((p) => !linkedParents.some((lp) => lp.id === p.id))
                .map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.fullName} ({parent.phoneNumber})
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <label htmlFor="parent-relation" className="text-sm font-medium">
              Relation (BR-010: max 1 Father, 1 Mother)
            </label>
            <Select
              id="parent-relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value as ParentRelation)}
            >
              <option value="">Select relation</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
            </Select>
          </div>
        </div>

        <Button onClick={handleLink} disabled={linking || !selectedParentId || !relation}>
          {linking ? "Linking..." : "Link Parent"}
        </Button>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Done
        </Button>
      </div>
    </div>
  );
}
