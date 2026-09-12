"use client";

import { Button, Spinner } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChildProfileCard } from "../../../../components/children/child-profile-card";
import { PageShell } from "../../../../components/shell/page-shell";
import { type ApiResponse, api } from "../../../../lib/api-client";
import type { Child, ParentWithRelation } from "../../../../lib/types";

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [parents, setParents] = useState<ParentWithRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChild = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [childRes, parentsRes] = await Promise.all([
        api.get<ApiResponse<Child>>(`/children/${childId}`),
        api.get<ApiResponse<ParentWithRelation[]>>(`/children/${childId}/parents`),
      ]);
      setChild(childRes.data);
      setParents(parentsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch child");
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchChild();
  }, [fetchChild]);

  if (loading) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Children", href: "/children" },
          { label: "Loading..." },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  if (error || !child) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Children", href: "/children" },
          { label: "Error" },
        ]}
      >
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || "Child not found"}</p>
          <Button variant="outline" onClick={() => router.push("/children")}>
            Back to Children
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Children", href: "/children" },
        { label: child.fullName },
      ]}
      title={child.fullName}
      actions={
        <Button variant="outline" onClick={() => router.push("/children")}>
          Back to Children
        </Button>
      }
    >
      <div className="space-y-6">
        <ChildProfileCard child={child} parents={parents} />
      </div>
    </PageShell>
  );
}
