"use client";

import { Button } from "@repo/ui";
import { MemberFiltersBar } from "../../../components/members/member-filters";
import { MemberPagination } from "../../../components/members/member-pagination";
import { MemberTable } from "../../../components/members/member-table";
import { useMembers } from "../../../components/members/use-members";
import { PageShell } from "../../../components/shell/page-shell";

export default function MemberListPage() {
  const { members, pagination, loading, error, filters, setFilters, refresh } = useMembers({
    page: 1,
    limit: 20,
  });

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Members" }]}
      title="Members"
      description="Manage ministry members and their assignments."
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        <MemberFiltersBar filters={filters} onFilterChange={setFilters} />

        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        <MemberTable members={members} loading={loading} />

        {pagination && (
          <MemberPagination
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        )}
      </div>
    </PageShell>
  );
}
