import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../lib/api-client";
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
        id: "p-active",
        academicYear: "2026",
        title: "Active Master Plan",
        totalBudget: 1000,
        totalPeople: 10,
        totalTime: 100,
        status: "Active",
        createdBy: "secretary",
        createdAt: "2026-01-01T00:00:00Z",
      },
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
    pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
  };
  const distributions = {
    success: true,
    data: [
      {
        distributionId: "d1",
        activityMainActivity: "Bible study workshop",
        subDepartmentId: "sd1",
        status: "In_Progress",
        assignedAt: "2026-01-05T00:00:00Z",
      },
      {
        distributionId: "d2",
        activityMainActivity: "Choir rehearsal prep",
        subDepartmentId: "sd2",
        status: "Completed",
        assignedAt: "2026-01-06T00:00:00Z",
      },
    ],
  };
  const events = {
    success: true,
    data: [
      {
        id: "e1",
        title: "Youth Gathering",
        eventDate: "2026-04-01T14:00:00Z",
        venue: "Main Hall",
        description: "",
      },
    ],
    pagination: { page: 1, limit: 5, total: 1, totalPages: 1 },
  };
  const audit = {
    success: true,
    data: [
      {
        id: "a1",
        operatorId: "u1",
        action: "USER_CREATED",
        resourceType: "user",
        resourceId: "u2",
        payloadDiff: "email=leader@hitsanat.org; role=SECRETARY",
        ipAddress: null,
        timestamp: "2026-03-01T10:00:00Z",
      },
    ],
  };
  const getFixture = (endpoint: string): unknown => {
    if (endpoint === "/sub-departments") return departments;
    if (endpoint.startsWith("/reports")) return reports;
    if (endpoint.startsWith("/annual-plans/") && endpoint.endsWith("/distributions"))
      return distributions;
    if (endpoint.startsWith("/annual-plans")) return plans;
    if (endpoint.startsWith("/events")) return events;
    if (endpoint.startsWith("/audit-logs")) return audit;
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

describe("Sub-Chairperson Dashboard (Phase 06)", () => {
  beforeEach(() => {
    // Tests below (skeleton, error) override api.get; restore the
    // endpoint-keyed fixture resolution for every test.
    vi.mocked(api.get).mockImplementation((endpoint: string) =>
      Promise.resolve(fixtures.getFixture(endpoint))
    );
  });

  it("renders the dashboard header", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Sub-Chairperson Dashboard")).toBeDefined();
    });
  });

  it("renders coordination KPIs from real data", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Coordination Overview")).toBeDefined();
      expect(screen.getByText("Reports In Review")).toBeDefined();
      expect(screen.getByText("Activities In Progress")).toBeDefined();
      // KPI label + section title share this text.
      expect(screen.getAllByText("Upcoming Activities").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the attention section", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Requires Attention")).toBeDefined();
      expect(screen.getByText("Awaiting Executive Review")).toBeDefined();
      // Submitted report + draft plan appear in the review queue.
      expect(screen.getByText("Report: Monthly — Month 1")).toBeDefined();
      expect(screen.getByText("Plan: Annual Master Plan")).toBeDefined();
    });
  });

  it("renders distribution progress from the active plan", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Distributed Activities").length).toBeGreaterThanOrEqual(1);
      // "In progress" and "Completed" also appear as assignment-row statuses.
      expect(screen.getAllByText("In progress").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the department status board", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Department Status Board")).toBeDefined();
      expect(screen.getByText(/Timihrt \(ትምህርት\)/)).toBeDefined();
    });
  });

  it("renders real distributed assignments", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Responsibilities")).toBeDefined();
      expect(screen.getByText("Bible study workshop")).toBeDefined();
      expect(screen.getByText("Choir rehearsal prep")).toBeDefined();
      expect(screen.getByText(/TIMIHRT · In Progress/)).toBeDefined();
    });
  });

  it("renders upcoming activities from real events", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Youth Gathering")).toBeDefined();
    });
  });

  it("renders recent activity from the audit trail", async () => {
    renderDashboard();

    await waitFor(() => {
      // Section title + widget title share this text.
      expect(screen.getAllByText("Recent Activity").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/created user account/)).toBeDefined();
    });
  });

  it("renders quick actions", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: "Sub-Departments" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Reports" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Planning" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Events" })).toBeDefined();
    });
  });

  it("shows the error state when departments fail", async () => {
    const { api } = await import("../lib/api-client");
    vi.mocked(api.get).mockImplementation((endpoint: string) =>
      endpoint === "/sub-departments"
        ? Promise.reject(new Error("unauthorized"))
        : Promise.resolve(fixtures.getFixture(endpoint))
    );

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/unauthorized/)).toBeDefined();
      expect(screen.getByText("Retry")).toBeDefined();
    });
  });

  it("renders the skeleton loading state before data arrives", async () => {
    const { api } = await import("../lib/api-client");
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    renderDashboard();

    // aria-busy container marks the loading layout; header stays visible.
    await waitFor(() => {
      expect(screen.getByText("Sub-Chairperson Dashboard")).toBeDefined();
    });
    expect(document.querySelector("[aria-busy='true']")).not.toBeNull();
  });

  it("renders Amharic section titles when locale is am", async () => {
    // AppShell bridges the shell locale into DashboardLocaleProvider in the
    // real app; the test replicates that bridge with locale="am".
    const { DashboardLocaleProvider } = await import("@repo/ui");
    function AmharicWrapper({ children }: { children: React.ReactNode }) {
      return (
        <I18nProvider initialLocale="am">
          <DashboardLocaleProvider locale="am">
            <ShellProvider>{children}</ShellProvider>
          </DashboardLocaleProvider>
        </I18nProvider>
      );
    }

    render(
      <AmharicWrapper>
        <SubChairpersonDashboardPage />
      </AmharicWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("የምክትል ሰብሳቢ ዳሽቦርድ")).toBeDefined();
      expect(screen.getByText("የመሪ ሁኔታ")).toBeDefined();
      expect(screen.getByText("ኃላፊነቶች")).toBeDefined();
    });
  });

  it("renders English titles when locale is en", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Sub-Chairperson Dashboard")).toBeDefined();
      expect(screen.getByText("Coordination Overview")).toBeDefined();
    });
    expect(screen.queryByText("የምክትል ሰብሳቢ ዳሽቦርድ")).toBeNull();
  });
});
