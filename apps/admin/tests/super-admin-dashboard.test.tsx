import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuperAdminDashboardPage } from "../src/widgets/dashboard/components/super-admin-dashboard";
import { TestProviders } from "./test-providers";

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

  const membersPage = {
    success: true,
    data: [],
    pagination: { page: 1, limit: 1, total: 12, totalPages: 12 },
  };

  const childrenPage = {
    success: true,
    data: [],
    pagination: { page: 1, limit: 1, total: 7, totalPages: 7 },
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
    if (endpoint.startsWith("/users/stats")) {
      return {
        success: true,
        data: {
          total: 3,
          active: 2,
          deactivated: 1,
          byRole: { CHAIRPERSON: 1, SECRETARY: 1, SUB_CHAIRPERSON: 1 },
        },
      };
    }
    if (endpoint.startsWith("/users")) return usersPage;
    if (endpoint.startsWith("/system-metadata")) {
      return {
        success: true,
        data: [
          { key: "schema_tag", value: "0006_user_status", updatedAt: "2026-09-20T00:00:00Z" },
          { key: "seed_status", value: "applied", updatedAt: "2026-09-20T00:00:00Z" },
        ],
      };
    }
    if (endpoint.startsWith("/sub-departments")) return { success: true, data: [] };
    if (endpoint.startsWith("/health")) return health;
    if (endpoint.startsWith("/members")) return membersPage;
    if (endpoint.startsWith("/children")) return childrenPage;
    if (endpoint.startsWith("/audit-logs")) return auditLogs;
    return { success: true, data: [] };
  };
  return { getFixture };
});

vi.mock("@/infrastructure/api/client", () => ({
  api: {
    get: vi
      .fn()
      .mockImplementation((endpoint: string) => Promise.resolve(fixtures.getFixture(endpoint))),
    post: vi.fn().mockResolvedValue({ success: true, data: {} }),
  },
}));

function renderDashboard() {
  return render(
    <TestProviders>
      <SuperAdminDashboardPage />
    </TestProviders>
  );
}

describe("Super Admin dashboard", () => {
  it("does not treat unverified email as deactivation (status-driven lifecycle)", async () => {
    renderDashboard();

    // "Unverified But Active" (emailVerified: false, status: ACTIVE) must
    // not appear in the Deactivated Accounts widget (it may appear in
    // Recent Accounts, which lists all accounts).
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
      expect(
        within(deactivatedWidget as HTMLElement).getAllByText(/gone@hitsanat\.org/).length
      ).toBeGreaterThanOrEqual(1);
    });

    // System Snapshot counts accounts by lifecycle status (2 active, 1 deactivated).
    const snapshot = screen.getByRole("region", { name: "System Snapshot" });
    await waitFor(() => {
      expect(within(snapshot).getByText("2 active · 1 deactivated")).toBeDefined();
    });
  });

  it("System Snapshot reflects collection totals from pagination", async () => {
    renderDashboard();

    const snapshot = await screen.findByRole("region", { name: "System Snapshot" });
    expect(within(snapshot).getByText("User Accounts")).toBeDefined();
    expect(within(snapshot).getByText("3")).toBeDefined();
    expect(within(snapshot).getByText("Members")).toBeDefined();
    expect(within(snapshot).getByText("12")).toBeDefined();
    expect(within(snapshot).getByText("Children")).toBeDefined();
    expect(within(snapshot).getByText("7")).toBeDefined();
  });

  it("lists deactivated accounts with one-click reactivation", async () => {
    renderDashboard();

    expect(await screen.findByRole("button", { name: /Reactivate Gone Leader/i })).toBeDefined();
  });

  it("renders the leadership roster with BR-009 conflict highlighting and unassigned posts", async () => {
    renderDashboard();

    const roster = await screen.findByRole("region", { name: "Leadership Roster" });

    // The double-hatted member appears with the conflict marker…
    // Posts are joined with " · " so the full text contains Secretary and TIMIHRT.
    expect(await within(roster).findByText(/Secretary.*TIMIHRT/)).toBeDefined();
    // …and the conflict row carries the warning indicator.
    const conflictRow = within(roster)
      .getByText(/Secretary.*TIMIHRT/)
      .closest("tr");
    expect(conflictRow?.querySelector("svg")).not.toBeNull();

    // Canonical posts with no active holder render as unassigned rows.
    expect(within(roster).getAllByText(/Unassigned/).length).toBeGreaterThanOrEqual(1);
    expect(within(roster).getByText("MEZMUR Leader")).toBeDefined();
  });

  it("shows system status with schema/seed metadata and audit activity", async () => {
    renderDashboard();

    const statusPanel = await screen.findByRole("region", { name: "System Status" });
    expect(await within(statusPanel).findByText("Operational")).toBeDefined();
    expect(within(statusPanel).getByText("v1.0.0")).toBeDefined();
    expect(within(statusPanel).getByText("test")).toBeDefined();
    expect(within(statusPanel).getByText("0006_user_status")).toBeDefined();
    expect(within(statusPanel).getByText("applied")).toBeDefined();
    expect(within(statusPanel).getByText(/Last checked/)).toBeDefined();

    // The deactivated account surfaces in the audit activity feed.
    await waitFor(() => {
      expect(screen.getAllByText(/gone@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders administrative work with counts and frequent administration tiles", async () => {
    renderDashboard();

    const work = await screen.findByRole("region", { name: "Administrative Work" });
    expect(within(work).getByText("Accounts requiring review")).toBeDefined();
    expect(within(work).getAllByText("01").length).toBeGreaterThanOrEqual(1);

    const tiles = screen.getByRole("region", { name: "Frequent Administration" });
    expect(within(tiles).getByText("User Accounts")).toBeDefined();
    expect(within(tiles).getByText("Audit Logs")).toBeDefined();
  });
});
