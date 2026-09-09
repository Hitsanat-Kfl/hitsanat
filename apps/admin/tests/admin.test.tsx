import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "../app/page.js";
import { ShellProvider } from "../components/shell/shell-context";
import { I18nProvider } from "../components/shell/i18n";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ShellProvider>{children}</ShellProvider>
    </I18nProvider>
  );
}

describe("Admin Shell & Dashboard Page", () => {
  it("renders the dashboard page with breadcrumbs and cards", () => {
    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    );

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Admin Shell Overview")).toBeDefined();
    expect(screen.getByText("System Status")).toBeDefined();
    expect(screen.getByText("Healthy")).toBeDefined();
    expect(screen.getByText("Calendar System")).toBeDefined();
    expect(screen.getByText("UI Components")).toBeDefined();
  });
});
