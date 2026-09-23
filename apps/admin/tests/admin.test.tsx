import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthUserProvider } from "../src/features/authentication";
import { ChairpersonDashboardPage, DashboardRouter } from "../src/widgets/dashboard";
import { I18nProvider, ShellProvider } from "../src/widgets/shell";
import { QueryTestProvider } from "./test-providers";

// Mock the API client
vi.mock("@/infrastructure/api/client", () => ({
  api: {
    get: vi.fn().mockImplementation((endpoint: string) => {
      if (endpoint.startsWith("/users")) {
        return Promise.resolve({
          success: true,
          data: [],
          pagination: { page: 1, limit: 1, total: 124, totalPages: 1 },
        });
      }
      return Promise.resolve({
        success: true,
        data: [],
        pagination: { page: 1, limit: 1, total: 124, totalPages: 1 },
      });
    }),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

const chairpersonUser = {
  id: "u1",
  email: "chair@hitsanat.org",
  name: "Chairperson",
  role: "CHAIRPERSON",
  memberId: null,
  globalRoles: ["CHAIRPERSON"],
  subDeptRoles: [],
};

function TestWrapper({
  children,
  user = chairpersonUser,
}: {
  children: React.ReactNode;
  user?: Parameters<typeof AuthUserProvider>[0]["user"];
}) {
  return (
    <QueryTestProvider>
      <I18nProvider>
        <ShellProvider>
          <AuthUserProvider user={user}>{children}</AuthUserProvider>
        </ShellProvider>
      </I18nProvider>
    </QueryTestProvider>
  );
}

describe("Chairperson Dashboard", () => {
  it("renders the dashboard header", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Chairperson Dashboard").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders breadcrumbs", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Executive Overview")).toBeDefined();
    });
  });

  it("renders executive overview KPIs", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Executive Overview")).toBeDefined();
      expect(screen.getByText("Active Members")).toBeDefined();
      expect(screen.getByText("Enrolled Children")).toBeDefined();
    });
  });

  it("renders attention section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Requires Attention")).toBeDefined();
    });
  });

  it("renders organization health section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Organization Health")).toBeDefined();
    });
  });

  it("renders activity status section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Activity Status")).toBeDefined();
    });
  });

  it("renders upcoming events section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Upcoming Events").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders recent activity section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Recent Activity").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders quick actions section", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("View Master Plan")).toBeDefined();
      expect(screen.getByText("View Reports")).toBeDefined();
      expect(screen.getByText("Manage Events")).toBeDefined();
    });
  });

  it("renders KPI values", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("124").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders navigation links", async () => {
    render(
      <TestWrapper>
        <ChairpersonDashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("View schedule")).toBeDefined();
    });
  });
});

describe("DashboardRouter", () => {
  it("renders the Super Admin dashboard for SUPER_ADMIN", async () => {
    render(
      <TestWrapper
        user={{
          ...chairpersonUser,
          role: "SUPER_ADMIN",
          globalRoles: ["SUPER_ADMIN"],
        }}
      >
        <DashboardRouter />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("System Overview")).toBeDefined();
    });
  });

  it("renders the Chairperson dashboard for CHAIRPERSON", async () => {
    render(
      <TestWrapper>
        <DashboardRouter />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Chairperson Dashboard").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the Secretary dashboard for SECRETARY", async () => {
    render(
      <TestWrapper
        user={{
          ...chairpersonUser,
          role: "SECRETARY",
          globalRoles: ["SECRETARY"],
        }}
      >
        <DashboardRouter />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Secretary Dashboard")).toBeDefined();
    });
  });

  it("renders the Sub-Chairperson dashboard for SUB_CHAIRPERSON", async () => {
    render(
      <TestWrapper
        user={{
          ...chairpersonUser,
          role: "SUB_CHAIRPERSON",
          globalRoles: ["SUB_CHAIRPERSON"],
        }}
      >
        <DashboardRouter />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Sub-Chairperson Dashboard")).toBeDefined();
    });
  });
});
