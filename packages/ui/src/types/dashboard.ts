import type * as React from "react";

// ============================================================
// Widget State
// ============================================================

export type WidgetState = "default" | "loading" | "empty" | "error" | "disabled";

// ============================================================
// KPI Widget
// ============================================================

export interface KPIData {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  comparison?: {
    value: string | number;
    label?: string;
  };
  status?: "default" | "success" | "warning" | "destructive" | "info";
}

// ============================================================
// Quick Actions Widget
// ============================================================

export interface QuickAction {
  id: string;
  label: string;
  labelAm?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost" | "link" | "icon";
  disabled?: boolean;
}

// ============================================================
// List Widget
// ============================================================

export interface ListItemData {
  id: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

// ============================================================
// Activity Widget
// ============================================================

export interface ActivityItem {
  id: string;
  actor: string;
  actorAvatar?: string;
  action: string;
  entity?: string;
  timestamp: string;
  status?: "default" | "success" | "warning" | "destructive" | "info";
}

// ============================================================
// Upcoming Events Widget
// ============================================================

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  responsiblePerson?: string;
  responsibleRole?: string;
  status?: "default" | "success" | "warning" | "destructive" | "info";
  onClick?: () => void;
}

// ============================================================
// Progress Widget
// ============================================================

export interface ProgressData {
  label: string;
  percentage: number;
  completed?: number;
  target?: number;
  status?: "default" | "success" | "warning" | "destructive";
  deadline?: string;
}

// ============================================================
// Status Summary Widget
// ============================================================

export interface StatusSummaryItem {
  status:
    | "pending"
    | "active"
    | "completed"
    | "cancelled"
    | "inactive"
    | "draft"
    | "expected"
    | "present"
    | "absent"
    | "excused"
    | "assigned"
    | "in-progress"
    | "delayed"
    | "published"
    | "archived";
  label: string;
  count: number;
  onClick?: () => void;
}

// ============================================================
// Approval Queue Widget
// ============================================================

export interface ApprovalQueueItem {
  id: string;
  title: string;
  requester: string;
  requesterAvatar?: string;
  date: string;
  status: "pending" | "active" | "completed" | "draft";
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

// ============================================================
// Assignment Widget
// ============================================================

export interface AssignmentItem {
  id: string;
  title: string;
  assignee: string;
  assigneeAvatar?: string;
  deadline?: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "delayed" | "cancelled";
  priority?: "low" | "medium" | "high";
  onClick?: () => void;
}

// ============================================================
// Attendance Widget
// ============================================================

export interface AttendanceData {
  expected: number;
  present: number;
  absent: number;
  excused: number;
  attendanceRate?: number;
  location?: string;
  period?: string;
}

// ============================================================
// Announcement Widget
// ============================================================

export interface AnnouncementItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  priority: "low" | "medium" | "high";
  author: string;
  isRead: boolean;
  onClick?: () => void;
}

// ============================================================
// Planning Widget
// ============================================================

export interface PlanningData {
  id: string;
  title: string;
  period: string;
  progress: number;
  activityCount: number;
  completedCount?: number;
  responsibleRole?: string;
  status: "draft" | "in-progress" | "completed" | "delayed" | "cancelled";
  onClick?: () => void;
}

// ============================================================
// Dashboard Configuration
// ============================================================

export type DashboardRole =
  | "chairperson"
  | "sub-chairperson"
  | "secretary"
  | "timihrt-leader"
  | "mezmur-leader"
  | "kutitr-leader"
  | "ekd-leader"
  | "kinetibeb-leader"
  | "super-admin";

export type WidgetSize = "sm" | "md" | "lg" | "xl" | "full";

export type WidgetType =
  | "kpi"
  | "quick-actions"
  | "list"
  | "activity"
  | "upcoming-events"
  | "progress"
  | "status-summary"
  | "approval-queue"
  | "assignment"
  | "attendance"
  | "announcement"
  | "planning"
  | "chart"
  | "custom";

export interface DashboardWidgetConfig {
  id: string;
  type: WidgetType;
  title?: string;
  titleAm?: string;
  size: WidgetSize;
  priority: number;
  visible: boolean;
  props?: Record<string, unknown>;
}

export interface DashboardSectionConfig {
  id: string;
  title: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  widgets: DashboardWidgetConfig[];
}

export interface DashboardConfig {
  role: DashboardRole;
  sections: DashboardSectionConfig[];
}

// ============================================================
// Dashboard Grid
// ============================================================

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;
