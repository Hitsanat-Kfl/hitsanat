export { AppShell } from "./app-shell";
export { AppSidebar } from "./app-sidebar";
export { AppHeader } from "./app-header";
export { MobileNav } from "./mobile-nav";
export { UserMenu } from "./user-menu";
export { NotificationCenter, type Notification } from "./notification-center";
export { GlobalSearch, SearchTrigger } from "./global-search";
export { PageShell, PageHeader } from "./page-shell";
export { ShellProvider, useShell } from "./shell-context";
export { I18nProvider, useI18n, type Locale } from "./i18n";
export {
  navigationConfig,
  getNavigationForRoles,
  getPrimaryNavItems,
  findActiveNavItem,
  type UserRole,
  type NavItem,
  type NavSection,
} from "./nav-config";
