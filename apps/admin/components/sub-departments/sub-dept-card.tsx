"use client";

import { Card, CardContent, CardHeader } from "@repo/ui";
import Link from "next/link";
import type { SubDepartment } from "../../lib/types";

const CODE_COLORS: Record<string, string> = {
  TIMIHRT: "bg-blue-100 text-blue-800",
  MEZMUR: "bg-purple-100 text-purple-800",
  KUTITR: "bg-green-100 text-green-800",
  EKD: "bg-orange-100 text-orange-800",
  KINETIBEB: "bg-red-100 text-red-800",
};

interface SubDeptCardProps {
  department: SubDepartment;
}

export function SubDeptCard({ department }: SubDeptCardProps) {
  return (
    <Link href={`/sub-departments/${department.code}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CODE_COLORS[department.code] || "bg-gray-100 text-gray-800"}`}
            >
              {department.code}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold">{department.nameEn}</h3>
          <p className="text-sm text-muted-foreground mt-1">{department.nameAm}</p>
          {department.description && (
            <p className="text-sm text-muted-foreground mt-2">{department.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
