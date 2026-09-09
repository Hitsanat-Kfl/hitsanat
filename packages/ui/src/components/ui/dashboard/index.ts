// Layout
export { DashboardContainer, type DashboardContainerProps } from "./dashboard-container";
export { DashboardHeader, type DashboardHeaderProps } from "./dashboard-header";
export {
  DashboardGrid,
  DashboardGridItem,
  type DashboardGridProps,
  type DashboardGridItemProps,
} from "./dashboard-grid";
export { DashboardSection, type DashboardSectionProps } from "./dashboard-section";

// Widget Foundation
export {
  DashboardWidget,
  WidgetHeader,
  WidgetContent,
  WidgetFooter,
  WidgetLoading,
  WidgetEmpty,
  WidgetError,
  type DashboardWidgetProps,
  type WidgetHeaderProps,
  type WidgetContentProps,
  type WidgetFooterProps,
  type WidgetLoadingProps,
  type WidgetEmptyProps,
  type WidgetErrorProps,
} from "./dashboard-widget";

// Widgets
export { KPIWidget, KPIRow, type KPIWidgetProps, type KPIRowProps } from "./kpi-widget";
export { QuickActionsWidget, type QuickActionsWidgetProps } from "./quick-actions-widget";
export { ListWidget, type ListWidgetProps } from "./list-widget";
export { ActivityWidget, type ActivityWidgetProps } from "./activity-widget";
export { UpcomingEventsWidget, type UpcomingEventsWidgetProps } from "./upcoming-events-widget";
export { ProgressWidget, type ProgressWidgetProps } from "./progress-widget";
export { StatusSummaryWidget, type StatusSummaryWidgetProps } from "./status-summary-widget";
export { ApprovalQueueWidget, type ApprovalQueueWidgetProps } from "./approval-queue-widget";
export { AssignmentWidget, type AssignmentWidgetProps } from "./assignment-widget";
export { AttendanceWidget, type AttendanceWidgetProps } from "./attendance-widget";
export { AnnouncementWidget, type AnnouncementWidgetProps } from "./announcement-widget";
export { PlanningWidget, type PlanningWidgetProps } from "./planning-widget";
