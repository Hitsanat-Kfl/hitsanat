import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../src/infrastructure/api/client";
import { MezmurDashboardPage } from "../src/widgets/dashboard/components/mezmur-dashboard";
import { I18nProvider, ShellProvider } from "../src/widgets/shell";
import { QueryTestProvider, TestProviders } from "./test-providers";

// Shared endpoint-keyed fixtures
const fixtures = vi.hoisted(() => {
  const departments = {
    success: true,
    data: [
      {
        id: "sd-mezmur",
        code: "MEZMUR",
        nameAm: "መዝሙር",
        nameEn: "Mezmur",
        description: "Music and choir ministry",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
  };

  const roster = {
    success: true,
    data: [
      {
        memberId: "m1",
        memberName: "Yared Solomon",
        christianName: "Gibre Maryam",
        role: "Leader",
        isPrimary: true,
        assignedAt: "2026-01-10T00:00:00Z",
      },
      {
        memberId: "m2",
        memberName: "Bethlehem Tadesse",
        christianName: "Walatta Yohannes",
        role: "Member",
        isPrimary: false,
        assignedAt: "2026-01-15T00:00:00Z",
      },
      {
        memberId: "m3",
        memberName: "Abel Tesfaye",
        christianName: "Tekle Haymanot",
        role: "Member",
        isPrimary: false,
        assignedAt: "2026-01-20T00:00:00Z",
      },
    ],
  };

  const subDeptDashboard = {
    success: true,
    data: {
      departmentCode: "MEZMUR",
      departmentName: "Mezmur",
      memberCount: 3,
      childCount: 45,
      attendanceRate: 88,
      recentEvents: [],
      progressItems: [],
    },
  };

  const plans = {
    success: true,
    data: [
      {
        id: "plan-2026",
        academicYear: "2026",
        title: "2026 Ministry Master Plan",
        totalBudget: 50000,
        totalPeople: 30,
        totalTime: 120,
        status: "Active",
        createdBy: "secretary",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
  };

  const distributions = {
    success: true,
    data: [
      {
        distributionId: "dist-1",
        activityMainActivity: "Holiday Choir Repertoire Preparation",
        subDepartmentId: "sd-mezmur",
        status: "Assigned",
        assignedAt: "2026-02-01T00:00:00Z",
      },
      {
        distributionId: "dist-2",
        activityMainActivity: "Vocal Training & Instrument Practice",
        subDepartmentId: "sd-mezmur",
        status: "In_Progress",
        assignedAt: "2026-02-10T00:00:00Z",
      },
      {
        distributionId: "dist-3",
        activityMainActivity: "Children Hymn Teaching Sessions",
        subDepartmentId: "sd-mezmur",
        status: "Completed",
        assignedAt: "2026-01-15T00:00:00Z",
      },
    ],
  };

  const events = {
    success: true,
    data: [
      {
        id: "evt-1",
        eventName: "Annual Awdemerit Celebration",
        eventType: "Awdemerit",
        eventDate: "2026-04-15T14:00:00Z",
        isPublished: true,
        countdownActive: true,
        venue: "Main Sanctuary",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "evt-2",
        eventName: "Sunday Youth Service",
        eventType: "Special",
        eventDate: "2026-04-20T09:00:00Z",
        isPublished: true,
        countdownActive: false,
        venue: "Auditorium",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
  };

  const sessions = {
    success: true,
    data: [
      {
        id: "sess-1",
        sessionDate: "2026-04-12T16:00:00Z",
        subDepartmentId: "sd-mezmur",
        sessionType: "Weekly Practice",
        topic: "Easter Hymns Practice",
        status: "Scheduled",
        createdBy: "m1",
        createdAt: "2026-04-01T00:00:00Z",
      },
      {
        id: "sess-2",
        sessionDate: "2026-04-05T16:00:00Z",
        subDepartmentId: "sd-mezmur",
        sessionType: "Weekly Practice",
        topic: "Sunday Service Repertoire",
        status: "Completed",
        createdBy: "m1",
        createdAt: "2026-03-25T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
  };

  const audit = {
    success: true,
    data: [
      {
        id: "a1",
        operatorId: "u-mezmur",
        action: "USER_UPDATED",
        resourceType: "user",
        resourceId: "u2",
        payloadDiff: "email=mezmur@hitsanat.org; role=MEZMUR_LEADER",
        ipAddress: null,
        timestamp: "2026-03-01T10:00:00Z",
      },
    ],
  };

  const getFixture = (endpoint: string): unknown => {
    if (endpoint === "/sub-departments") return departments;
    if (endpoint === "/sub-departments/MEZMUR/roster") return roster;
    if (endpoint === "/sub-departments/MEZMUR/dashboard") return subDeptDashboard;
    if (endpoint.startsWith("/annual-plans/") && endpoint.endsWith("/distributions"))
      return distributions;
    if (endpoint.startsWith("/annual-plans")) return plans;
    if (endpoint.startsWith("/events")) return events;
    if (endpoint.startsWith("/attendance/sessions")) return sessions;
    if (endpoint.startsWith("/audit-logs")) return audit;
    return { success: true, data: [] };
  };

  return {
    getFixture,
    departments,
    roster,
    subDeptDashboard,
    plans,
    distributions,
    events,
    sessions,
    audit,
  };
});

vi.mock("../src/infrastructure/api/client", () => ({
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
    <TestProviders>
      <MezmurDashboardPage />
    </TestProviders>
  );
}

describe("Mezmur Leader Dashboard (Phase 08)", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockImplementation((endpoint: string) =>
      Promise.resolve(fixtures.getFixture(endpoint))
    );
  });

  it("renders the dashboard header", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Mezmur Dashboard")).toBeDefined();
    });
  });

  it("renders Mezmur overview KPIs from real data", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Mezmur Overview")).toBeDefined();
      expect(screen.getByText("Choir Members")).toBeDefined();
      expect(screen.getByText("Active Assignments")).toBeDefined();
      // "Upcoming Programs" appears as both KPI label and section title
      expect(screen.getAllByText("Upcoming Programs").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Pending Preparation")).toBeDefined();
      // Choir members count = 3
      expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders attention and preparation required items", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Requires Attention")).toBeDefined();
      expect(screen.getByText("Preparation Required")).toBeDefined();
      // Assigned plan distribution appears in both attention and responsibilities
      expect(
        screen.getAllByText(/Holiday Choir Repertoire Preparation/).length
      ).toBeGreaterThanOrEqual(1);
      // Upcoming Awdemerit event appears in both attention and upcoming programs
      expect(screen.getAllByText(/Annual Awdemerit Celebration/).length).toBeGreaterThanOrEqual(1);
      // Scheduled session
      expect(screen.getByText(/Easter Hymns Practice/)).toBeDefined();
    });
  });

  it("renders empty state when there are no pending preparation items", async () => {
    vi.mocked(api.get).mockImplementation((endpoint: string) => {
      if (endpoint === "/sub-departments") return Promise.resolve(fixtures.departments);
      if (endpoint === "/sub-departments/MEZMUR/roster") return Promise.resolve(fixtures.roster);
      if (endpoint === "/sub-departments/MEZMUR/dashboard")
        return Promise.resolve(fixtures.subDeptDashboard);
      if (endpoint.startsWith("/annual-plans/") && endpoint.endsWith("/distributions")) {
        return Promise.resolve({
          success: true,
          data: [
            {
              distributionId: "dist-3",
              activityMainActivity: "Children Hymn Teaching Sessions",
              subDepartmentId: "sd-mezmur",
              status: "Completed",
              assignedAt: "2026-01-15T00:00:00Z",
            },
          ],
        });
      }
      if (endpoint.startsWith("/annual-plans")) return Promise.resolve(fixtures.plans);
      if (endpoint.startsWith("/events")) {
        return Promise.resolve({
          success: true,
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
      }
      if (endpoint.startsWith("/attendance/sessions")) {
        return Promise.resolve({
          success: true,
          data: [],
          pagination: { page: 1, limit: 50, total: 0, totalPages: 1 },
        });
      }
      return Promise.resolve(fixtures.getFixture(endpoint));
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("No pending preparation")).toBeDefined();
      expect(
        screen.getByText("Mezmur responsibilities requiring your attention will appear here.")
      ).toBeDefined();
    });
  });

  it("renders assignments and progress status summaries", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Assignments & Progress")).toBeDefined();
      expect(screen.getByText(/Plan Activities/)).toBeDefined();
      expect(screen.getByText(/Practice & Sessions/)).toBeDefined();
      expect(screen.getByText("Assigned activities")).toBeDefined();
      expect(screen.getByText("Completed sessions")).toBeDefined();
    });
  });

  it("renders Mezmur responsibilities list", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Mezmur Responsibilities")).toBeDefined();
      expect(screen.getByText("Vocal Training & Instrument Practice")).toBeDefined();
      expect(screen.getByText("Children Hymn Teaching Sessions")).toBeDefined();
    });
  });

  it("renders upcoming programs and Awdemerit events", async () => {
    renderDashboard();

    await waitFor(() => {
      // "Upcoming Programs" appears as both KPI label and section title
      expect(screen.getAllByText("Upcoming Programs").length).toBeGreaterThanOrEqual(1);
      // Awdemerit appears in both attention queue and upcoming programs
      expect(screen.getAllByText(/Annual Awdemerit Celebration/).length).toBeGreaterThanOrEqual(1);
      // Sunday Youth Service appears in both attention queue and upcoming programs
      expect(screen.getAllByText(/Sunday Youth Service/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders recent activity from the audit trail", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Recent Activity").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/updated user account/)).toBeDefined();
    });
  });

  it("renders quick actions", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: "Choir Roster" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Department Board" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Practice Attendance" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Events & Awdemerit" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Annual Planning" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Reports" })).toBeDefined();
    });
  });

  it("shows error state when data fails to load", async () => {
    vi.mocked(api.get).mockImplementation(() => Promise.reject(new Error("Network failure")));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Network failure/)).toBeDefined();
      expect(screen.getByText("Retry")).toBeDefined();
    });
  });

  it("renders the skeleton loading state before data arrives", async () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Mezmur Dashboard")).toBeDefined();
    });
    expect(document.querySelector("[aria-busy='true']")).not.toBeNull();
  });

  it("renders Amharic titles and labels when locale is am", async () => {
    const { DashboardLocaleProvider } = await import("@repo/ui");
    function AmharicWrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryTestProvider>
          <I18nProvider initialLocale="am">
            <DashboardLocaleProvider locale="am">
              <ShellProvider>{children}</ShellProvider>
            </DashboardLocaleProvider>
          </I18nProvider>
        </QueryTestProvider>
      );
    }

    render(
      <AmharicWrapper>
        <MezmurDashboardPage />
      </AmharicWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("የመዝሙር መሪ ዳሽቦርድ")).toBeDefined();
      expect(screen.getByText("የመዝሙር አጠቃላይ ዕይታ")).toBeDefined();
      expect(screen.getByText("የሚጠይቅ ትኩረት")).toBeDefined();
      expect(screen.getByText("ምደባዎች እና እድገት")).toBeDefined();
      expect(screen.getByText("የመዝሙር ኃላፊነቶች")).toBeDefined();
    });
  });

  it("renders English titles when locale is en", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Mezmur Dashboard")).toBeDefined();
      expect(screen.getByText("Mezmur Overview")).toBeDefined();
    });
    expect(screen.queryByText("የመዝሙር መሪ ዳሽቦርድ")).toBeNull();
  });
});
