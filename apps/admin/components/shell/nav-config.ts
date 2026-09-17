import {
  Baby,
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  HandHeart,
  LayoutDashboard,
  type LucideIcon,
  Music,
  Settings,
  Shield,
  Target,
  Users,
} from "lucide-react";

export type UserRole =
  | "chairperson"
  | "sub-chairperson"
  | "secretary"
  | "timihrt-leader"
  | "mezmur-leader"
  | "kutitr-leader"
  | "ekd-leader"
  | "kinetibeb-leader"
  | "super-admin";

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
  for (const section of navigationConfig) {
    for (const item of section.items) {
      if (item.href === pathname) return item;
      if (item.href !== "/" && pathname.startsWith(item.href)) return item;
    }
  }
  return undefined;
}
