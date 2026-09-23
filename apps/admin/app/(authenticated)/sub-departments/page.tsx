"use client";

import { Spinner } from "@repo/ui";
import { PageShell } from "@/widgets/shell";
import { SubDeptCard } from "@/features/department-management";
import { useSubDepartments } from "@/features/department-management";

export default function SubDepartmentListPage() {
  const { departments, loading, error } = useSubDepartments();

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sub-Departments" }]}
      title="Sub-Departments"
      description="View and manage ministry sub-departments and their rosters."
    >
      <div className="space-y-6">
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <SubDeptCard key={dept.id} department={dept} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
