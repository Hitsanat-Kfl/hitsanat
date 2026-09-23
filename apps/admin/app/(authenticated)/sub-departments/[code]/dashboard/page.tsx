"use client";

import { Button, Spinner } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { SubDeptAttendanceSummary } from "@/features/department-management";
import { SubDeptKpiCards } from "@/features/department-management";
import { SubDeptProgressTracker } from "@/features/department-management";
import { useSubDeptDashboard } from "@/features/department-management";
import { PageShell } from "@/widgets/shell";

const DEPT_NAMES: Record<string, { en: string; am: string }> = {
  TIMIHRT: { en: "Timihrt", am: "ትምህርት" },
  MEZMUR: { en: "Mezmur", am: "መዝሙር" },
  KUTITR: { en: "Kutitr", am: "ቁጥጥር" },
  EKD: { en: "Ekd", am: "እቅድ" },
  KINETIBEB: { en: "Kinetibeb", am: "ኪነ-ጥበብ" },
};

export default function SubDeptDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const { dashboard, loading, error } = useSubDeptDashboard(code);
  const deptInfo = DEPT_NAMES[code] || { en: code, am: code };

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Sub-Departments", href: "/sub-departments" },
        { label: `${deptInfo.en} Dashboard` },
      ]}
      title={`${deptInfo.en} Dashboard`}
      description={`${deptInfo.am} - Department-specific overview and metrics.`}
      actions={
        <Button variant="outline" onClick={() => router.push(`/sub-departments/${code}`)}>
          Back to Roster
        </Button>
      }
    >
      <div className="space-y-6">
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : dashboard ? (
          <>
            <SubDeptKpiCards
              memberCount={dashboard.memberCount}
              childCount={dashboard.childCount}
              attendanceRate={dashboard.attendanceRate}
            />
            <SubDeptAttendanceSummary attendanceRate={dashboard.attendanceRate} />
            <SubDeptProgressTracker items={dashboard.progressItems} />
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
