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

  it("renders system overview KPIs", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("System Overview")).toBeDefined();
      expect(screen.getByText("User Accounts")).toBeDefined();
      expect(screen.getByText("Active Accounts")).toBeDefined();
    });
  });

  it("renders KPI values from real data", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Healthy")).toBeDefined();
    });
  });

  it("renders administrative attention section", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Requires Administrative Attention")).toBeDefined();
      expect(screen.getByText("Deactivated Accounts")).toBeDefined();
    });
  });

  it("renders deactivated account rows", async () => {
    renderDashboard();

    await waitFor(() => {
      // Visible in both Deactivated Accounts and Recently Provisioned lists.
      expect(screen.getAllByText("Deactivated Leader").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/deact@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders users and access section", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Users & Access")).toBeDefined();
      expect(screen.getByText("Recently Provisioned")).toBeDefined();
      expect(screen.getByText("Roles in Use")).toBeDefined();
    });
  });

  it("renders role distribution from actual accounts", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("SUPER_ADMIN")).toBeDefined();
      expect(screen.getByText("CHAIRPERSON")).toBeDefined();
    });
  });

  it("renders system health from the real health endpoint", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("System Health")).toBeDefined();
      expect(screen.getByText(/Status: ok/)).toBeDefined();
      expect(screen.getByText(/Version: 1\.0\.0/)).toBeDefined();
    });
  });

  it("renders quick actions", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      // Scoped to buttons — "Sub-Departments" also appears as a nav section label.
      expect(screen.getByRole("button", { name: "Manage Users" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Manage Members" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Sub-Departments" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Reports" })).toBeDefined();
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
      expect(screen.getByText(/API health unavailable/)).toBeDefined();
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
