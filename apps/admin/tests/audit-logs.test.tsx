import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuditLogsPage from "../features/audit-logs/components/audit-logs-page";
import { I18nProvider, ShellProvider } from "../features/shell";

const fixtures = vi.hoisted(() => {
  const auditPage = {
    success: true,
    data: [
      {
        id: "a1",
        operatorId: "admin-1",
        action: "USER_DEACTIVATED",
        resourceType: "user",
        resourceId: "u2",
        payloadDiff: "email=leader@hitsanat.org",
        ipAddress: "10.0.0.7",
        timestamp: "2026-03-01T10:00:00Z",
      },
      {
        id: "a2",
        operatorId: "admin-1",
        action: "BYPASS_ACTION",
        resourceType: "members",
        resourceId: "m1",
        payloadDiff: "POST /api/v1/members/m1 → 200",
        ipAddress: null,
        timestamp: "2026-03-02T10:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
  };

  const usersList = {
    success: true,
    data: [{ id: "admin-1", name: "Super Admin", email: "admin@hitsanat.org" }],
  };

  const getFixture = (endpoint: string): unknown => {
    if (endpoint.startsWith("/audit-logs")) return auditPage;
    if (endpoint.startsWith("/users")) return usersList;
    return { success: true, data: [] };
  };
  return { getFixture };
});

const getMock = vi.hoisted(() =>
  vi.fn().mockImplementation((endpoint: string) => Promise.resolve(fixtures.getFixture(endpoint)))
);

vi.mock("../lib/api-client", () => ({
  api: { get: getMock },
}));

function renderAuditPage() {
  return render(
    <I18nProvider>
      <ShellProvider>
        <AuditLogsPage />
      </ShellProvider>
    </I18nProvider>
  );
}

describe("Audit logs page", () => {
  beforeEach(() => {
    getMock.mockClear();
  });

  it("renders entries with human-readable actions and IP addresses", async () => {
    renderAuditPage();

    expect(await screen.findByText("Deactivated user account")).toBeDefined();
    // The label appears both as a badge and in the filter dropdown.
    expect(screen.getAllByText("Super admin bypass action").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("10.0.0.7")).toBeDefined();
    expect(screen.getByText("email=leader@hitsanat.org")).toBeDefined();
  });

  it("refetches with the selected action filter", async () => {
    renderAuditPage();
    await screen.findByText("Deactivated user account");

    fireEvent.change(screen.getByLabelText("Filter by action"), {
      target: { value: "USER_CREATED" },
    });

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith(expect.stringContaining("action=USER_CREATED"));
    });
  });

  it("filters by a searchable actor instead of a raw UUID", async () => {
    renderAuditPage();
    await screen.findByText("Deactivated user account");

    fireEvent.change(screen.getByLabelText("Filter by actor"), {
      target: { value: "Super" },
    });

    // Picker searched the users API for the actor.
    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith(expect.stringContaining("/users?search=Super"));
    });

    fireEvent.click(await screen.findByRole("button", { name: /Super Admin/ }));

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith(expect.stringContaining("operatorId=admin-1"));
    });
  });

  it("applies the date range filters", async () => {
    renderAuditPage();
    await screen.findByText("Deactivated user account");

    fireEvent.change(screen.getByLabelText("From date"), {
      target: { value: "2026-03-01" },
    });
    fireEvent.change(screen.getByLabelText("To date"), {
      target: { value: "2026-03-31" },
    });

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith(expect.stringContaining("from=2026-03-01"));
      expect(getMock).toHaveBeenCalledWith(expect.stringContaining("to=2026-03-31"));
    });
  });

  it("exports the current filter selection as CSV", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderAuditPage();
    await screen.findByText("Deactivated user account");

    fireEvent.click(screen.getByRole("button", { name: /Export CSV/i }));

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledOnce();
      const url = openSpy.mock.calls[0][0] as string;
      expect(url).toContain("/audit-logs?");
      expect(url).toContain("format=csv");
    });
    openSpy.mockRestore();
  });

  it("shows the empty state when no entries match", async () => {
    getMock.mockImplementationOnce(() =>
      Promise.resolve({
        success: true,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 1 },
      })
    );
    renderAuditPage();

    expect(await screen.findByText("No audit logs found.")).toBeDefined();
  });
});
