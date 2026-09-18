import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChairpersonDashboardPage from "../app/(authenticated)/page.js";
import { I18nProvider } from "../features/shell";
import { ShellProvider } from "../features/shell";

// Mock the API client
vi.mock("../lib/api-client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 1, total: 124, totalPages: 1 },
    }),
  },
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ShellProvider>{children}</ShellProvider>
    </I18nProvider>
  );
}

describe("Chairperson Dashboard", () => {
  it("renders the dashboard header", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Chairperson Dashboard").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders breadcrumbs", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeDefined();
    });
  });

  it("renders executive overview KPIs", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Executive Overview")).toBeDefined();
      expect(screen.getByText("Active Members")).toBeDefined();
      expect(screen.getByText("Enrolled Children")).toBeDefined();
    });
  });

  it("renders attention section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Requires Attention")).toBeDefined();
    });
  });

  it("renders organization health section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Organization Health")).toBeDefined();
    });
  });

  it("renders activity status section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Activity Status")).toBeDefined();
    });
  });

  it("renders upcoming events section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Upcoming Events").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders recent activity section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Recent Activity").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders quick actions section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("View Master Plan")).toBeDefined();
      expect(screen.getByText("View Reports")).toBeDefined();
      expect(screen.getByText("Manage Events")).toBeDefined();
    });
  });

  it("renders KPI values", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("124").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders navigation links", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("View schedule")).toBeDefined();
    });
  });
});
