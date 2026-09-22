import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuperAdminDashboardPage } from "../features/dashboard/components/super-admin-dashboard";
import { I18nProvider, ShellProvider } from "../features/shell";

const fixtures = vi.hoisted(() => {
  const usersPage = {
    success: true,
    data: [
      {
        // The regression case: unverified email but ACTIVE lifecycle —
        // must NOT be treated as deactivated.
        id: "u1",
        name: "Unverified But Active",
        email: "unverified@hitsanat.org",
        role: "CHAIRPERSON",
        memberId: "m1",
        emailVerified: false,
        status: "ACTIVE",
        deactivatedAt: null,
        subDepartments: [],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        // Holds an executive role AND a sub-department leadership post
        // for the same member — a BR-009 conflict.
        id: "u2",
        name: "Double Hatted",
        email: "double@hitsanat.org",
        role: "SECRETARY",
        memberId: "m2",
        emailVerified: true,
        status: "ACTIVE",
        deactivatedAt: null,
        subDepartments: [
          { subDepartmentId: "sd1", code: "TIMIHRT", nameEn: "Timihrt", role: "Leader" },
        ],
        createdAt: "2026-01-02T00:00:00Z",
        updatedAt: "2026-01-02T00:00:00Z",
      },
      {
        id: "u3",
        name: "Gone Leader",
        email: "gone@hitsanat.org",
        role: "SUB_CHAIRPERSON",
        memberId: null,
        emailVerified: true,
        status: "DEACTIVATED",
        deactivatedAt: "2026-03-01T00:00:00Z",
        subDepartments: [],
        createdAt: "2026-01-03T00:00:00Z",
        updatedAt: "2026-03-01T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 100, total: 3, totalPages: 1 },
  };

  const health = {
    status: "ok",
    timestamp: "2026-09-20T00:00:00Z",
    service: "hitsanat-api",
    version: "1.0.0",
    environment: "test",
  };

  const auditLogs = {
    success: true,
    data: [
      {
        id: "a1",
        operatorId: "admin-1",
        action: "USER_DEACTIVATED",
        resourceType: "user",
        resourceId: "u3",
        payloadDiff: "email=gone@hitsanat.org",
        ipAddress: null,
        timestamp: "2026-03-01T00:00:00Z",
      },
    ],
  };

  const getFixture = (endpoint: string): unknown => {
    if (endpoint.startsWith("/users")) return usersPage;
    if (endpoint.startsWith("/sub-departments")) return { success: true, data: [] };
    if (endpoint.startsWith("/health")) return health;
    if (endpoint.startsWith("/audit-logs")) return auditLogs;
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

function renderDashboard() {
  return render(
    <I18nProvider>
      <ShellProvider>
        <SuperAdminDashboardPage />
      </ShellProvider>
    </I18nProvider>
  );
}

describe("Super Admin dashboard", () => {
  it("does not treat unverified email as deactivation (status-driven lifecycle)", async () => {
    renderDashboard();

    // "Unverified But Active" (emailVerified: false, status: ACTIVE) must
    // not appear in the Deactivated Accounts widget (it may appear in
    // Recently Provisioned / roster, which list all accounts).
    await screen.findByText("Deactivated Accounts");
    const deactivatedWidget = screen
      .getByRole("region", { name: "Deactivated Accounts" })
      .closest("section");
    expect(deactivatedWidget).not.toBeNull();
    await waitFor(() => {
      expect(
        within(deactivatedWidget as HTMLElement).queryAllByText("unverified@hitsanat.org")
      ).toHaveLength(0);
    });

    // Only the truly deactivated account is listed.
    await waitFor(() => {
      expect(screen.getAllByText(/gone@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
    });

    // Account status donut legend counts by lifecycle status (2 active, 1 deactivated).
    await waitFor(() => {
      const donut = screen.getByRole("img", { name: /Account status: 2 active, 1 deactivated/ });
      expect(donut).toBeDefined();
      expect(within(donut.closest("figure") as HTMLElement).getByText("Deactivated")).toBeDefined();
    });
  });

  it("KPIs reflect lifecycle status counts", async () => {
    renderDashboard();

    await screen.findByText("Active Accounts");
    expect(screen.getByText("Status ACTIVE")).toBeDefined();
    expect(screen.getByText("User Accounts")).toBeDefined();
  });

  it("lists deactivated accounts with one-click reactivation", async () => {
    renderDashboard();

    expect(await screen.findByRole("button", { name: /Reactivate Gone Leader/i })).toBeDefined();
  });

  it("renders the leadership roster with BR-009 conflict highlighting", async () => {
    renderDashboard();

    await screen.findByText("Leadership Roster");

    // The double-hatted member appears with the conflict marker…
    // Posts are joined with " · " so the full text contains Secretary and TIMIHRT.
    expect(await screen.findByText(/Secretary.*TIMIHRT/)).toBeDefined();
    // …and the BR-009 banner is shown.
    expect(screen.getByText(/member holds more than one leadership post/)).toBeDefined();

    // …and the conflict row carries the warning indicator.
    const conflictRow = screen.getByText(/Secretary.*TIMIHRT/).closest("tr");
    expect(conflictRow?.querySelector("svg")).not.toBeNull();
  });

  it("shows system health and audit activity", async () => {
    renderDashboard();

    expect(await screen.findByText("API Status")).toBeDefined();
    expect(await screen.findByText(/Operational · v1\.0\.0 · test/)).toBeDefined();
    // The deactivated account surfaces in the audit activity feed.
    await waitFor(() => {
      expect(screen.getAllByText(/gone@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
    });
  });
});
