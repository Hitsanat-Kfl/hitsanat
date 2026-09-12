import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlanningWidget } from "../../src/components/ui/dashboard";
import type { PlanningData } from "../../src/types/dashboard";

const mockItems: PlanningData[] = [
  {
    id: "1",
    title: "Annual Master Plan 2026",
    period: "2026",
    progress: 45,
    activityCount: 20,
    completedCount: 9,
    responsibleRole: "Chairperson",
    status: "in-progress",
  },
  {
    id: "2",
    title: "Q3 Action Plan",
    period: "Jul-Sep 2026",
    progress: 80,
    activityCount: 10,
    completedCount: 8,
    status: "in-progress",
  },
];

describe("PlanningWidget", () => {
  it("renders title", () => {
    render(<PlanningWidget items={mockItems} />);
    expect(screen.getByText("Planning")).toBeDefined();
  });

  it("renders plan titles", () => {
    render(<PlanningWidget items={mockItems} />);
    expect(screen.getByText("Annual Master Plan 2026")).toBeDefined();
    expect(screen.getByText("Q3 Action Plan")).toBeDefined();
  });

  it("renders periods", () => {
    render(<PlanningWidget items={mockItems} />);
    expect(screen.getByText("2026")).toBeDefined();
    expect(screen.getByText("Jul-Sep 2026")).toBeDefined();
  });

  it("renders responsible roles", () => {
    render(<PlanningWidget items={mockItems} />);
    expect(screen.getByText("Chairperson")).toBeDefined();
  });

  it("renders progress percentages", () => {
    render(<PlanningWidget items={mockItems} />);
    expect(screen.getByText("45%")).toBeDefined();
    expect(screen.getByText("80%")).toBeDefined();
  });

  it("renders activity counts", () => {
    render(<PlanningWidget items={mockItems} />);
    expect(screen.getByText("9/20 activities")).toBeDefined();
    expect(screen.getByText("8/10 activities")).toBeDefined();
  });

  it("renders empty state", () => {
    render(<PlanningWidget items={[]} />);
    expect(screen.getByText("No plans")).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<PlanningWidget items={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
