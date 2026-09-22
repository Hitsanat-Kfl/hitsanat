import type { AdminRole } from "@/config/roles";
import {
  Baby,
  FileText,
  Gauge,
  Key,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export type AdminNavRole = AdminRole | "member-regular";

/**
 * Maps session user globalRoles (UPPERCASE like "SUPER_ADMIN") to
 * nav-config UserRole (lowercase with hyphens like "super-admin").
 */
const SESSION_ROLE_MAP: Record<string, AdminNavRole> = {
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

export function mapSessionRolesToAdminNavRoles(globalRoles: string[]): AdminNavRole[] {
  return globalRoles
    .map((role) => SESSION_ROLE_MAP[role])
    .filter((role): role is AdminNavRole => role !== undefined);
}

export interface AdminNavItem {
  id: string;
  label: string;
  labelAm: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
  disabled?: boolean;
  section?: string;
  sectionAm?: string;
  allowedRoles?: AdminNavRole[];
  permission?: string;
  priority?: number;
}

export interface AdminNavSection {
  id: string;
  label: string;
  labelAm: string;
  items: AdminNavItem[];
}

/**
 * Admin-specific navigation configuration.
 * Organized by functional areas as per the admin shell design brief.
 */
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
