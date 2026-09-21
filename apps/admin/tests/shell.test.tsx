import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  AppHeader,
  AppShell,
  AppSidebar,
  AuthenticatedLayout,
  I18nProvider,
  MobileNav,
  ShellProvider,
  UserMenu,
  findActiveNavItem,
  getNavigationForRoles,
  getPrimaryNavItems,
  mapSessionRolesToNavRoles,
  navigationConfig,
} from "../features/shell";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/members",
}));

function ShellTestWrapper({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: "en" | "am";
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <ShellProvider>{children}</ShellProvider>
    </I18nProvider>
  );
}

describe("AppSidebar", () => {
  it("renders the Hitsanat Kifl branding and ministry subtitle", () => {
    render(
      <ShellTestWrapper>
        <AppSidebar roles={["super-admin"]} />
      </ShellTestWrapper>
    );

    expect(screen.getByText("Hitsanat Kifl")).toBeDefined();
    expect(screen.getByText("Children's Ministry")).toBeDefined();
  });

  it("renders role-appropriate navigation items", () => {
    render(
      <ShellTestWrapper>
        <AppSidebar roles={["super-admin"]} />
      </ShellTestWrapper>
    );

    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Members")).toBeDefined();
    expect(screen.getByText("User Accounts")).toBeDefined();
    expect(screen.getByText("Audit Logs")).toBeDefined();
    expect(screen.getByText("Permissions")).toBeDefined();
  });

  it("highlights the active navigation item", () => {
    render(
      <ShellTestWrapper>
        <AppSidebar roles={["super-admin"]} />
      </ShellTestWrapper>
    );

    const membersLink = screen.getByRole("link", { name: /members/i });
    expect(membersLink.getAttribute("aria-current")).toBe("page");
  });

  it("toggles sidebar collapsed state", () => {
    render(
      <ShellTestWrapper>
        <AppSidebar roles={["super-admin"]} />
      </ShellTestWrapper>
    );

    const collapseButton = screen.getByRole("button", { name: /collapse sidebar/i });
    fireEvent.click(collapseButton);

    expect(screen.getByRole("button", { name: /expand sidebar/i })).toBeDefined();
  });

  it("displays the ministry motto in footer", () => {
    render(
      <ShellTestWrapper>
        <AppSidebar roles={["super-admin"]} />
      </ShellTestWrapper>
    );

    expect(screen.getByText("Serving Children · Building Faith")).toBeDefined();
  });
});

describe("AppHeader", () => {
  it("renders breadcrumbs based on active route", () => {
    render(
      <ShellTestWrapper>
        <AppHeader userName="Abel Tester" userRole="Super Admin" />
      </ShellTestWrapper>
    );

    expect(screen.getByText("Ministry")).toBeDefined();
    expect(screen.getByText("Members")).toBeDefined();
  });

  it("toggles language between English and Amharic", () => {
    render(
      <ShellTestWrapper>
        <AppHeader userName="Abel Tester" userRole="Super Admin" />
      </ShellTestWrapper>
    );

    const langToggle = screen.getByRole("button", { name: /switch to amharic/i });
    expect(langToggle).toBeDefined();
    fireEvent.click(langToggle);

    expect(screen.getByRole("button", { name: /switch to english/i })).toBeDefined();
  });

  it("renders notification trigger", () => {
    render(
      <ShellTestWrapper>
        <AppHeader userName="Abel Tester" userRole="Super Admin" />
      </ShellTestWrapper>
    );

    expect(screen.getByRole("button", { name: /notifications/i })).toBeDefined();
  });
});

describe("UserMenu", () => {
  it("renders user name, role, and avatar", () => {
    render(
      <ShellTestWrapper>
        {/* biome-ignore lint/a11y/useValidAriaRole: UserMenu prop role represents domain role title */}
        <UserMenu name="Abel Leader" email="abel@hitsanat.org" role="Chairperson" />
      </ShellTestWrapper>
    );

    expect(screen.getByText("Abel Leader")).toBeDefined();
    expect(screen.getByText("Chairperson")).toBeDefined();
  });

  it("opens user menu popover with action options", async () => {
    render(
      <ShellTestWrapper>
        {/* biome-ignore lint/a11y/useValidAriaRole: UserMenu prop role represents domain role title */}
        <UserMenu name="Abel Leader" email="abel@hitsanat.org" role="Chairperson" />
      </ShellTestWrapper>
    );

    const trigger = screen.getByRole("button", { name: /user menu for abel leader/i });
    fireEvent.click(trigger);

    expect(screen.getByText("Profile")).toBeDefined();
    expect(screen.getByText("Settings")).toBeDefined();
    expect(screen.getByText("Sign out")).toBeDefined();
  });
});

describe("MobileNav", () => {
  it("renders bottom navigation with primary items", () => {
    render(
      <ShellTestWrapper>
        <MobileNav roles={["chairperson"]} />
      </ShellTestWrapper>
    );

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeDefined();
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /menu/i })).toBeDefined();
  });
});

describe("AuthenticatedLayout / AppShell", () => {
  it("renders complete application frame with content", () => {
    render(
      <AuthenticatedLayout roles={["super-admin"]} userName="Admin User" userRole="Super Admin">
        <div data-testid="page-content">Operational Dashboard Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId("page-content")).toBeDefined();
    expect(screen.getByText("Hitsanat Kifl")).toBeDefined();
  });
});

describe("Role-aware Navigation Configuration", () => {
  it("filters items correctly for SUPER_ADMIN", () => {
    const sections = getNavigationForRoles(["super-admin"]);
    const allItemIds = sections.flatMap((s) => s.items.map((i) => i.id));

    expect(allItemIds).toContain("dashboard");
    expect(allItemIds).toContain("members");
    expect(allItemIds).toContain("users");
    expect(allItemIds).toContain("permissions");
    expect(allItemIds).toContain("audit-logs");
  });

  it("filters items correctly for MEZMUR_LEADER", () => {
    const sections = getNavigationForRoles(["mezmur-leader"]);
    const allItemIds = sections.flatMap((s) => s.items.map((i) => i.id));

    expect(allItemIds).toContain("dashboard");
    expect(allItemIds).not.toContain("users");
    expect(allItemIds).not.toContain("permissions");
    expect(allItemIds).not.toContain("audit-logs");
  });

  it("maps session roles to nav roles correctly", () => {
    const navRoles = mapSessionRolesToNavRoles([
      "SUPER_ADMIN",
      "CHAIRPERSON",
      "SECRETARY",
      "MEMBER_REGULAR",
    ]);

    expect(navRoles).toEqual(["super-admin", "chairperson", "secretary", "member-regular"]);
  });

  it("finds active nav item with longest match", () => {
    const active = findActiveNavItem("/audit-logs");
    expect(active?.id).toBe("audit-logs");

    const homeActive = findActiveNavItem("/");
    expect(homeActive?.id).toBe("dashboard");
  });
});
