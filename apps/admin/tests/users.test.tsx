import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UsersPage from "../features/users/components/users-page";
import { I18nProvider, ShellProvider } from "../features/shell";

// Shared endpoint-keyed fixtures (hoisted for the vi.mock factory).
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
  const getFixture = (endpoint: string): unknown => {
    if (endpoint.startsWith("/users")) return usersPage;
    return { success: true, data: [] };
  };
  return { getFixture };
});

const postMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true, data: {} }));

vi.mock("../lib/api-client", () => ({
  api: {
    get: vi
      .fn()
      .mockImplementation((endpoint: string) => Promise.resolve(fixtures.getFixture(endpoint))),
    post: postMock,
  },
}));

function renderUsersPage() {
  return render(
    <I18nProvider>
      <ShellProvider>
        <UsersPage />
      </ShellProvider>
    </I18nProvider>
  );
}

describe("Users management page", () => {
  beforeEach(() => {
    postMock.mockClear();
  });

  it("renders the page header and action button", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText("User Accounts")).toBeDefined();
      expect(screen.getByRole("button", { name: /Create account/i })).toBeDefined();
    });
  });

  it("renders user rows with roles and status", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText("Super Admin")).toBeDefined();
      expect(screen.getByText("Deactivated Leader")).toBeDefined();
      expect(screen.getByText("SUPER_ADMIN")).toBeDefined();
      expect(screen.getByText("TIMIHRT")).toBeDefined();
    });
  });

  it("renders the search and role filters", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByLabelText("Search users")).toBeDefined();
      expect(screen.getByLabelText("Filter by role")).toBeDefined();
    });
  });

  it("opens the create dialog and shows the BR-007 member-link validation", async () => {
    renderUsersPage();

    fireEvent.click(await screen.findByRole("button", { name: /Create account/i }));
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
    // The dialog's submit button shares its label with the page-header button.
    const submitButton = screen.getAllByRole("button", { name: "Create account" }).pop();
    if (submitButton) fireEvent.click(submitButton);

    expect(await screen.findByText(/Leadership roles require a member link/)).toBeDefined();
    // No API call was made — validation blocked the submit.
    expect(postMock).not.toHaveBeenCalled();
  });

  it("submits account creation with the member link", async () => {
    renderUsersPage();

    fireEvent.click(await screen.findByRole("button", { name: /Create account/i }));
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
    fireEvent.change(screen.getByPlaceholderText("Member UUID"), {
      target: { value: "m1" },
    });
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

  it("renders pagination info", async () => {
    renderUsersPage();

    await waitFor(() => {
      expect(screen.getByText(/2 account\(s\)/)).toBeDefined();
      expect(screen.getByText(/Page 1 of 1/)).toBeDefined();
    });
  });
});
