export { AppShell, AuthenticatedLayout, MainContent } from "./app-shell";
export { AppSidebar } from "./app-sidebar";
export { AppHeader } from "./app-header";
export { MobileNav } from "./mobile-nav";
export { UserMenu } from "./user-menu";
export { NotificationCenter, type Notification } from "./notification-center";
export { GlobalSearch, SearchTrigger } from "./global-search";
export {
  PageShell,
  PageHeader,
  AlertBanner,
  PageLoading,
  PageEmpty,
  PagePagination,
} from "./page-shell";
export { ShellProvider, useShell } from "./shell-context";
export { I18nProvider, useI18n, type Locale } from "./i18n";
export {
  navigationConfig,
  getNavigationForRoles,
  getPrimaryNavItems,
  findActiveNavItem,
  mapSessionRolesToNavRoles,
  type UserRole,
  type NavItem,
  type NavSection,
} from "./nav-config";
export {
  adminNavigationConfig,
  getAdminNavigationForRoles,
  getAdminPrimaryNavItems,
  findAdminActiveNavItem,
  mapSessionRolesToAdminNavRoles,
  type AdminNavRole,
  type AdminNavItem,
  type AdminNavSection,
} from "./admin-nav-config";
