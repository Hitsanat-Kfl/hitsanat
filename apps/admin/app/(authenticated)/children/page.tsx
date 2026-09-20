"use client";

import { Button } from "@repo/ui";
import { ChildFiltersBar, ChildList, ChildPagination, useChildren } from "@/features/children";
import { AlertBanner, PageShell } from "@/features/shell";

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

        {error && <AlertBanner message={error} />}

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
