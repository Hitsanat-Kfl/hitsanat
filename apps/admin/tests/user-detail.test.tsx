import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthUserProvider, type SessionUser } from "../src/features/authentication";
import UserDetailPage from "../src/features/user-management/components/user-detail";
import { renderWithProviders } from "./test-providers";

/** Route param under test — reassigned per case (useParams is mocked below). */
let currentId = "u1";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ id: currentId }),
}));

// Endpoint-keyed fixtures (hoisted so the vi.mock factory can read them).
const fixtures = vi.hoisted(() => {
  const active = {
    success: true,
    data: {
      id: "u1",
      name: "Abebe Bekele",
      email: "abebe@email.com",
      role: "CHAIRPERSON",
      memberId: "m1",
      emailVerified: true,
      status: "ACTIVE",
      deactivatedAt: null,
      image: null,
      subDepartments: [
        { subDepartmentId: "sd1", code: "TIMIHRT", nameEn: "Timihrt", role: "Member" },
      ],
      createdAt: "2026-09-12T10:24:00.000Z",
      updatedAt: "2026-09-22T16:17:00.000Z",
    },
  };

  const deactivated = {
    success: true,
    data: {
      ...active.data,
      id: "u2",
      name: "Meseret Tadesse",
      email: "meseret@email.com",
      memberId: null,
      emailVerified: false,
      status: "DEACTIVATED",
      deactivatedAt: "2026-09-20T08:00:00.000Z",
    },
  };

  const member = {
    success: true,
    data: {
      id: "m1",
      fullName: "Abebe Bekele",
      christianName: "Abreham",
      phoneNumber: "+251911000001",
      yearOfStudy: "3rd Year",
      academicDepartment: "Software Engineering",
      campus: "Main Campus",
      gender: "Male",
      photoUrl: null,
      telegramUsername: null,
      dateJoined: "2023-10-01T00:00:00.000Z",
      isActive: true,
      createdAt: "2023-10-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  };

  const activity = {
    success: true,
    data: [
      {
        id: "log-1",
        operatorId: "u1",
        action: "USER_UPDATED",
        resourceType: "user",
        resourceId: "u1",
        payloadDiff: "role: SECRETARY → CHAIRPERSON",
        ipAddress: "10.0.0.5",
        timestamp: "2026-09-23T10:42:00.000Z",
      },
      {
        id: "log-2",
        operatorId: "u1",
        action: "PASSWORD_RESET",
        resourceType: "user",
        resourceId: "u1",
        payloadDiff: null,
        ipAddress: null,
        timestamp: "2026-09-22T08:15:00.000Z",
      },
    ],
  };

  interface Fixture {
    ok: boolean;
    body: unknown;
  }

  const getFixture = (endpoint: string): Fixture => {
    if (endpoint.startsWith("/audit-logs")) return { ok: true, body: activity };
    if (endpoint === "/users/u1") return { ok: true, body: active };
    if (endpoint === "/users/u2") return { ok: true, body: deactivated };
    if (endpoint === "/members/m1") return { ok: true, body: member };
    // Failures must reject — that is what the real HTTP client does.
    if (endpoint === "/users/u404") {
      return {
        ok: false,
        body: { status: 404, error: { code: "NOT_FOUND", message: "User not found: u404" } },
      };
    }
    if (endpoint === "/users/u500") {
      return {
        ok: false,
        body: { error: { code: "INTERNAL", message: "The request failed. Please try again." } },
      };
    }
    return { ok: true, body: { success: true, data: [] } };
  };

  return { getFixture };
});

const postMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true, data: {} }));
const patchMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true, data: {} }));

vi.mock("@/infrastructure/api/client", () => ({
  api: {
    get: vi.fn().mockImplementation((endpoint: string) => {
      const { ok, body } = fixtures.getFixture(endpoint);
      return ok ? Promise.resolve(body) : Promise.reject(body);
    }),
    post: postMock,
    patch: patchMock,
  },
}));

function sessionUser(globalRoles: string[]): SessionUser {
  return {
    id: "actor-1",
    email: "actor@hitsanat.org",
    name: "Actor",
    role: globalRoles[0] ?? "MEMBER_REGULAR",
    globalRoles,
    subDeptRoles: [],
  };
}

function renderDetail({
  id = "u1",
  roles = ["CHAIRPERSON"],
}: { id?: string; roles?: string[] } = {}) {
  currentId = id;
  return renderWithProviders(
    <AuthUserProvider user={sessionUser(roles)}>
      <UserDetailPage />
    </AuthUserProvider>
  );
}

describe("User Details page", () => {
  it("renders the breadcrumb trail and back navigation", async () => {
    renderDetail();
    const nav = await screen.findByRole("navigation", { name: /breadcrumb/i });
    expect(within(nav).getByText("Administration")).toBeDefined();
    expect(within(nav).getByText("User Accounts")).toBeDefined();
    expect(within(nav).getByText("User Details")).toBeDefined();

    const backLinks = screen.getAllByRole("link", { name: /Back to User Accounts/i });
    expect(backLinks.length).toBeGreaterThan(0);
    expect(backLinks.every((link) => link.getAttribute("href") === "/users")).toBe(true);
  });

  it("renders the page heading and description", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { level: 1, name: "User Details" })).toBeDefined();
    expect(
      screen.getByText(
        "View and manage user information, account status and administrative actions."
      )
    ).toBeDefined();
  });

  it("shows a clean not-found state for an unknown user", async () => {
    renderDetail({ id: "u404" });
    expect(await screen.findByText("User Not Found")).toBeDefined();
    expect(screen.getByText("The requested account could not be found.")).toBeDefined();
    expect(screen.getAllByRole("link", { name: /Back to User Accounts/i }).length).toBeGreaterThan(
      0
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows the error banner when the request fails", async () => {
    renderDetail({ id: "u500" });
    const banner = await screen.findByRole("alert");
    expect(banner.textContent).toContain("The request failed");
    expect(screen.getByRole("heading", { name: "Unable to load user" })).toBeDefined();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeDefined();
    expect(screen.getAllByRole("link", { name: /Back to User Accounts/i }).length).toBeGreaterThan(
      0
    );
  });

  it("renders the user identity hierarchy", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { level: 2, name: "Abebe Bekele" })).toBeDefined();
    expect(screen.getAllByText("Chairperson").length).toBeGreaterThan(0);
    expect(screen.getAllByText("abebe@email.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Edit User" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "More actions" }).length).toBeGreaterThan(0);
  });

  it("renders the quick info panel from real account fields", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Quick Info" })).toBeDefined();
    expect(screen.getAllByText("Account Type").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Member").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sub-department").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TIMIHRT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("m1").length).toBeGreaterThan(0);
  });

  it("renders the overview tabs with their panels", async () => {
    renderDetail();
    expect(await screen.findByRole("tablist")).toBeDefined();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Member Information" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Roles & Permissions" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Activity" })).toBeDefined();

    expect(await screen.findByRole("heading", { name: "Member Information" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Linked Member" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Permissions" })).toBeDefined();

    expect(screen.getByText("Verified")).toBeDefined();
    expect(screen.getByText("Email Verification")).toBeDefined();
    expect(screen.getByText("Created At")).toBeDefined();
    expect(screen.getByText("Last Updated")).toBeDefined();
  });

  it("lists every administrative action with its description", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Administrative Actions" })).toBeDefined();
    expect(screen.getByText("Update account information and settings")).toBeDefined();
    expect(screen.getByText("Generate a new temporary password")).toBeDefined();
    expect(screen.getByText("Transfer account responsibility")).toBeDefined();
    expect(screen.getByText("Sign out all active sessions")).toBeDefined();
    expect(screen.getByText("Disable account access")).toBeDefined();
  });

  it("switches to the roles and permissions tab", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Member Information" })).toBeDefined();

    fireEvent.click(screen.getByRole("tab", { name: "Roles & Permissions" }));

    expect(await screen.findByRole("heading", { name: "Assigned Role" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Inherited Permissions" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Sub-Department Assignments" })).toBeDefined();
    expect(screen.getAllByText("Members").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TIMIHRT").length).toBeGreaterThan(0);
  });

  it("shows the account's own audit trail on the activity tab", async () => {
    renderDetail();

    fireEvent.click(await screen.findByRole("tab", { name: "Activity" }));

    expect(await screen.findByRole("heading", { name: "Recent Activity" })).toBeDefined();
    expect((await screen.findAllByText("Updated user account")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reset password").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "View All" }).getAttribute("href")).toBe("/audit-logs");
  });

  it("renders the linked member summary from the canonical Members feature", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Linked Member" })).toBeDefined();
    expect(screen.getAllByText("Abebe Bekele").length).toBeGreaterThan(1);
    expect(await screen.findByText("Software Engineering")).toBeDefined();
    expect(screen.getByRole("link", { name: "View Member" }).getAttribute("href")).toBe(
      "/members/m1"
    );
  });

  it("shows Reactivate instead of Deactivate for a deactivated account", async () => {
    renderDetail({ id: "u2" });
    expect(await screen.findByRole("heading", { name: "Administrative Actions" })).toBeDefined();
    expect(screen.getAllByText("Deactivated").length).toBeGreaterThan(0);
    expect(screen.queryByText("Active")).toBeNull();
    expect(screen.getAllByText("Reactivate").length).toBeGreaterThan(0);
    expect(screen.queryByText("Deactivate")).toBeNull();
    expect(screen.queryByText("Verified")).toBeNull();
    expect(screen.getByText("Not verified")).toBeDefined();
  });

  it("offers the member empty state for an unlinked account", async () => {
    renderDetail({ id: "u2" });
    expect(await screen.findByText("No member linked")).toBeDefined();
    expect(
      screen.getByText("This account is not currently linked to a member record.")
    ).toBeDefined();
    expect(screen.getAllByText("Unlinked account").length).toBeGreaterThan(0);
  });

  it("hides management actions for a viewer without account scope", async () => {
    renderDetail({ roles: ["SECRETARY"] });
    expect(await screen.findByRole("heading", { name: "Member Information" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Edit User" })).toBeNull();
    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Administrative Actions" })).toBeNull();
    // The dossier itself stays readable.
    expect(screen.getAllByText("abebe@email.com").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Quick Info" })).toBeDefined();
  });

  it("keeps the dossier readable while the member record is still loading", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Quick Info" })).toBeDefined();
    await waitFor(() => {
      expect(screen.getAllByText("Abebe Bekele").length).toBeGreaterThan(1);
    });
  });

  it("closes the overview with the account's recent activity", async () => {
    renderDetail();

    expect(await screen.findByRole("heading", { name: "Recent Activity" })).toBeDefined();
    expect(screen.getByText("Latest actions performed by this user.")).toBeDefined();
    expect((await screen.findAllByText("Updated user account")).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "View All" }).getAttribute("href")).toBe("/audit-logs");
  });

  it("asks for confirmation before revoking live sessions", async () => {
    postMock.mockClear();
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Administrative Actions" })).toBeDefined();

    fireEvent.click(screen.getAllByRole("button", { name: /Revoke Sessions/i })[0]);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/invalidated immediately/i)).toBeDefined();
    expect(postMock).not.toHaveBeenCalled();

    fireEvent.click(within(dialog).getByRole("button", { name: "Revoke Sessions" }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/users/u1/revoke-sessions", {});
    });
  });
});
