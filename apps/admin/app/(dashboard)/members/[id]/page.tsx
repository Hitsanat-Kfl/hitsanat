"use client";

import { Button, Card, CardContent, CardHeader, Spinner } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MemberProfileCard } from "../../../../components/members/member-profile-card";
import { PageShell } from "../../../../components/shell/page-shell";
import { type ApiResponse, api } from "../../../../lib/api-client";
import type { Member } from "../../../../lib/types";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMember = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse<Member>>(`/members/${memberId}`);
      setMember(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch member");
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  if (loading) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Members", href: "/members" },
          { label: "Loading..." },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  if (error || !member) {
    return (
      <PageShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Members", href: "/members" },
          { label: "Error" },
        ]}
      >
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || "Member not found"}</p>
          <Button variant="outline" onClick={() => router.push("/members")}>
            Back to Members
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Members", href: "/members" },
        { label: member.fullName },
      ]}
      title={member.fullName}
      actions={
        <Button variant="outline" onClick={() => router.push("/members")}>
          Back to Members
        </Button>
      }
    >
      <div className="space-y-6">
        <MemberProfileCard member={member} />
      </div>
    </PageShell>
  );
}
