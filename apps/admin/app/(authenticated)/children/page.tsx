"use client";

import { Button } from "@repo/ui";
import { ChildFiltersBar } from "@/features/children";
import { ChildList } from "@/features/children";
import { ChildPagination } from "@/features/children";
import { useChildren } from "@/features/children";
import { PageShell } from "@/features/shell";

export default function ChildListPage() {
  const { children, pagination, loading, error, filters, setFilters, refresh } = useChildren({
    page: 1,
    limit: 20,
  });

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Children" }]}
      title="Children"
      description="Manage ministry children and their classifications."
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      <div className="space-y-6">
        <ChildFiltersBar filters={filters} onFilterChange={setFilters} />

        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        <ChildList items={children} loading={loading} />

        {pagination && (
          <ChildPagination
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        )}
      </div>
    </PageShell>
  );
}
