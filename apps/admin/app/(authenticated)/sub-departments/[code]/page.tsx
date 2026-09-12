"use client";

import { Button, Spinner } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { PageShell } from "../../../../components/shell/page-shell";
import { RosterTable } from "../../../../components/sub-departments/roster-table";
import { useRoster } from "../../../../components/sub-departments/use-roster";

const DEPT_NAMES: Record<string, { en: string; am: string }> = {
  TIMIHRT: { en: "Timihrt", am: "ትምህርት" },
  MEZMUR: { en: "Mezmur", am: "መዝሙር" },
  KUTITR: { en: "Kutitr", am: "ቁጥጥር" },
  EKD: { en: "Ekd", am: "እቅድ" },
  KINETIBEB: { en: "Kinetibeb", am: "ኪነ-ጥበብ" },
};

export default function RosterViewPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const { members, loading, error } = useRoster(code);
  const deptInfo = DEPT_NAMES[code] || { en: code, am: code };

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Sub-Departments", href: "/sub-departments" },
        { label: deptInfo.en },
      ]}
      title={`${deptInfo.en} Roster`}
      description={`${deptInfo.am} - Ministry members and their scoped roles.`}
      actions={
        <Button variant="outline" onClick={() => router.push("/sub-departments")}>
          Back to Departments
        </Button>
      }
    >
      <div className="space-y-6">
        {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <RosterTable members={members} />
        )}
      </div>
    </PageShell>
  );
}
