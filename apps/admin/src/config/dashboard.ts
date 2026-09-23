import type { DashboardConfig, DashboardRole } from "@repo/ui";

// ============================================================
// Role-Aware Dashboard Configuration
// ============================================================
// Each role gets a different section/widget arrangement.
// Widgets reference types from @repo/ui but the configuration
// itself lives in the admin app (consuming layer).
// ============================================================

const chairpersonConfig: DashboardConfig = {
  role: "chairperson",
  sections: [
    {
      id: "overview",
      title: "Overview",
      titleAm: "አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "kpi-members",
          type: "kpi",
          title: "Total Members",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-children",
          type: "kpi",
          title: "Active Children",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-attendance",
          type: "kpi",
          title: "Attendance Rate",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-groups",
          type: "kpi",
          title: "Active Groups",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      titleAm: "አስقوى",
      widgets: [
        {
          id: "approvals",
          type: "approval-queue",
          title: "Pending Approvals",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "events",
          type: "upcoming-events",
          title: "Upcoming Events",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "insights",
      title: "Insights",
      titleAm: "እይታ",
      widgets: [
        {
          id: "status-summary",
          type: "status-summary",
          title: "Status Overview",
          size: "md",
          priority: 7,
          visible: true,
        },
        {
          id: "activity",
          type: "activity",
          title: "Recent Activity",
          size: "md",
          priority: 8,
          visible: true,
        },
      ],
    },
    {
      id: "actions",
      title: "Quick Actions",
      titleAm: "ፈጣን ድርጊቶች",
      widgets: [
        { id: "quick-actions", type: "quick-actions", size: "full", priority: 9, visible: true },
      ],
    },
  ],
};

/**
 * Secretary dashboard — Phase 06: operational administrative workspace.
 * Information hierarchy: Registration Overview → Pending Records / Attention →
 * Children, Members & Families Overview → Recent Activity → Upcoming Activities → Quick Actions.
 */
const secretaryConfig: DashboardConfig = {
  role: "secretary",
  sections: [
    {
      id: "registration-overview",
      title: "Registration Overview",
      titleAm: "አጠቃላይ የምዝገባ ዕይታ",
      widgets: [
        {
          id: "kpi-children",
          type: "kpi",
          title: "Total Children",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-members",
          type: "kpi",
          title: "Active Members",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-families",
          type: "kpi",
          title: "Registered Families",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-pending-records",
          type: "kpi",
          title: "Pending Records",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "attention",
      title: "Requires Attention",
      titleAm: "የሚጠይቅ ትኩረት",
      widgets: [
        {
          id: "pending-records",
          type: "list",
          title: "Pending & Incomplete Records",
          size: "full",
          priority: 5,
          visible: true,
        },
      ],
    },
    {
      id: "records-overview",
      title: "Records Overview",
      titleAm: "የመዝገቦች አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "member-records-summary",
          type: "status-summary",
          title: "Member Records",
          size: "md",
          priority: 6,
          visible: true,
        },
        {
          id: "children-records-summary",
          type: "status-summary",
          title: "Children Records",
          size: "md",
          priority: 7,
          visible: true,
        },
      ],
    },
    {
      id: "recent-activity",
      title: "Recent Activity",
      titleAm: "የቅርብ ጊዜ ተግባር",
      widgets: [
        {
          id: "activity",
          type: "activity",
          title: "Recent Administrative Activity",
          size: "md",
          priority: 8,
          visible: true,
        },
      ],
    },
    {
      id: "upcoming",
      title: "Upcoming Activities",
      titleAm: "የሚመጡ ዝግጅቶች",
      widgets: [
        {
          id: "upcoming-events",
          type: "upcoming-events",
          title: "Upcoming Activities",
          size: "md",
          priority: 9,
          visible: true,
        },
      ],
    },
    {
      id: "actions",
      title: "Quick Actions",
      titleAm: "ፈጣን ድርጊቶች",
      widgets: [
        { id: "quick-actions", type: "quick-actions", size: "full", priority: 10, visible: true },
      ],
    },
  ],
};

const timihrtLeaderConfig: DashboardConfig = {
  role: "timihrt-leader",
  sections: [
    {
      id: "overview",
      title: "Overview",
      titleAm: "አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "kpi-teachers",
          type: "kpi",
          title: "Active Teachers",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-classes",
          type: "kpi",
          title: "Active Classes",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-attendance",
          type: "kpi",
          title: "Avg Attendance",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-materials",
          type: "kpi",
          title: "Study Materials",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "programs",
      title: "Biblical Studies",
      titleAm: "መጽሐፍ ቅዱስ ጥናት",
      widgets: [
        {
          id: "assignments",
          type: "assignment",
          title: "Teacher Assignments",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "events",
          type: "upcoming-events",
          title: "Upcoming Sessions",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "progress",
      title: "Progress Tracking",
      titleAm: "የግንባታ ተከታታይ",
      widgets: [
        {
          id: "planning",
          type: "planning",
          title: "Curriculum Progress",
          size: "md",
          priority: 7,
          visible: true,
        },
        {
          id: "attendance",
          type: "attendance",
          title: "Class Attendance",
          size: "md",
          priority: 8,
          visible: true,
        },
      ],
    },
  ],
};

/**
 * Mezmur Leader Dashboard — Phase 08: operational ministry workspace.
 * Information hierarchy: Mezmur Overview → Attention / Preparation Required →
 * Song & Assignment Overview → Mezmur Responsibilities → Upcoming Programs / Awdemerit →
 * Recent Activity → Quick Actions.
 */
const mezmurLeaderConfig: DashboardConfig = {
  role: "mezmur-leader",
  sections: [
    {
      id: "overview",
      title: "Mezmur Overview",
      titleAm: "የመዝሙር አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "kpi-members",
          type: "kpi",
          title: "Choir Members",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-assignments",
          type: "kpi",
          title: "Active Assignments",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-programs",
          type: "kpi",
          title: "Upcoming Programs",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-pending",
          type: "kpi",
          title: "Pending Preparation",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "attention",
      title: "Requires Attention",
      titleAm: "የሚጠይቅ ትኩረት",
      widgets: [
        {
          id: "preparation-queue",
          type: "list",
          title: "Preparation Required",
          size: "full",
          priority: 5,
          visible: true,
        },
      ],
    },
    {
      id: "assignments-overview",
      title: "Assignments & Progress",
      titleAm: "ምደባዎች እና እድገት",
      widgets: [
        {
          id: "distribution-summary",
          type: "status-summary",
          title: "Plan Activities",
          size: "md",
          priority: 6,
          visible: true,
        },
        {
          id: "session-summary",
          type: "status-summary",
          title: "Practice & Sessions",
          size: "md",
          priority: 7,
          visible: true,
        },
      ],
    },
    {
      id: "responsibilities",
      title: "Mezmur Responsibilities",
      titleAm: "የመዝሙር ኃላፊነቶች",
      widgets: [
        {
          id: "mezmur-assignments",
          type: "list",
          title: "Distributed Responsibilities",
          size: "full",
          priority: 8,
          visible: true,
        },
      ],
    },
    {
      id: "upcoming",
      title: "Upcoming Programs",
      titleAm: "የሚመጡ መርሐግብራት",
      widgets: [
        {
          id: "upcoming-events",
          type: "upcoming-events",
          title: "Upcoming Programs & Awdemerit",
          size: "md",
          priority: 9,
          visible: true,
        },
      ],
    },
    {
      id: "recent-activity",
      title: "Recent Activity",
      titleAm: "የቅርብ ጊዜ ተግባር",
      widgets: [
        {
          id: "activity",
          type: "activity",
          title: "Recent Activity",
          size: "md",
          priority: 10,
          visible: true,
        },
      ],
    },
    {
      id: "actions",
      title: "Quick Actions",
      titleAm: "ፈጣን ድርጊቶች",
      widgets: [
        { id: "quick-actions", type: "quick-actions", size: "full", priority: 11, visible: true },
      ],
    },
  ],
};

const kinetibebLeaderConfig: DashboardConfig = {
  role: "kinetibeb-leader",
  sections: [
    {
      id: "overview",
      title: "Overview",
      titleAm: "አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "kpi-children",
          type: "kpi",
          title: "Total Children",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-groups",
          type: "kpi",
          title: "Active Groups",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-attendance",
          type: "kpi",
          title: "Attendance Rate",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-teachers",
          type: "kpi",
          title: "Active Teachers",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      titleAm: "አስقوى",
      widgets: [
        {
          id: "attendance",
          type: "attendance",
          title: "Today's Attendance",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "events",
          type: "upcoming-events",
          title: "Upcoming Events",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "tracking",
      title: "Tracking",
      titleAm: "ተከታታይ",
      widgets: [
        {
          id: "status-summary",
          type: "status-summary",
          title: "Children Status",
          size: "md",
          priority: 7,
          visible: true,
        },
        {
          id: "announcements",
          type: "announcement",
          title: "Announcements",
          size: "md",
          priority: 8,
          visible: true,
        },
      ],
    },
  ],
};

/**
 * Sub-Chairperson dashboard — mirrors the implemented sections in
 * sub-chairperson-dashboard.tsx (Phase 06): coordination overview,
 * attention, activity/plan progress, responsibilities, upcoming,
 * recent activity, quick actions.
 */
const subChairpersonConfig: DashboardConfig = {
  role: "sub-chairperson",
  sections: [
    {
      id: "coordination-overview",
      title: "Coordination Overview",
      titleAm: "የመሪ ሁኔታ",
      widgets: [
        {
          id: "kpi-subdepartments",
          type: "kpi",
          title: "Sub-Departments",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-reports-in-review",
          type: "kpi",
          title: "Reports In Review",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-activities-in-progress",
          type: "kpi",
          title: "Activities In Progress",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-upcoming-activities",
          type: "kpi",
          title: "Upcoming Activities",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "attention",
      title: "Requires Attention",
      titleAm: "የሚጠይቅ ትኩረት",
      widgets: [
        {
          id: "review-queue",
          type: "list",
          title: "Awaiting Executive Review",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "report-pipeline",
          type: "status-summary",
          title: "Report Pipeline",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "progress",
      title: "Activity & Plan Progress",
      titleAm: "የዕቅድ እድገት",
      widgets: [
        {
          id: "distribution-progress",
          type: "status-summary",
          title: "Distributed Activities",
          size: "md",
          priority: 7,
          visible: true,
        },
        {
          id: "department-board",
          type: "list",
          title: "Department Status Board",
          size: "md",
          priority: 8,
          visible: true,
        },
      ],
    },
    {
      id: "responsibilities",
      title: "Responsibilities",
      titleAm: "ኃላፊነቶች",
      widgets: [
        {
          id: "assignments",
          type: "list",
          title: "Distributed Plan Activities",
          size: "full",
          priority: 9,
          visible: true,
        },
      ],
    },
    {
      id: "upcoming",
      title: "Upcoming Activities",
      titleAm: "የሚመጡ ዝግጅቶች",
      widgets: [
        {
          id: "upcoming-events",
          type: "upcoming-events",
          title: "Upcoming Activities",
          size: "md",
          priority: 10,
          visible: true,
        },
      ],
    },
    {
      id: "recent-activity",
      title: "Recent Activity",
      titleAm: "የቅርብ ጊዜ ተግባር",
      widgets: [
        {
          id: "activity",
          type: "activity",
          title: "Recent Activity",
          size: "md",
          priority: 11,
          visible: true,
        },
      ],
    },
    {
      id: "actions",
      title: "Quick Actions",
      titleAm: "ፈጣን ድርጊቶች",
      widgets: [
        { id: "quick-actions", type: "quick-actions", size: "full", priority: 12, visible: true },
      ],
    },
  ],
};

const superAdminConfig: DashboardConfig = {
  role: "super-admin",
  sections: [
    {
      id: "system-overview",
      title: "System Overview",
      titleAm: "የስርዓት አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "kpi-users",
          type: "kpi",
          title: "Active Users",
          size: "sm",
          priority: 1,
          visible: true,
        },
        {
          id: "kpi-members",
          type: "kpi",
          title: "Total Members",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-children",
          type: "kpi",
          title: "Total Children",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-system",
          type: "kpi",
          title: "System Health",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "management",
      title: "Management",
      titleAm: "ዳኝነት",
      widgets: [
        {
          id: "approvals",
          type: "approval-queue",
          title: "Pending Approvals",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "status-summary",
          type: "status-summary",
          title: "System Status",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "activity",
      title: "Activity",
      titleAm: "ተግባር",
      widgets: [
        {
          id: "activity",
          type: "activity",
          title: "System Activity",
          size: "md",
          priority: 7,
          visible: true,
        },
        {
          id: "announcements",
          type: "announcement",
          title: "Announcements",
          size: "md",
          priority: 8,
          visible: true,
        },
      ],
    },
  ],
};

// ============================================================
// Default config for roles without specific layouts
// ============================================================

const defaultConfig: DashboardConfig = {
  role: "sub-chairperson",
  sections: [
    {
      id: "overview",
      title: "Overview",
      titleAm: "አጠቃላይ ዕይታ",
      widgets: [
        { id: "kpi-1", type: "kpi", title: "Key Metric", size: "sm", priority: 1, visible: true },
        { id: "kpi-2", type: "kpi", title: "Key Metric", size: "sm", priority: 2, visible: true },
        { id: "kpi-3", type: "kpi", title: "Key Metric", size: "sm", priority: 3, visible: true },
        { id: "kpi-4", type: "kpi", title: "Key Metric", size: "sm", priority: 4, visible: true },
      ],
    },
    {
      id: "activity",
      title: "Activity",
      titleAm: "ተግባር",
      widgets: [
        {
          id: "activity",
          type: "activity",
          title: "Recent Activity",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "events",
          type: "upcoming-events",
          title: "Upcoming Events",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
  ],
};

// ============================================================
// Export lookup
// ============================================================

const configMap: Record<DashboardRole, DashboardConfig> = {
  chairperson: chairpersonConfig,
  "sub-chairperson": subChairpersonConfig,
  secretary: secretaryConfig,
  "timihrt-leader": timihrtLeaderConfig,
  "mezmur-leader": mezmurLeaderConfig,
  "kutitr-leader": defaultConfig,
  "ekd-leader": defaultConfig,
  "kinetibeb-leader": kinetibebLeaderConfig,
  "super-admin": superAdminConfig,
};

export function getDashboardConfig(role: DashboardRole): DashboardConfig {
  return configMap[role] ?? defaultConfig;
}

export function getSectionsForRole(role: DashboardRole) {
  return getDashboardConfig(role).sections;
}

export {
  chairpersonConfig,
  subChairpersonConfig,
  secretaryConfig,
  timihrtLeaderConfig,
  mezmurLeaderConfig,
  kinetibebLeaderConfig,
  superAdminConfig,
  defaultConfig,
};
