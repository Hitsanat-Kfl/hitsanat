import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChairpersonDashboardPage from "../app/(authenticated)/page.js";
import { I18nProvider } from "../components/shell/i18n";
import { ShellProvider } from "../components/shell/shell-context";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ShellProvider>{children}</ShellProvider>
    </I18nProvider>
  );
}

describe("Chairperson Dashboard", () => {
  it("renders the dashboard header", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByText("Chairperson Dashboard").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Executive overview of ministry operations and organizational health.")
    ).toBeDefined();
  });

  it("renders breadcrumbs", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Home")).toBeDefined();
  });

  it("renders executive overview KPIs", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Executive Overview")).toBeDefined();
    expect(screen.getByText("Active Members")).toBeDefined();
    expect(screen.getByText("Enrolled Children")).toBeDefined();
    expect(screen.getByText("Attendance Rate")).toBeDefined();
    expect(screen.getByText("Pending Approvals")).toBeDefined();
  });

  it("renders attention section", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Requires Attention")).toBeDefined();
    expect(screen.getByText("New Member Registration - Daniel Kebede")).toBeDefined();
    expect(screen.getByText("Annual Plan 2016 E.C. - Final Review")).toBeDefined();
  });

  it("renders organization health section", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Organization Health")).toBeDefined();
    expect(screen.getByText("Annual Plan Completion")).toBeDefined();
    expect(screen.getByText("Teacher Training Program")).toBeDefined();
  });

  it("renders activity status section", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("Activity Status")).toBeDefined();
    expect(screen.getByText("Completed Activities")).toBeDefined();
  });

  it("renders upcoming events section", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByText("Upcoming Events").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Annual Ministry Celebration")).toBeDefined();
    expect(screen.getByText("Teacher Training Workshop")).toBeDefined();
  });

  it("renders recent activity section", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByText("Recent Activity").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Secretary Office").length).toBeGreaterThanOrEqual(1);
  });

  it("renders quick actions section", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Review Approvals")).toBeDefined();
    expect(screen.getByText("View Master Plan")).toBeDefined();
    expect(screen.getByText("View Reports")).toBeDefined();
    expect(screen.getByText("Manage Events")).toBeDefined();
  });

  it("renders KPI values", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("124")).toBeDefined();
    expect(screen.getByText("87")).toBeDefined();
    expect(screen.getByText("78%")).toBeDefined();
  });

  it("renders progress percentages", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("42%")).toBeDefined();
    expect(screen.getByText("65%")).toBeDefined();
  });

  it("renders navigation links", () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText("View all")).toBeDefined();
    expect(screen.getByText("View schedule")).toBeDefined();
  });
});
