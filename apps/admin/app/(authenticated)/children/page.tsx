"use client";

import { Button } from "@repo/ui";
import { ChildFiltersBar } from "../../../components/children/child-filters";
import { ChildList } from "../../../components/children/child-list";
import { ChildPagination } from "../../../components/children/child-pagination";
import { useChildren } from "../../../components/children/use-children";
import { PageShell } from "../../../components/shell/page-shell";

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
