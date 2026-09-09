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

const secretaryConfig: DashboardConfig = {
  role: "secretary",
  sections: [
    {
      id: "overview",
      title: "Overview",
      titleAm: "አጠቃላይ ዕይታ",
      widgets: [
        {
          id: "kpi-registrations",
          type: "kpi",
          title: "Pending Registrations",
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
          id: "kpi-families",
          type: "kpi",
          title: "Families",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-announcements",
          type: "kpi",
          title: "Announcements",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "registrations",
      title: "Registrations & Records",
      titleAm: "ምዝገባዎች",
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
          id: "members-list",
          type: "list",
          title: "Recent Members",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "communications",
      title: "Communications",
      titleAm: "ማስተላለፍ",
      widgets: [
        {
          id: "announcements",
          type: "announcement",
          title: "Announcements",
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

const mezmurLeaderConfig: DashboardConfig = {
  role: "mezmur-leader",
  sections: [
    {
      id: "overview",
      title: "Overview",
      titleAm: "አጠቃላይ ዕይታ",
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
          id: "kpi-songs",
          type: "kpi",
          title: "Songs in Repertoire",
          size: "sm",
          priority: 2,
          visible: true,
        },
        {
          id: "kpi-practices",
          type: "kpi",
          title: "Weekly Practices",
          size: "sm",
          priority: 3,
          visible: true,
        },
        {
          id: "kpi-events",
          type: "kpi",
          title: "Upcoming Performances",
          size: "sm",
          priority: 4,
          visible: true,
        },
      ],
    },
    {
      id: "schedules",
      title: "Schedules & Assignments",
      titleAm: "መርሐግብር",
      widgets: [
        {
          id: "events",
          type: "upcoming-events",
          title: "Upcoming Events",
          size: "md",
          priority: 5,
          visible: true,
        },
        {
          id: "assignments",
          type: "assignment",
          title: "Practice Assignments",
          size: "md",
          priority: 6,
          visible: true,
        },
      ],
    },
    {
      id: "progress",
      title: "Progress",
      titleAm: "ግንባታ",
      widgets: [
        {
          id: "planning",
          type: "planning",
          title: "Repertoire Progress",
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
  "sub-chairperson": defaultConfig,
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
  secretaryConfig,
  timihrtLeaderConfig,
  mezmurLeaderConfig,
  kinetibebLeaderConfig,
  superAdminConfig,
  defaultConfig,
};
