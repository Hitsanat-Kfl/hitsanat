import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SubChairpersonDashboardPage } from "../features/dashboard/components/sub-chairperson-dashboard";
import { I18nProvider, ShellProvider } from "../features/shell";

// Shared endpoint-keyed fixtures (hoisted for the vi.mock factory).
const fixtures = vi.hoisted(() => {
  const departments = {
    success: true,
    data: [
      {
        id: "sd1",
        code: "TIMIHRT",
        nameAm: "ትምህርት",
        nameEn: "Timihrt",
        description: null,
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "sd2",
        code: "MEZMUR",
        nameAm: "መዝሙር",
        nameEn: "Mezmur",
        description: null,
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
  };
  const reports = {
    success: true,
    data: [
      {
        id: "r1",
        reportType: "Monthly",
        periodLabel: "Month 1",
        periodStart: "2026-01-01",
        periodEnd: "2026-01-30",
        subDepartmentId: "sd1",
        generatedBy: "leader1",
        status: "Submitted",
        metrics: null,
        challenges: null,
        notes: null,
        createdAt: "2026-01-30T00:00:00Z",
      },
      {
        id: "r2",
        reportType: "Weekly",
        periodLabel: "Week 2",
        periodStart: "2026-01-08",
        periodEnd: "2026-01-14",
        subDepartmentId: "sd2",
        generatedBy: "leader2",
        status: "Approved",
        metrics: null,
        challenges: null,
        notes: null,
        createdAt: "2026-01-14T00:00:00Z",
      },
      {
        id: "r3",
        reportType: "Weekly",
        periodLabel: "Week 3",
        periodStart: "2026-01-15",
        periodEnd: "2026-01-21",
        subDepartmentId: "sd2",
        generatedBy: "leader2",
        status: "Draft",
        metrics: null,
        challenges: null,
        notes: null,
        createdAt: "2026-01-21T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 100, total: 3, totalPages: 1 },
  };
  const plans = {
    success: true,
    data: [
      {
        id: "p1",
        academicYear: "2026",
        title: "Annual Master Plan",
        totalBudget: 1000,
        totalPeople: 10,
        totalTime: 100,
        status: "Draft",
        createdBy: "secretary",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
  };
  const getFixture = (endpoint: string): unknown => {
    if (endpoint === "/sub-departments") return departments;
    if (endpoint.startsWith("/reports")) return reports;
    if (endpoint.startsWith("/annual-plans")) return plans;
    return { success: true, data: [] };
  };
  return { getFixture };
});

vi.mock("../lib/api-client", () => ({
  api: {
    get: vi
      .fn()
      .mockImplementation((endpoint: string) => Promise.resolve(fixtures.getFixture(endpoint))),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function renderDashboard() {
  return render(
    <I18nProvider>
      <ShellProvider>
        <SubChairpersonDashboardPage />
      </ShellProvider>
    </I18nProvider>
  );
}

describe("Vice-Chairperson Dashboard", () => {
  it("renders the dashboard header", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Vice-Chairperson Dashboard")).toBeDefined();
    });
  });

  it("renders oversight KPIs from real data", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Oversight Overview")).toBeDefined();
      expect(screen.getByText("Reports In Review")).toBeDefined();
      expect(screen.getByText("Plan Drafts")).toBeDefined();
    });
  });

  it("renders the department status board with per-department rows", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Department Status Board")).toBeDefined();
      expect(screen.getByText(/Timihrt \(ትምህርት\)/)).toBeDefined();
      expect(screen.getByText(/Mezmur \(መዝሙር\)/)).toBeDefined();
      // Timihrt has 1 submitted report; Mezmur has approved + draft.
      expect(screen.getByText(/1 approved · 0 in review · 1 draft/)).toBeDefined();
    });
  });

  it("renders the report pipeline summary", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Report Pipeline")).toBeDefined();
      expect(screen.getByText("Approved reports")).toBeDefined();
      expect(screen.getByText("In review")).toBeDefined();
    });
  });

  it("lists reports and plan drafts awaiting executive review", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Awaiting Executive Review")).toBeDefined();
      expect(screen.getByText("Report: Monthly — Month 1")).toBeDefined();
      expect(screen.getByText("Plan: Annual Master Plan")).toBeDefined();
    });
  });

  it("renders quick actions", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: "Sub-Departments" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Reports" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Planning" })).toBeDefined();
    });
  });
});
