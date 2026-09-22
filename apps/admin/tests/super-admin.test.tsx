import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuperAdminDashboardPage } from "../features/dashboard/components/super-admin-dashboard";
import { I18nProvider, ShellProvider } from "../features/shell";

// Shared endpoint-keyed fixtures (hoisted so the vi.mock factory can use them).
const fixtures = vi.hoisted(() => {
  const usersPage = {
    success: true,
    data: [
      {
        id: "u1",
        name: "Super Admin",
        email: "superadmin@hitsanat.org",
        role: "SUPER_ADMIN",
        memberId: null,
        emailVerified: true,
        status: "ACTIVE",
        deactivatedAt: null,
        subDepartments: [],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "u2",
        name: "Deactivated Leader",
        email: "deact@hitsanat.org",
        role: "CHAIRPERSON",
        memberId: null,
        emailVerified: false,
        status: "DEACTIVATED",
        deactivatedAt: "2026-02-01T00:00:00Z",
        subDepartments: [],
        createdAt: "2026-02-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 100, total: 2, totalPages: 1 },
  };
  const departmentsPage = {
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
  const healthPage = {
    status: "ok",
    timestamp: "2026-01-01T00:00:00Z",
    service: "hitsanat-api",
    version: "1.0.0",
    environment: "development",
  };
  const auditPage = {
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
    if (endpoint.startsWith("/users")) return usersPage;
    if (endpoint === "/sub-departments") return departmentsPage;
    if (endpoint === "/health") return healthPage;
    if (endpoint.startsWith("/audit-logs")) return auditPage;
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

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ShellProvider>{children}</ShellProvider>
    </I18nProvider>
  );
}

function renderDashboard() {
  return render(
    <TestWrapper>
      <SuperAdminDashboardPage />
    </TestWrapper>
  );
}

describe("Super Admin Dashboard", () => {
  it("renders the dashboard header", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Super Admin Dashboard").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the reference KPI row", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("User Accounts")).toBeDefined();
      expect(screen.getByText("Active Accounts")).toBeDefined();
      // "Sub-Departments" also appears as a quick-action tile title.
      expect(screen.getAllByText("Sub-Departments").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("API Health")).toBeDefined();
    });
  });

  it("renders KPI values from real data", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Healthy")).toBeDefined();
    });
  });

  it("renders the deactivated accounts table with status badge", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Deactivated Accounts")).toBeDefined();
      // Visible in both Deactivated Accounts and (potentially) the roster.
      expect(screen.getAllByText("Deactivated Leader").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/deact@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Deactivated").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the account status donut from lifecycle counts", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Account Status")).toBeDefined();
      // "Active" appears in the donut legend and elsewhere (status dots),
      // so scope the assertion to the donut's figure.
      const donut = screen.getByRole("img", { name: /Account status: 1 active, 1 deactivated/ });
      expect(donut).toBeDefined();
      expect(screen.getAllByText("Active").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders recently provisioned and roles in use", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Recently Provisioned")).toBeDefined();
      expect(screen.getByText("Roles in Use")).toBeDefined();
    });
  });

  it("renders role distribution with human-readable labels", async () => {
    renderDashboard();

    await waitFor(() => {
      // Role badges render in Recently Provisioned; "Super Admin" also
      // appears in the page title and roster, hence getAllBy.
      expect(screen.getAllByText("Chairperson").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the leadership roster", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Leadership Roster")).toBeDefined();
    });
  });

  it("renders system health with API status tile", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("System Health")).toBeDefined();
      expect(screen.getByText("API Status")).toBeDefined();
      expect(screen.getByText(/Operational · v1\.0\.0 · development/)).toBeDefined();
    });
  });

  it("renders quick actions targeting existing routes", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Quick Actions")).toBeDefined();
      // The six quick-action tiles render inside both the Quick Actions
      // widget and the System Health tile grid (per the reference layout).
      const usersLinks = screen.getAllByRole("link", { name: /Users Manage user accounts/ });
      expect(usersLinks.length).toBeGreaterThanOrEqual(1);
      expect(usersLinks[0]?.getAttribute("href")).toBe("/users");
      expect(
        screen
          .getAllByRole("link", { name: /Audit Logs View system activity/ })[0]
          ?.getAttribute("href")
      ).toBe("/audit-logs");
      expect(
        screen
          .getAllByRole("link", { name: /Permissions Review role access/ })[0]
          ?.getAttribute("href")
      ).toBe("/permissions");
      expect(
        screen
          .getAllByRole("link", { name: /Members Manage member records/ })[0]
          ?.getAttribute("href")
      ).toBe("/members");
      expect(
        screen
          .getAllByRole("link", { name: /Sub-Departments Configure programs/ })[0]
          ?.getAttribute("href")
      ).toBe("/sub-departments");
      expect(
        screen
          .getAllByRole("link", { name: /Reports View ministry reports/ })[0]
          ?.getAttribute("href")
      ).toBe("/reports");
    });
  });

  it("renders system activity from the audit trail", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("System Activity")).toBeDefined();
      expect(screen.getByText(/created user account/)).toBeDefined();
      expect(screen.getByText("leader@hitsanat.org")).toBeDefined();
    });
  });

  it("shows the API-health fallback when health is unreachable", async () => {
    const { api } = await import("../lib/api-client");
    vi.mocked(api.get).mockImplementation((endpoint: string) =>
      endpoint === "/health"
        ? Promise.reject(new Error("network down"))
        : Promise.resolve(fixtures.getFixture(endpoint))
    );

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("network down")).toBeDefined();
    });
  });

  it("shows the error state when the users endpoint fails", async () => {
    const { api } = await import("../lib/api-client");
    vi.mocked(api.get).mockImplementation((endpoint: string) =>
      endpoint.startsWith("/users")
        ? Promise.reject(new Error("unauthorized"))
        : Promise.resolve(fixtures.getFixture(endpoint))
    );

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/unauthorized/)).toBeDefined();
      expect(screen.getByText("Retry")).toBeDefined();
    });
  });
});
