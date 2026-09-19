import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  DashboardHeader,
  DashboardLocaleProvider,
  DashboardSection,
} from "../../src/components/ui/dashboard";

describe("DashboardHeader i18n", () => {
  it("renders the English title by default", () => {
    render(<DashboardHeader title="Sub-Chairperson Dashboard" titleAm="የምክትል ሰብሳቢ ዳሽቦርድ" />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Sub-Chairperson Dashboard");
  });

  it("renders the Amharic title when locale is am", () => {
    render(
      <DashboardLocaleProvider locale="am">
        <DashboardHeader title="Sub-Chairperson Dashboard" titleAm="የምክትል ሰብሳቢ ዳሽቦርድ" />
      </DashboardLocaleProvider>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("የምክትል ሰብሳቢ ዳሽቦርድ");
  });

  it("falls back to English when no Amharic variant is provided", () => {
    render(
      <DashboardLocaleProvider locale="am">
        <DashboardHeader title="Chairperson Dashboard" />
      </DashboardLocaleProvider>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Chairperson Dashboard");
  });

  it("renders the Amharic description when locale is am", () => {
    render(
      <DashboardLocaleProvider locale="am">
        <DashboardHeader title="Dashboard" description="Coordinate" descriptionAm="አስተባብር" />
      </DashboardLocaleProvider>
    );
    expect(screen.getByText("አስተባብር")).toBeDefined();
    expect(screen.queryByText("Coordinate")).toBeNull();
  });
});

describe("DashboardSection i18n", () => {
  it("renders the English title by default", () => {
    render(
      <DashboardSection title="Coordination Overview" titleAm="የመሪ ሁኔታ">
        <p>Content</p>
      </DashboardSection>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Coordination Overview");
  });

  it("renders the Amharic title when locale is am", () => {
    render(
      <DashboardLocaleProvider locale="am">
        <DashboardSection title="Coordination Overview" titleAm="የመሪ ሁኔታ">
          <p>Content</p>
        </DashboardSection>
      </DashboardLocaleProvider>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("የመሪ ሁኔታ");
  });

  it("falls back to the English title when no Amharic variant is provided", () => {
    render(
      <DashboardLocaleProvider locale="am">
        <DashboardSection title="Upcoming Activities">
          <p>Content</p>
        </DashboardSection>
      </DashboardLocaleProvider>
    );
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Upcoming Activities");
  });
});
