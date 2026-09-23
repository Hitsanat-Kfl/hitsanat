import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UsersPage from "../src/features/user-management/components/users-page";
import { renderWithProviders } from "./test-providers";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), prefetch: vi.fn() }),
}));

// Shared endpoint-keyed fixtures (hoisted for the vi.mock factory).
const fixtures = vi.hoisted(() => {
  const usersPage = {
    success: true,
    data: [
      {
        id: "u1",
        name: "Super Admin",
        email: "superadmin@hitsanat.org",
        role: "CHAIRPERSON",
        memberId: "m1",
        emailVerified: true,
        status: "ACTIVE",
        deactivatedAt: null,
        image: null,
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
        image: null,
        subDepartments: [
          { subDepartmentId: "sd1", code: "TIMIHRT", nameEn: "Timihrt", role: "Member" },
        ],
        createdAt: "2026-02-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
  };

  const membersList = {
    success: true,
    data: [
      {
        id: "m1",
        fullName: "Linked Member One",
        phone: "+251911000000",
      },
    ],
  };

  const memberDetail = {
    success: true,
    data: { id: "m1", fullName: "Linked Member One", phone: "+251911000000" },
  };

  const getFixture = (endpoint: string): unknown => {
    if (endpoint.startsWith("/users")) return usersPage;
    if (endpoint.startsWith("/members?")) return membersList;
    if (endpoint.startsWith("/members/")) return memberDetail;
    return { success: true, data: [] };
  };
  return { getFixture };
});

const postMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true, data: {} }));
const patchMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true, data: {} }));

vi.mock("@/infrastructure/api/client", () => ({
  api: {
    get: vi
      .fn()
      .mockImplementation((endpoint: string) => Promise.resolve(fixtures.getFixture(endpoint))),
    post: postMock,
    patch: patchMock,
  },
}));

function renderUsersPage() {
  return renderWithProviders(<UsersPage />);
}

/** Types a search term into a MemberPicker and picks the first result. */
async function pickMember(searchTerm: string) {
  fireEvent.change(screen.getByLabelText("Search members"), {
    target: { value: searchTerm },
  });
  const result = await screen.findByRole("button", { name: /Linked Member One/ });
  fireEvent.click(result);
}

/** Opens the ⋮ action menu for a given user and returns the dropdown container. */
function openRowMenu(userName: string) {
  const menuButtons = screen.getAllByRole("button", { name: `Actions for ${userName}` });
  fireEvent.click(menuButtons[0]);
  // The dropdown is the next sibling element with a border and shadow.
  const menuContainer = menuButtons[0]
    .closest("div")
    ?.querySelector('[class*="absolute"][class*="z-50"]');
  return menuContainer as HTMLElement;
}

describe("Users management page", () => {
  beforeEach(() => {
    postMock.mockClear();
    patchMock.mockClear();
    mockPush.mockClear();
  });

  it("renders the page header and action button", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText("User Accounts")).toBeDefined();
      expect(screen.getByRole("button", { name: /Create User/i })).toBeDefined();
    });
  });

  it("renders user rows with roles and status", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Deactivated Leader").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("CHAIRPERSON").length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText("TIMIHRT").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the search and role filters", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getAllByLabelText("Search users").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByLabelText("Filter by role").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows Reactivate for deactivated rows and reactivates via the API", async () => {
    renderUsersPage();

    // Wait for data to load, then open the action menu for the deactivated user.
    await waitFor(() =>
      expect(screen.getAllByText("Deactivated Leader").length).toBeGreaterThanOrEqual(1)
    );
    const menu = openRowMenu("Deactivated Leader");

    const reactivate = within(menu).getByRole("button", { name: /Reactivate User/i });
    fireEvent.click(reactivate);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/users/u2/reactivate", {});
    });
  });

  it("force-signs-out a user's live sessions", async () => {
    renderUsersPage();

    await waitFor(() =>
      expect(screen.getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1)
    );
    const menu = openRowMenu("Super Admin");

    const revokeButton = within(menu).getByRole("button", { name: /Revoke Sessions/i });
    fireEvent.click(revokeButton);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/users/u1/revoke-sessions", {});
    });
  });

  it("opens the create dialog and shows the BR-007 member-link validation", async () => {
    renderUsersPage();

    fireEvent.click(await screen.findByRole("button", { name: /Create User/i }));
    await screen.findByText("Create user account");

    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "New Leader" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@hitsanat.org"), {
      target: { value: "leader@hitsanat.org" },
    });
    fireEvent.change(screen.getByPlaceholderText("Temporary password"), {
      target: { value: "TempPass123!" },
    });
    fireEvent.change(screen.getByDisplayValue("Select role"), {
      target: { value: "SECRETARY" },
    });
    const submitButton = screen.getAllByRole("button", { name: "Create account" }).pop();
    if (submitButton) fireEvent.click(submitButton);

    expect(await screen.findByText(/Leadership roles require a member link/)).toBeDefined();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("links a member through the searchable picker and creates the account", async () => {
    renderUsersPage();

    fireEvent.click(await screen.findByRole("button", { name: /Create User/i }));
    await screen.findByText("Create user account");

    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "New Leader" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@hitsanat.org"), {
      target: { value: "leader@hitsanat.org" },
    });
    fireEvent.change(screen.getByPlaceholderText("Temporary password"), {
      target: { value: "TempPass123!" },
    });
    fireEvent.change(screen.getByDisplayValue("Select role"), {
      target: { value: "SECRETARY" },
    });
    await pickMember("Linked");

    const submitButton = screen.getAllByRole("button", { name: "Create account" }).pop();
    if (submitButton) fireEvent.click(submitButton);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledOnce();
      expect(postMock).toHaveBeenCalledWith("/users", {
        name: "New Leader",
        email: "leader@hitsanat.org",
        password: "TempPass123!",
        role: "SECRETARY",
        memberId: "m1",
      });
    });
  });

  it("edits an account and submits the PATCH with the resolved member name", async () => {
    renderUsersPage();

    await waitFor(() =>
      expect(screen.getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1)
    );
    const menu = openRowMenu("Super Admin");

    fireEvent.click(within(menu).getByRole("button", { name: /Edit User/i }));
    await screen.findByText("Edit user account");

    expect(await screen.findByText(/Linked Member One/)).toBeDefined();

    fireEvent.change(screen.getByPlaceholderText("Full name"), {
      target: { value: "Renamed Admin" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith("/users/u1", {
        name: "Renamed Admin",
        email: "superadmin@hitsanat.org",
        role: "CHAIRPERSON",
        memberId: "m1",
        subDepartmentIds: [],
      });
    });
  });

  it("runs the guided three-step handover: successor, demote, deactivate", async () => {
    renderUsersPage();

    await waitFor(() =>
      expect(screen.getAllByText("Super Admin").length).toBeGreaterThanOrEqual(1)
    );
    const menu = openRowMenu("Super Admin");

    fireEvent.click(within(menu).getByRole("button", { name: /Handover/i }));
    await screen.findByText(/Leadership handover — CHAIRPERSON/);

    // Step 1: create successor
    fireEvent.change(screen.getByLabelText("Successor full name"), {
      target: { value: "Next Chair" },
    });
    fireEvent.change(screen.getByLabelText("Successor email"), {
      target: { value: "next.chair@hitsanat.org" },
    });
    fireEvent.change(screen.getByLabelText("Temporary password"), {
      target: { value: "TempPass123!" },
    });
    await pickMember("Linked");
    fireEvent.click(screen.getByRole("button", { name: "Create successor account" }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/users", {
        name: "Next Chair",
        email: "next.chair@hitsanat.org",
        password: "TempPass123!",
        role: "CHAIRPERSON",
        memberId: "m1",
      });
    });

    // Step 2: demote outgoing leader
    fireEvent.click(await screen.findByRole("button", { name: "Demote outgoing leader" }));
    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith("/users/u1", { role: "MEMBER_REGULAR" });
    });

    // Step 3: deactivate
    fireEvent.click(await screen.findByRole("button", { name: "Deactivate outgoing leader" }));
    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/users/u1/deactivate", {});
    });
    expect(await screen.findByText(/Handover complete/)).toBeDefined();
  });

  it("renders pagination info", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getAllByText(/2 account\(s\)/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Page 1 of 1/).length).toBeGreaterThanOrEqual(1);
    });
  });
});
