import type {
  ActivityItem,
  ApprovalQueueItem,
  EventItem,
  KPIData,
  ProgressData,
  QuickAction,
  StatusSummaryItem,
} from "@repo/ui";

// ============================================================
// Chairperson Dashboard Fixtures
// ============================================================
// Isolated mock data for UI development.
// Replace with real API calls when backend is ready.
// ============================================================

export function getChairpersonKPIs(): KPIData[] {
  return [
    {
      label: "Active Members",
      value: "124",
      description: "Registered ministry members",
      trend: { value: 8, direction: "up", label: "from last month" },
    },
    {
      label: "Enrolled Children",
      value: "87",
      description: "Currently enrolled children",
      trend: { value: 12, direction: "up", label: "from last quarter" },
    },
    {
      label: "Attendance Rate",
      value: "78%",
      description: "Average across all programs",
      trend: { value: 3, direction: "up", label: "from last month" },
    },
    {
      label: "Pending Approvals",
      value: "5",
      description: "Items awaiting review",
      status: "warning",
    },
  ];
}

export function getChairpersonApprovals(): ApprovalQueueItem[] {
  return [
    {
      id: "apr-1",
      title: "New Member Registration - Daniel Kebede",
      requester: "Secretary Office",
      date: "Sep 8, 2026",
      status: "pending",
      onApprove: () => {},
      onReject: () => {},
      onView: () => {},
    },
    {
      id: "apr-2",
      title: "Annual Plan 2016 E.C. - Final Review",
      requester: "Planning Committee",
      date: "Sep 7, 2026",
      status: "pending",
      onApprove: () => {},
      onView: () => {},
    },
    {
      id: "apr-3",
      title: "Budget Request - Mezmur Equipment",
      requester: "Mezmur Leader",
      date: "Sep 6, 2026",
      status: "active",
      onView: () => {},
    },
    {
      id: "apr-4",
      title: "Event Proposal - Annual Celebration",
      requester: "Events Committee",
      date: "Sep 5, 2026",
      status: "pending",
      onApprove: () => {},
      onReject: () => {},
      onView: () => {},
    },
  ];
}

export function getChairpersonProgress(): ProgressData[] {
  return [
    {
      label: "Annual Plan Completion",
      percentage: 42,
      completed: 11,
      target: 26,
      status: "default",
      deadline: "Dec 2026",
    },
    {
      label: "Teacher Training Program",
      percentage: 65,
      completed: 13,
      target: 20,
      status: "success",
    },
  ];
}

export function getChairpersonStatusSummary(): StatusSummaryItem[] {
  return [
    { status: "completed", label: "Completed Activities", count: 11 },
    { status: "in-progress", label: "In Progress", count: 8 },
    { status: "pending", label: "Pending Start", count: 5 },
    { status: "delayed", label: "Delayed", count: 2 },
  ];
}

export function getChairpersonEvents(): EventItem[] {
  return [
    {
      id: "evt-1",
      title: "Annual Ministry Celebration",
      date: "2026-09-20",
      time: "9:00 AM",
      location: "Main Hall",
      responsibleRole: "Events Committee",
      status: "info",
    },
    {
      id: "evt-2",
      title: "Teacher Training Workshop",
      date: "2026-09-15",
      time: "2:00 PM",
      location: "Timihrt Classroom",
      responsibleRole: "Timihrt Leader",
      status: "success",
    },
    {
      id: "evt-3",
      title: "Quarterly Planning Review",
      date: "2026-09-25",
      time: "10:00 AM",
      location: "Conference Room",
      responsibleRole: "Secretary",
    },
    {
      id: "evt-4",
      title: "Mezmur Practice Session",
      date: "2026-09-12",
      time: "5:00 PM",
      location: "Mezmur Room",
      responsibleRole: "Mezmur Leader",
    },
  ];
}

export function getChairpersonActivity(): ActivityItem[] {
  return [
    {
      id: "act-1",
      actor: "Secretary Office",
      action: "registered a new member",
      entity: "Daniel Kebede",
      timestamp: "2 hours ago",
      status: "info",
    },
    {
      id: "act-2",
      actor: "Timihrt Leader",
      action: "completed training module",
      entity: "Biblical Studies Level 3",
      timestamp: "5 hours ago",
      status: "success",
    },
    {
      id: "act-3",
      actor: "Mezmur Leader",
      action: "updated schedule for",
      entity: "Sunday Practice",
      timestamp: "1 day ago",
    },
    {
      id: "act-4",
      actor: "Kutitr Coordinator",
      action: "submitted transport plan for",
      entity: "Saturday Service",
      timestamp: "1 day ago",
      status: "info",
    },
    {
      id: "act-5",
      actor: "Planning Committee",
      action: "distributed activities to",
      entity: "3 Sub-Departments",
      timestamp: "2 days ago",
      status: "success",
    },
  ];
}

export function getChairpersonQuickActions(): QuickAction[] {
  return [
    {
      id: "qa-review",
      label: "Review Approvals",
      onClick: () => {},
      variant: "primary",
    },
    {
      id: "qa-plan",
      label: "View Master Plan",
      onClick: () => {},
      variant: "outline",
    },
    {
      id: "qa-reports",
      label: "View Reports",
      onClick: () => {},
      variant: "outline",
    },
    {
      id: "qa-events",
      label: "Manage Events",
      onClick: () => {},
      variant: "outline",
    },
  ];
}
