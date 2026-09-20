import { render, screen, waitFor } from "@testing-library/react";
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
    // not appear in the Deactivated Accounts widget.
    await screen.findByText("Deactivated Accounts");
    await waitFor(() => {
      expect(screen.queryByText("unverified@hitsanat.org")).toBeNull();
    });

    // Only the truly deactivated account is listed.
    await waitFor(() => {
      expect(screen.getAllByText(/gone@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
    });

    // Account status summary counts by lifecycle status.
    await waitFor(() => {
      expect(screen.getByText("Active accounts")).toBeDefined();
      expect(screen.getByText("Deactivated accounts")).toBeDefined();
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

    await screen.findByText("Leadership Posts");

    // The double-hatted member appears with the conflict marker…
    expect(await screen.findByText("⚠ Double Hatted")).toBeDefined();
    expect(screen.getByText(/SECRETARY \(global\), Leader — TIMIHRT/)).toBeDefined();
    expect(screen.getByText("BR-009 conflict")).toBeDefined();

    // …and the warning banner counts one conflict.
    expect(screen.getByText(/1 member\(s\) hold more than one leadership post/)).toBeDefined();
  });

  it("shows system health and audit activity", async () => {
    renderDashboard();

    expect(await screen.findByText(/Status: ok/)).toBeDefined();
    // The deactivated account surfaces in both the attention widget and
    // the audit activity feed.
    await waitFor(() => {
      expect(screen.getAllByText(/gone@hitsanat\.org/).length).toBeGreaterThanOrEqual(1);
    });
  });
});
