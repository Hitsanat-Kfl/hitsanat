import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthUserProvider } from "../src/features/authentication";
import { TemporaryGrantsSection } from "../src/features/user-management/components/temporary-grants";
import { renderWithProviders } from "./test-providers";

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock("../src/infrastructure/api/client", () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
}));

function renderGrants(userRoles: string[]) {
  return renderWithProviders(
    <AuthUserProvider
      user={{
        id: "admin-1",
        email: "admin@hitsanat.org",
        name: "Admin",
        role: "SUPER_ADMIN",
        globalRoles: userRoles,
        subDeptRoles: [],
      }}
    >
      <TemporaryGrantsSection userId="target-1" />
    </AuthUserProvider>
  );
}

describe("TemporaryGrantsSection (BR-035)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing for non-Super Admin sessions", () => {
    getMock.mockResolvedValue({ success: true, data: [], pagination: {} });
    renderGrants(["CHAIRPERSON"]);

    expect(screen.queryByText("Temporary Permission Grants")).toBeNull();
    expect(getMock).not.toHaveBeenCalled();
  });

  it("lists grants for Super Admin", async () => {
    getMock.mockResolvedValue({
      success: true,
      data: [
        {
          id: "g1",
          userId: "target-1",
          resource: "members",
          action: "C",
          reason: "Secretary unavailable",
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
          revokedAt: null,
          grantedBy: "admin-1",
          revokedBy: null,
          createdAt: new Date().toISOString(),
        },
      ],
      pagination: { limit: 50, offset: 0, total: 1 },
    });

    renderGrants(["SUPER_ADMIN"]);

    await waitFor(() => {
      expect(screen.getByText("Temporary Permission Grants")).toBeDefined();
      expect(screen.getByText("members:C")).toBeDefined();
      expect(screen.getByText(/Secretary unavailable/)).toBeDefined();
    });
    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining("/permission-grants?userId=target-1")
    );
  });

  it("shows the grant form with resource, action, and duration controls", async () => {
    getMock.mockResolvedValue({ success: true, data: [], pagination: { total: 0 } });

    renderGrants(["SUPER_ADMIN"]);

    await waitFor(() => {
      expect(screen.getByText("Temporary Permission Grants")).toBeDefined();
      expect(screen.getByText("No temporary grants for this user.")).toBeDefined();
    });

    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole("button", { name: /Grant temporary access/ })).toBeDefined();
    expect(screen.getByText(/Max 7 days/)).toBeDefined();
  });
});
