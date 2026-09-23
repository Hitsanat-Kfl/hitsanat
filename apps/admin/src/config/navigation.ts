import type { AdminRole } from "@/config/roles";
import {
  Baby,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  HandHeart,
  Key,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Shield,
  Target,
  UserCog,
  Users,
} from "lucide-react";

// ============================================================
// Centralized navigation configuration (single source of truth)
// ============================================================
// Role unions derive from config/roles.ts. Shell widgets re-export
// these symbols for backward compatibility with existing imports.
// ============================================================

export type UserRole = AdminRole | "member-regular";
export type AdminNavRole = AdminRole | "member-regular";

/**
 * Maps session user globalRoles (UPPERCASE like "SUPER_ADMIN") to
 * nav-config UserRole (lowercase with hyphens like "super-admin").
 */
const SESSION_ROLE_MAP: Record<string, UserRole> = {
  SUPER_ADMIN: "super-admin",
  CHAIRPERSON: "chairperson",
  SUB_CHAIRPERSON: "sub-chairperson",
  SECRETARY: "secretary",
  TIMIHRT_LEADER: "timihrt-leader",
  MEZMUR_LEADER: "mezmur-leader",
  KUTITR_LEADER: "kutitr-leader",
  EKD_LEADER: "ekd-leader",
  KINETIBEB_LEADER: "kinetibeb-leader",
  MEMBER_REGULAR: "member-regular",
};

export function mapSessionRolesToNavRoles(globalRoles: string[]): UserRole[] {
  return globalRoles
    .map((role) => SESSION_ROLE_MAP[role])
    .filter((role): role is UserRole => role !== undefined);
}

export function mapSessionRolesToAdminNavRoles(globalRoles: string[]): AdminNavRole[] {
  return mapSessionRolesToNavRoles(globalRoles);
}

export interface NavItem {
  id: string;
  label: string;
  labelAm: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  disabled?: boolean;
  section?: string;
  sectionAm?: string;
  allowedRoles?: UserRole[];
  priority?: number;
}

export interface NavSection {
  id: string;
  label: string;
  labelAm: string;
  items: NavItem[];
}

export interface AdminNavItem extends NavItem {
  allowedRoles?: AdminNavRole[];
  permission?: string;
}

export interface AdminNavSection {
  id: string;
  label: string;
  labelAm: string;
  items: AdminNavItem[];
}

/** Full ministry navigation (legacy/general shell surface). */
export const navigationConfig: NavSection[] = [
  {
    id: "main",
    label: "Main",
    labelAm: "ዋና",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        labelAm: "ዳሽቦርድ",
        icon: LayoutDashboard,
        href: "/",
        section: "main",
        priority: 1,
      },
    ],
  },
  {
    id: "ministry",
    label: "Ministry",
    labelAm: "አገልግሎት",
    items: [
      {
        id: "members",
        label: "Members",
        labelAm: "አባላት",
        icon: Users,
        href: "/members",
        section: "ministry",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "super-admin"],
        priority: 2,
      },
      {
        id: "children",
        label: "Children",
        labelAm: "ህፃናት",
        icon: Baby,
        href: "/children",
        section: "ministry",
        allowedRoles: [
          "chairperson",
          "sub-chairperson",
          "secretary",
          "kinetibeb-leader",
          "super-admin",
        ],
        priority: 3,
      },
      {
        id: "sub-departments",
        label: "Sub-Departments",
        labelAm: "ንዑሳን ክፍላት",
        icon: Shield,
        href: "/sub-departments",
        section: "ministry",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "super-admin"],
        priority: 4,
      },
    ],
  },
  {
    id: "programs",
    label: "Programs",
    labelAm: "ፕሮግራሞች",
    items: [
      {
        id: "attendance",
        label: "Attendance",
        labelAm: "ክትትል",
        icon: ClipboardList,
        href: "/attendance",
        section: "programs",
        allowedRoles: [
          "chairperson",
          "sub-chairperson",
          "secretary",
          "kutitr-leader",
          "super-admin",
        ],
        priority: 5,
      },
      {
        id: "academic",
        label: "Academic",
        labelAm: "ትምህርት",
        icon: GraduationCap,
        href: "/academic",
        section: "programs",
        allowedRoles: ["chairperson", "timihrt-leader", "super-admin"],
        priority: 6,
      },
      {
        id: "events",
        label: "Events",
        labelAm: "መርሐግብሮች",
        icon: Calendar,
        href: "/events",
        section: "programs",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "super-admin"],
        priority: 7,
      },
      {
        id: "transport",
        label: "Transport",
        labelAm: "ትራንስፖርት",
        icon: Target,
        href: "/transport",
        section: "programs",
        allowedRoles: ["chairperson", "kutitr-leader", "super-admin"],
        priority: 8,
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    labelAm: "አስተዳደር",
    items: [
      {
        id: "users",
        label: "User Accounts",
        labelAm: "የተጠቃሚ መገለጫዎች",
        icon: UserCog,
        href: "/users",
        section: "administration",
        // FR-13.1: SUPER_ADMIN and CHAIRPERSON manage user accounts (BR-008).
        allowedRoles: ["super-admin", "chairperson"],
        priority: 11,
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        labelAm: "የአዲስ መዝገቦች",
        icon: FileText,
        href: "/audit-logs",
        section: "administration",
        // FR-13.2: SUPER_ADMIN and CHAIRPERSON view the audit trail.
        allowedRoles: ["super-admin", "chairperson"],
        priority: 12,
      },
      {
        id: "permissions",
        label: "Permissions",
        labelAm: "ፍቃዶች",
        icon: Key,
        href: "/permissions",
        section: "administration",
        // FR-13.3 remains a Super Admin reference page.
        allowedRoles: ["super-admin"],
        priority: 13,
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    labelAm: "ሥራ አመራር",
    items: [
      {
        id: "planning",
        label: "Planning",
        labelAm: "ዕቅድ",
        icon: BookOpen,
        href: "/planning",
        section: "operations",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "ekd-leader", "super-admin"],
        priority: 9,
      },
      {
        id: "reports",
        label: "Reports",
        labelAm: "ሪፖርቶች",
        icon: HandHeart,
        href: "/reports",
        section: "operations",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "super-admin"],
        priority: 10,
      },
    ],
  },
];

/** Admin-specific navigation (functional areas for the AppShell sidebar). */
export const adminNavigationConfig: AdminNavSection[] = [
  {
    id: "overview",
    label: "Overview",
    labelAm: "አጠቃላይ",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        labelAm: "ዳሽቦርድ",
        icon: LayoutDashboard,
        href: "/",
        section: "overview",
        priority: 1,
      },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    labelAm: "ድርጅት",
    items: [
      {
        id: "members",
        label: "Members",
        labelAm: "አባላት",
        icon: Users,
        href: "/members",
        section: "organization",
        allowedRoles: ["super-admin", "chairperson", "sub-chairperson", "secretary"],
        permission: "members:view",
        priority: 2,
      },
      {
        id: "children",
        label: "Children",
        labelAm: "ህፃናት",
        icon: Baby,
        href: "/children",
        section: "organization",
        allowedRoles: [
          "super-admin",
          "chairperson",
          "sub-chairperson",
          "secretary",
          "kinetibeb-leader",
        ],
        permission: "children:view",
        priority: 3,
      },
      {
        id: "sub-departments",
        label: "Subdepartments",
        labelAm: "ንዑሳን ክፍላት",
        icon: Shield,
        href: "/sub-departments",
        section: "organization",
        allowedRoles: ["super-admin", "chairperson", "sub-chairperson", "secretary"],
        permission: "subdepartments:view",
        priority: 4,
      },
    ],
  },
  {
    id: "user-management",
    label: "User Management",
    labelAm: "የተጠቃሚ አስተዳደር",
    items: [
      {
        id: "users",
        label: "User Accounts",
        labelAm: "የተጠቃሚ መገለጫዎች",
        icon: Users,
        href: "/users",
        section: "user-management",
        allowedRoles: ["super-admin", "chairperson"],
        permission: "users:view",
        priority: 5,
      },
    ],
  },
  {
    id: "security-access",
    label: "Security & Access",
    labelAm: "ደህንነት እና መድረስ",
    items: [
      {
        id: "permissions",
        label: "Roles & Permissions",
        labelAm: "ሚSSION እና ፍቃዶች",
        icon: Key,
        href: "/permissions",
        section: "security-access",
        allowedRoles: ["super-admin"],
        permission: "permissions:view",
        priority: 6,
      },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    labelAm: "ማጣቀሻ",
    items: [
      {
        id: "audit-logs",
        label: "Audit Log",
        labelAm: "የአዲስ መዝገቦች",
        icon: FileText,
        href: "/audit-logs",
        section: "audit",
        allowedRoles: ["super-admin", "chairperson"],
        permission: "audit:view",
        priority: 7,
      },
    ],
  },
  {
    id: "system",
    label: "System",
    labelAm: "ስርዓት",
    items: [
      {
        id: "settings",
        label: "Settings",
        labelAm: "ማስተካከያዎች",
        icon: Settings,
        href: "/settings",
        section: "system",
        allowedRoles: ["super-admin"],
        permission: "settings:view",
        priority: 8,
      },
    ],
  },
];

export function getNavigationForRoles(roles: UserRole[]): NavSection[] {
  return navigationConfig
    .map((section) => ({
      ...section,
      items: section.items
        .filter(
          (item) => !item.allowedRoles || item.allowedRoles.some((role) => roles.includes(role))
        )
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
    }))
    .filter((section) => section.items.length > 0);
}

export function getPrimaryNavItems(roles: UserRole[]): NavItem[] {
  return getNavigationForRoles(roles)
    .flatMap((section) => section.items)
    .slice(0, 3);
}

export function findActiveNavItem(pathname: string): NavItem | undefined {
  let matchedItem: NavItem | undefined;
  let longestMatchLength = 0;

  for (const section of navigationConfig) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return item;
      }
      if (item.href !== "/" && pathname.startsWith(item.href)) {
        if (item.href.length > longestMatchLength) {
          longestMatchLength = item.href.length;
          matchedItem = item;
        }
      }
    }
  }

  if (matchedItem) return matchedItem;
  if (pathname === "/") return navigationConfig[0]?.items[0];

  return undefined;
}

export function getAdminNavigationForRoles(roles: AdminNavRole[]): AdminNavSection[] {
  return adminNavigationConfig
    .map((section) => ({
      ...section,
      items: section.items
        .filter(
          (item) => !item.allowedRoles || item.allowedRoles.some((role) => roles.includes(role))
        )
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
    }))
    .filter((section) => section.items.length > 0);
}

export function getAdminPrimaryNavItems(roles: AdminNavRole[]): AdminNavItem[] {
  return getAdminNavigationForRoles(roles)
    .flatMap((section) => section.items)
    .slice(0, 3);
}

export function findAdminActiveNavItem(pathname: string): AdminNavItem | undefined {
  let matchedItem: AdminNavItem | undefined;
  let longestMatchLength = 0;

  for (const section of adminNavigationConfig) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return item;
      }
      if (item.href !== "/" && pathname.startsWith(item.href)) {
        if (item.href.length > longestMatchLength) {
          longestMatchLength = item.href.length;
          matchedItem = item;
        }
      }
    }
  }

  if (matchedItem) return matchedItem;
  if (pathname === "/") return adminNavigationConfig[0]?.items[0];

  return undefined;
}
