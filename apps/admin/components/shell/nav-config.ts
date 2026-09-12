import {
  Baby,
  BookOpen,
  Calendar,
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
        id: "children",
        label: "Children",
        labelAm: "ህፃናት",
        icon: Baby,
        href: "/children",
        section: "ministry",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "kinetibeb-leader"],
        priority: 2,
      },
      {
        id: "groups",
        label: "Groups",
        labelAm: "ቡድኖች",
        icon: Users,
        href: "/groups",
        section: "ministry",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary"],
        priority: 3,
      },
      {
        id: "teachers",
        label: "Teachers",
        labelAm: "አስተማሪዎች",
        icon: GraduationCap,
        href: "/teachers",
        section: "ministry",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "timihrt-leader"],
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
        id: "schedule",
        label: "Schedule",
        labelAm: "መርሐግብር",
        icon: Calendar,
        href: "/schedule",
        section: "programs",
        priority: 5,
      },
      {
        id: "mezmur",
        label: "Mezmur",
        labelAm: "መዝሙር",
        icon: Music,
        href: "/mezmur",
        section: "programs",
        allowedRoles: ["chairperson", "mezmur-leader"],
        priority: 6,
      },
      {
        id: "biblical-studies",
        label: "Biblical Studies",
        labelAm: "መጽሐፍ ቅዱስ ጥናት",
        icon: BookOpen,
        href: "/biblical-studies",
        section: "programs",
        allowedRoles: ["chairperson", "timihrt-leader", "kutitr-leader", "ekd-leader"],
        priority: 7,
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    labelAm: "ዳኝነት",
    items: [
      {
        id: "prayer",
        label: "Prayer Ministry",
        labelAm: "ጸሎት አገልግሎት",
        icon: HandHeart,
        href: "/prayer",
        section: "management",
        allowedRoles: ["chairperson", "sub-chairperson"],
        priority: 8,
      },
      {
        id: "oversight",
        label: "Oversight",
        labelAm: "ቁጠባ",
        icon: Shield,
        href: "/oversight",
        section: "management",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "super-admin"],
        priority: 9,
      },
      {
        id: "planning",
        label: "Planning",
        labelAm: "እቅፍ",
        icon: Target,
        href: "/planning",
        section: "management",
        allowedRoles: ["chairperson", "sub-chairperson", "secretary", "ekd-leader", "super-admin"],
        priority: 10,
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
        labelAm: "ቅንብሮች",
        icon: Settings,
        href: "/settings",
        section: "system",
        allowedRoles: ["super-admin", "chairperson"],
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
