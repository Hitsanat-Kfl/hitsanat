import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  DashboardContainer,
  DashboardGrid,
  DashboardGridItem,
  DashboardHeader,
  DashboardSection,
} from "../../src/components/ui/dashboard";

describe("DashboardContainer", () => {
  it("renders children", () => {
    render(
      <DashboardContainer>
        <p>Content</p>
      </DashboardContainer>
    );
    expect(screen.getByText("Content")).toBeDefined();
  });

  it("applies max-width by default", () => {
    const { container } = render(
      <DashboardContainer>
        <p>Content</p>
      </DashboardContainer>
    );
    expect(container.firstElementChild?.className).toContain("max-w-7xl");
  });

  it("removes max-width when fullWidth is true", () => {
    const { container } = render(
      <DashboardContainer fullWidth>
        <p>Content</p>
      </DashboardContainer>
    );
    expect(container.firstElementChild?.className).toContain("max-w-full");
  });
});

describe("DashboardHeader", () => {
  it("renders title", () => {
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Dashboard");
  });

  it("renders description", () => {
    render(<DashboardHeader title="Dashboard" description="Overview" />);
    expect(screen.getByText("Overview")).toBeDefined();
  });

  it("renders date", () => {
    render(<DashboardHeader title="Dashboard" date="Sep 9, 2026" />);
    expect(screen.getByText("Sep 9, 2026")).toBeDefined();
  });

  it("renders actions", () => {
    render(<DashboardHeader title="Dashboard" actions={<button type="button">Add</button>} />);
    expect(screen.getByRole("button", { name: "Add" })).toBeDefined();
  });
});

describe("DashboardGrid", () => {
  it("renders children in a grid", () => {
    const { container } = render(
      <DashboardGrid>
        <div>Item 1</div>
        <div>Item 2</div>
      </DashboardGrid>
    );
    expect(container.firstElementChild?.className).toContain("grid");
  });
});

describe("DashboardGridItem", () => {
  it("renders children", () => {
    render(
      <DashboardGrid>
        <DashboardGridItem size="md">
          <p>Widget</p>
        </DashboardGridItem>
      </DashboardGrid>
    );
    expect(screen.getByText("Widget")).toBeDefined();
  });
});

describe("DashboardSection", () => {
  it("renders title", () => {
    render(
      <DashboardSection title="Overview">
        <p>Content</p>
      </DashboardSection>
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Overview");
  });

  it("renders description", () => {
    render(
      <DashboardSection title="Overview" description="Key metrics">
        <p>Content</p>
      </DashboardSection>
    );
    expect(screen.getByText("Key metrics")).toBeDefined();
  });

  it("renders action", () => {
    render(
      <DashboardSection title="Overview" action={<button type="button">View all</button>}>
        <p>Content</p>
      </DashboardSection>
    );
    expect(screen.getByRole("button", { name: "View all" })).toBeDefined();
  });

  it("renders children", () => {
    render(
      <DashboardSection title="Overview">
        <p>Section content</p>
      </DashboardSection>
    );
    expect(screen.getByText("Section content")).toBeDefined();
  });
});
