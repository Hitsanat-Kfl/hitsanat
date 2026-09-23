import { render, screen, waitFor, within } from "@testing-library/react";
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
  // Totals come from pagination.total — a single-row page is enough.
  const membersPage = {
    success: true,
    data: [],
    pagination: { page: 1, limit: 1, total: 5, totalPages: 5 },
  };
  const childrenPage = {
    success: true,
    data: [],
    pagination: { page: 1, limit: 1, total: 8, totalPages: 8 },
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
    if (endpoint.startsWith("/members")) return membersPage;
    if (endpoint.startsWith("/children")) return childrenPage;
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
    post: vi.fn().mockResolvedValue({ success: true, data: {} }),
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
      expect(screen.getAllByText("System Overview").length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Manage the organization, users and system settings.")).toBeDefined();
  });

  it("renders the System Snapshot columns", async () => {
    renderDashboard();

    const snapshot = await screen.findByRole("region", { name: "System Snapshot" });
    expect(within(snapshot).getByText("User Accounts")).toBeDefined();
    expect(within(snapshot).getByText("Members")).toBeDefined();
    expect(within(snapshot).getByText("Children")).toBeDefined();
    expect(within(snapshot).getByText("Sub-Departments")).toBeDefined();
  });

  it("renders snapshot values from real pagination totals", async () => {
    renderDashboard();

    const snapshot = await screen.findByRole("region", { name: "System Snapshot" });
    expect(within(snapshot).getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(within(snapshot).getByText("1 active · 1 deactivated")).toBeDefined();
    expect(within(snapshot).getByText("5")).toBeDefined();
    expect(within(snapshot).getByText("8")).toBeDefined();
  });

  it("renders the deactivated accounts table with reactivation", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Deactivated Accounts")).toBeDefined();
      expect(screen.getAllByText("Deactivated Leader").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/deact@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Deactivated").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: /Reactivate Deactivated Leader/i })).toBeDefined();
    });
  });

  it("renders administrative work with the review item emphasized", async () => {
    renderDashboard();

    const work = await screen.findByRole("region", { name: "Administrative Work" });
    expect(within(work).getByText("Accounts requiring review")).toBeDefined();
    expect(within(work).getByText("Leadership assignments")).toBeDefined();
    expect(within(work).getByText("Unassigned leadership post")).toBeDefined();
    // 01 = deactivated count; 05 = unassigned canonical posts.
    expect(within(work).getAllByText("01").length).toBeGreaterThanOrEqual(1);
    expect(within(work).getAllByText("05").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the leadership roster with unassigned posts", async () => {
    renderDashboard();

    const roster = await screen.findByRole("region", { name: "Leadership Roster" });
    expect(within(roster).getByText("Leadership Roster")).toBeDefined();
    // Both accounts hold executive roles; the canonical departmental posts
    // are unassigned in this fixture.
    expect(within(roster).getAllByText(/Unassigned/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders recent accounts with role labels", async () => {
    renderDashboard();

    const accounts = await screen.findByRole("region", { name: "Recent Accounts" });
    expect(within(accounts).getAllByText("Chairperson").length).toBeGreaterThanOrEqual(1);
    expect(within(accounts).getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the system status panel", async () => {
    renderDashboard();

    const statusPanel = await screen.findByRole("region", { name: "System Status" });
    expect(await within(statusPanel).findByText("Operational")).toBeDefined();
    expect(within(statusPanel).getByText("v1.0.0")).toBeDefined();
    expect(within(statusPanel).getByText("development")).toBeDefined();
    expect(within(statusPanel).getByText(/Last checked/)).toBeDefined();
  });

  it("renders frequent administration tiles targeting existing routes", async () => {
    renderDashboard();

    const tiles = await screen.findByRole("region", { name: "Frequent Administration" });
    expect(within(tiles).getByText("User Accounts")).toBeDefined();
    expect(within(tiles).getByText("Members")).toBeDefined();
    expect(within(tiles).getByText("Children")).toBeDefined();
    expect(within(tiles).getByText("Sub-Departments")).toBeDefined();
    expect(within(tiles).getByText("Roles & Permissions")).toBeDefined();
    expect(within(tiles).getByText("Audit Logs")).toBeDefined();

    expect(
      within(tiles)
        .getByRole("link", { name: /User Accounts Manage accounts/ })
        ?.getAttribute("href")
    ).toBe("/users");
    expect(
      within(tiles)
        .getByRole("link", { name: /Audit Logs View system activity/ })
        ?.getAttribute("href")
    ).toBe("/audit-logs");
    expect(
      within(tiles)
        .getByRole("link", { name: /Roles & Permissions Review role access/ })
        ?.getAttribute("href")
    ).toBe("/permissions");
  });

  it("renders recent activity from the audit trail", async () => {
    renderDashboard();

    const activity = await screen.findByRole("region", { name: "Recent Activity" });
    expect(await within(activity).findByText(/created user account/)).toBeDefined();
    expect(within(activity).getByText("leader@hitsanat.org")).toBeDefined();
  });

  it("shows the health error in the status panel when health is unreachable", async () => {
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
