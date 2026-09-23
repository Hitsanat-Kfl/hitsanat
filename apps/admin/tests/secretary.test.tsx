import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../src/infrastructure/api/client";
import { SecretaryDashboardPage } from "../src/widgets/dashboard/components/secretary-dashboard";
import { I18nProvider, ShellProvider } from "../src/widgets/shell";
import { QueryTestProvider, TestProviders } from "./test-providers";

// Shared endpoint-keyed fixtures
const fixtures = vi.hoisted(() => {
  const children = {
    success: true,
    data: [
      {
        id: "c1",
        fullName: "Abebe Bikila",
        christianName: "Haile Gabriel",
        gender: "Male",
        dateOfBirth: "2018-05-12",
        address: "Bole",
        kutrGroup: "Kutr 1",
        collectionLocation: "Apartama",
        photoUrl: null,
        isActive: true,
        createdAt: "2026-01-10T00:00:00Z",
      },
      {
        id: "c2",
        fullName: "Sara Yohannes",
        christianName: "Walatta Petros",
        gender: "Female",
        dateOfBirth: "2019-03-20",
        address: "Kazanchis",
        kutrGroup: "Kutr 2",
        collectionLocation: "Gende Boy",
        photoUrl: null,
        isActive: true,
        createdAt: "2026-01-15T00:00:00Z",
      },
      {
        id: "c3",
        fullName: "Natnael Tefera",
        christianName: "Gibre Eyesus",
        gender: "Male",
        dateOfBirth: "2020-08-10",
        address: "Piazza",
        kutrGroup: null, // Incomplete record
        collectionLocation: null, // Incomplete record
        photoUrl: null,
        isActive: true,
        createdAt: "2026-01-20T00:00:00Z",
      },
    ],
  };

  const members = {
    success: true,
    data: [
      {
        id: "m1",
        fullName: "Samuel Girma",
        christianName: "Gibre Mikael",
        phoneNumber: "+251911223344",
        yearOfStudy: "3rd Year",
        academicDepartment: "Computer Science",
        campus: "Main Campus",
        gender: "Male",
        photoUrl: "https://example.com/photo.jpg",
        telegramUsername: "@samuelg",
        dateJoined: "2024-09-01T00:00:00Z",
        isActive: true,
        createdAt: "2024-09-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "m2",
        fullName: "Hiwot Alemu",
        christianName: "Kidan",
        phoneNumber: "+251922334455",
        yearOfStudy: "2nd Year",
        academicDepartment: "Medicine",
        campus: "Health Campus",
        gender: "Female",
        photoUrl: null, // Stage 1 incomplete
        telegramUsername: null, // Stage 1 incomplete
        dateJoined: "2025-09-01T00:00:00Z",
        isActive: true,
        createdAt: "2026-02-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
      },
      {
        id: "m3",
        fullName: "Dawit Kebede",
        christianName: "Tekle",
        phoneNumber: "+251933445566",
        yearOfStudy: "4th Year",
        academicDepartment: "Civil Engineering",
        campus: "Tech Campus",
        gender: "Male",
        photoUrl: "https://example.com/dawit.jpg",
        telegramUsername: "@dawitk",
        dateJoined: "2023-09-01T00:00:00Z",
        isActive: false, // Inactive member
        createdAt: "2023-09-01T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      },
    ],
    pagination: { page: 1, limit: 100, total: 3, totalPages: 1 },
  };

  const families = {
    success: true,
    data: [
      {
        id: "f1",
        familyName: "Moges",
        fatherMemberId: "m1",
        motherMemberId: "m2",
        academicYear: "2026",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "f2",
        familyName: "Tadesse",
        fatherMemberId: null, // Incomplete linkage
        motherMemberId: "m2",
        academicYear: "2026",
        createdAt: "2026-01-05T00:00:00Z",
      },
    ],
  };

  const events = {
    success: true,
    data: [
      {
        id: "e1",
        title: "Registration Review Session",
        eventDate: "2026-04-10T09:00:00Z",
        venue: "Secretary Office",
        description: "Review pending child and member records",
      },
    ],
    pagination: { page: 1, limit: 5, total: 1, totalPages: 1 },
  };

  const audit = {
    success: true,
    data: [
      {
        id: "a1",
        operatorId: "u1",
        action: "USER_CREATED",
        resourceType: "user",
        resourceId: "u2",
        payloadDiff: "email=secretary@hitsanat.org; role=SECRETARY",
        ipAddress: null,
        timestamp: "2026-03-01T10:00:00Z",
      },
    ],
  };

  const getFixture = (endpoint: string): unknown => {
    if (endpoint.startsWith("/children")) return children;
    if (endpoint.startsWith("/members")) return members;
    if (endpoint.startsWith("/families")) return families;
    if (endpoint.startsWith("/events")) return events;
    if (endpoint.startsWith("/audit-logs")) return audit;
    return { success: true, data: [] };
  };

  return { getFixture, children, members, families, events, audit };
});

vi.mock("../src/infrastructure/api/client", () => ({
  api: {
    get: vi
      .fn()
      .mockImplementation((endpoint: string) => Promise.resolve(fixtures.getFixture(endpoint))),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function renderDashboard() {
  return render(
    <TestProviders>
      <SecretaryDashboardPage />
    </TestProviders>
  );
}

describe("Secretary Dashboard (Phase 06)", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockImplementation((endpoint: string) =>
      Promise.resolve(fixtures.getFixture(endpoint))
    );
  });

  it("renders the dashboard header", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Secretary Dashboard")).toBeDefined();
    });
  });

  it("renders administrative overview KPIs from real data", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Registration Overview")).toBeDefined();
      expect(screen.getByText("Total Children")).toBeDefined();
      expect(screen.getByText("Active Members")).toBeDefined();
      expect(screen.getByText("Registered Families")).toBeDefined();
      expect(screen.getByText("Pending Records")).toBeDefined();
      // Total children count = 3
      expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
      // Active members count = 2
      expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders pending and incomplete records in the attention section", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Requires Attention")).toBeDefined();
      expect(screen.getByText("Pending & Incomplete Records")).toBeDefined();
      // Stage 1 incomplete member
      expect(screen.getByText(/Hiwot Alemu/)).toBeDefined();
      // Inactive member
      expect(screen.getByText(/Dawit Kebede/)).toBeDefined();
      // Incomplete family
      expect(screen.getByText(/Tadesse Family/)).toBeDefined();
      // Incomplete child
      expect(screen.getByText(/Natnael Tefera/)).toBeDefined();
    });
  });

  it("renders empty state when there are no pending records", async () => {
    vi.mocked(api.get).mockImplementation((endpoint: string) => {
      if (endpoint.startsWith("/children")) {
        return Promise.resolve({
          success: true,
          data: [
            {
              id: "c1",
              fullName: "Abebe Bikila",
              christianName: "Haile Gabriel",
              gender: "Male",
              dateOfBirth: "2018-05-12",
              address: "Bole",
              kutrGroup: "Kutr 1",
              collectionLocation: "Apartama",
              photoUrl: null,
              isActive: true,
              createdAt: "2026-01-10T00:00:00Z",
            },
          ],
        });
      }
      if (endpoint.startsWith("/members")) {
        return Promise.resolve({
          success: true,
          data: [
            {
              id: "m1",
              fullName: "Samuel Girma",
              christianName: "Gibre Mikael",
              phoneNumber: "+251911223344",
              yearOfStudy: "3rd Year",
              academicDepartment: "Computer Science",
              campus: "Main Campus",
              gender: "Male",
              photoUrl: "https://example.com/photo.jpg",
              telegramUsername: "@samuelg",
              dateJoined: "2024-09-01T00:00:00Z",
              isActive: true,
              createdAt: "2024-09-01T00:00:00Z",
              updatedAt: "2026-01-01T00:00:00Z",
            },
          ],
          pagination: { page: 1, limit: 100, total: 1, totalPages: 1 },
        });
      }
      if (endpoint.startsWith("/families")) {
        return Promise.resolve({
          success: true,
          data: [
            {
              id: "f1",
              familyName: "Moges",
              fatherMemberId: "m1",
              motherMemberId: "m2",
              academicYear: "2026",
              createdAt: "2026-01-01T00:00:00Z",
            },
          ],
        });
      }
      return Promise.resolve(fixtures.getFixture(endpoint));
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("No pending records")).toBeDefined();
      expect(
        screen.getByText("Administrative records requiring your attention will appear here.")
      ).toBeDefined();
    });
  });

  it("renders records overview status summaries", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Records Overview")).toBeDefined();
      expect(screen.getByText(/Member Records/)).toBeDefined();
      expect(screen.getByText(/Children Records/)).toBeDefined();
      expect(screen.getByText("Complete active profiles")).toBeDefined();
      expect(screen.getByText("Complete child records")).toBeDefined();
    });
  });

  it("renders upcoming activities from real events", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Registration Review Session")).toBeDefined();
    });
  });

  it("renders recent activity from the audit trail", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Recent Activity").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/created user account/)).toBeDefined();
    });
  });

  it("renders quick actions", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText("Quick Actions").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: "Register Child" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Register Member" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Children" })).toBeDefined();
      expect(screen.getByRole("button", { name: "View Members" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Attendance" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Events" })).toBeDefined();
    });
  });

  it("shows error state when administrative data fails to load", async () => {
    vi.mocked(api.get).mockImplementation((endpoint: string) => {
      if (endpoint.startsWith("/children") || endpoint.startsWith("/members")) {
        return Promise.reject(new Error("Database connection failed"));
      }
      return Promise.resolve(fixtures.getFixture(endpoint));
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Database connection failed/)).toBeDefined();
      expect(screen.getByText("Retry")).toBeDefined();
    });
  });

  it("renders the skeleton loading state before data arrives", async () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Secretary Dashboard")).toBeDefined();
    });
    expect(document.querySelector("[aria-busy='true']")).not.toBeNull();
  });

  it("renders Amharic titles and labels when locale is am", async () => {
    const { DashboardLocaleProvider } = await import("@repo/ui");
    function AmharicWrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryTestProvider>
          <I18nProvider initialLocale="am">
            <DashboardLocaleProvider locale="am">
              <ShellProvider>{children}</ShellProvider>
            </DashboardLocaleProvider>
          </I18nProvider>
        </QueryTestProvider>
      );
    }

    render(
      <AmharicWrapper>
        <SecretaryDashboardPage />
      </AmharicWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("የጸሐፊ ዳሽቦርድ")).toBeDefined();
      expect(screen.getByText("አጠቃላይ የምዝገባ ዕይታ")).toBeDefined();
      expect(screen.getByText("የሚጠይቅ ትኩረት")).toBeDefined();
      expect(screen.getByText("የመዝገቦች አጠቃላይ ዕይታ")).toBeDefined();
    });
  });

  it("renders English titles when locale is en", async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Secretary Dashboard")).toBeDefined();
      expect(screen.getByText("Registration Overview")).toBeDefined();
    });
    expect(screen.queryByText("የጸሐፊ ዳሽቦርድ")).toBeNull();
  });
});
