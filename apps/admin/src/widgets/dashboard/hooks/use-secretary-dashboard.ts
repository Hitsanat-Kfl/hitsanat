"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ActivityItem,
  EventItem,
  KPIData,
  ListItemData,
  QuickAction,
  StatusSummaryItem,
} from "@repo/ui";
import { type ApiResponse, type PaginatedResponse, api } from "@/infrastructure/api/client";
import { queryErrorMessage } from "@/infrastructure/query/query-errors";
import type { Child, Family, Member, PublicEvent } from "@/domains/definitions";
import { useAuditLogs } from "./use-audit-logs";

export interface IncompleteRecordItem {
  id: string;
  kind: "Member" | "Child" | "Family";
  title: string;
  issue: string;
  date: string;
  href: string;
}

export interface UseSecretaryDashboardResult {
  kpis: KPIData[];
  pendingRecords: ListItemData[];
  memberRecordsSummary: StatusSummaryItem[];
  childrenRecordsSummary: StatusSummaryItem[];
  upcomingEvents: EventItem[];
  activity: ActivityItem[];
  activityRestricted: boolean;
  quickActions: QuickAction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "qa-register-child",
    label: "Register Child",
    onClick: () => window.location.assign("/children"),
    variant: "primary",
  },
  {
    id: "qa-register-member",
    label: "Register Member",
    onClick: () => window.location.assign("/members"),
    variant: "outline",
  },
  {
    id: "qa-view-children",
    label: "View Children",
    onClick: () => window.location.assign("/children"),
    variant: "outline",
  },
  {
    id: "qa-view-members",
    label: "View Members",
    onClick: () => window.location.assign("/members"),
    variant: "outline",
  },
  {
    id: "qa-attendance",
    label: "Attendance",
    onClick: () => window.location.assign("/attendance"),
    variant: "outline",
  },
  {
    id: "qa-events",
    label: "Events",
    onClick: () => window.location.assign("/events"),
    variant: "outline",
  },
];

interface SecretaryDashboardData {
  kpis: KPIData[];
  pendingRecords: ListItemData[];
  memberRecordsSummary: StatusSummaryItem[];
  childrenRecordsSummary: StatusSummaryItem[];
  upcomingEvents: EventItem[];
}

async function fetchSecretaryDashboard(): Promise<SecretaryDashboardData> {
  const [childrenRes, membersRes, familiesRes, eventsRes] = await Promise.allSettled([
    api.get<ApiResponse<Child[]>>("/children?limit=100"),
    api.get<PaginatedResponse<Member>>("/members?limit=100"),
    api.get<ApiResponse<Family[]>>("/families"),
    api.get<PaginatedResponse<PublicEvent>>("/events?upcoming=true&limit=5"),
  ]);

  // Core validation: children and members are required administrative foundations
  if (childrenRes.status === "rejected" && membersRes.status === "rejected") {
    throw childrenRes.reason;
  }

  const children: Child[] =
    childrenRes.status === "fulfilled" ? (childrenRes.value.data ?? []) : [];
  const members: Member[] = membersRes.status === "fulfilled" ? (membersRes.value.data ?? []) : [];
  const families: Family[] =
    familiesRes.status === "fulfilled" ? (familiesRes.value.data ?? []) : [];
  const events: PublicEvent[] =
    eventsRes.status === "fulfilled" ? (eventsRes.value.data ?? []) : [];

  // ---- 1. Pending & Incomplete Administrative Records ----
  const pendingItems: ListItemData[] = [];

  // Stage 1 members missing stage 2 details (e.g. photo or telegram)
  const stage1IncompleteMembers = members.filter(
    (m) => m.isActive && (!m.photoUrl || !m.telegramUsername)
  );
  for (const m of stage1IncompleteMembers) {
    pendingItems.push({
      id: `member-${m.id}`,
      primary: `${m.fullName} (${m.christianName})`,
      secondary: `Stage 1 Registered · Incomplete Stage 2 Profile · ${m.academicDepartment}`,
      trailing: formatDate(m.createdAt),
      onClick: () => window.location.assign(`/members/${m.id}`),
    });
  }

  // Inactive members requiring administrative review
  const inactiveMembers = members.filter((m) => !m.isActive);
  for (const m of inactiveMembers) {
    pendingItems.push({
      id: `inactive-member-${m.id}`,
      primary: `${m.fullName} (${m.christianName})`,
      secondary: "Inactive Member Record · Requires Status Review",
      trailing: formatDate(m.updatedAt || m.createdAt),
      onClick: () => window.location.assign(`/members/${m.id}`),
    });
  }

  // Families missing parents linkage
  const incompleteFamilies = families.filter((f) => !f.fatherMemberId || !f.motherMemberId);
  for (const f of incompleteFamilies) {
    const missingDetail =
      !f.fatherMemberId && !f.motherMemberId
        ? "Missing Father & Mother Linkage"
        : !f.fatherMemberId
          ? "Missing Father Linkage"
          : "Missing Mother Linkage";
    pendingItems.push({
      id: `family-${f.id}`,
      primary: `${f.familyName} Family`,
      secondary: `${missingDetail} · Academic Year ${f.academicYear}`,
      trailing: formatDate(f.createdAt),
      onClick: () => window.location.assign("/members"),
    });
  }

  // Children missing transport collection location or group
  const incompleteChildren = children.filter((c) => !c.collectionLocation || !c.kutrGroup);
  for (const c of incompleteChildren) {
    pendingItems.push({
      id: `child-${c.id}`,
      primary: `${c.fullName} (${c.christianName})`,
      secondary: `Incomplete Record · Missing ${!c.collectionLocation ? "Transport Location" : "Kutr Group"}`,
      trailing: formatDate(c.createdAt),
      onClick: () => window.location.assign(`/children/${c.id}`),
    });
  }

  // ---- 2. Records & Registration KPIs (All Real Counts) ----
  const activeMembersCount = members.filter((m) => m.isActive).length;
  const totalChildrenCount = children.length;
  const totalFamiliesCount = families.length;
  const totalPendingCount = pendingItems.length;

  const kpis: KPIData[] = [
    {
      label: "Total Children",
      value: totalChildrenCount,
      description: "Enrolled in ministry",
    },
    {
      label: "Active Members",
      value: activeMembersCount,
      description: `${inactiveMembers.length} inactive on file`,
    },
    {
      label: "Registered Families",
      value: totalFamiliesCount,
      description: `${incompleteFamilies.length} incomplete linkages`,
    },
    {
      label: "Pending Records",
      value: totalPendingCount,
      description: "Require administrative action",
      status: totalPendingCount > 0 ? "warning" : "default",
    },
  ];

  // ---- 3. Children, Members & Families Breakdown Summaries ----
  const completeMembersCount = members.filter(
    (m) => m.isActive && m.photoUrl && m.telegramUsername
  ).length;
  const memberRecordsSummary: StatusSummaryItem[] = [
    { status: "completed", label: "Complete active profiles", count: completeMembersCount },
    {
      status: "in-progress",
      label: "Stage 1 pending Stage 2",
      count: stage1IncompleteMembers.length,
    },
    { status: "draft", label: "Inactive members", count: inactiveMembers.length },
  ];

  const kutr1Count = children.filter((c) => c.kutrGroup === "Kutr 1").length;
  const kutr2Count = children.filter((c) => c.kutrGroup === "Kutr 2").length;
  const completeChildrenCount = children.filter((c) => c.collectionLocation && c.kutrGroup).length;
  const childrenRecordsSummary: StatusSummaryItem[] = [
    { status: "completed", label: "Complete child records", count: completeChildrenCount },
    { status: "assigned", label: "Kutr 1 Group", count: kutr1Count },
    { status: "in-progress", label: "Kutr 2 Group", count: kutr2Count },
  ];

  // ---- 4. Upcoming Administrative Activities (Real Events) ----
  const upcomingEvents: EventItem[] = events.map((evt) => ({
    id: evt.id,
    title: evt.title,
    date: evt.eventDate,
    time: new Date(evt.eventDate).toLocaleTimeString("en-ET", {
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

  return {
    kpis,
    pendingRecords: pendingItems,
    memberRecordsSummary,
    childrenRecordsSummary,
    upcomingEvents,
  };
}

/**
 * Secretary Dashboard Data Hook — Phase 06 spec.
 *
 * Operational administrative workspace:
 * - Total children & group breakdowns (GET /children)
 * - Total & active members, Stage 1 / Stage 2 incomplete profiles (GET /members)
 * - Registered families & missing parent linkages (GET /families)
 * - Pending records requiring administrative attention
 * - Recent administrative activity (GET /audit-logs)
 * - Upcoming ministry & administrative events (GET /events?upcoming=true)
 * - Verified role-specific quick actions
 */
export function useSecretaryDashboard(): UseSecretaryDashboardResult {
  const query = useQuery({
    queryKey: ["dashboard", "secretary"],
    queryFn: fetchSecretaryDashboard,
  });

  const { activity: auditActivity, loading: auditLoading, error: auditError } = useAuditLogs(6);

  return {
    kpis: query.data?.kpis ?? [],
    pendingRecords: query.data?.pendingRecords ?? [],
    memberRecordsSummary: query.data?.memberRecordsSummary ?? [],
    childrenRecordsSummary: query.data?.childrenRecordsSummary ?? [],
    upcomingEvents: query.data?.upcomingEvents ?? [],
    activity: auditActivity,
    activityRestricted: !auditLoading && auditError !== null,
    quickActions: QUICK_ACTIONS,
    loading: query.isPending || query.isFetching,
    error: query.isError
      ? queryErrorMessage(query.error, "Failed to load administrative record data")
      : null,
    refresh: () => {
      void query.refetch();
    },
  };
}
