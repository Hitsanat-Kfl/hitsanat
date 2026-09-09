import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPIWidget, KPIRow } from "../../src/components/ui/dashboard";
import type { KPIData } from "../../src/types/dashboard";

const mockKPI: KPIData = {
  label: "Total Members",
  value: 1247,
  description: "All registered members",
  trend: { value: 12, direction: "up", label: "from last month" },
};

describe("KPIWidget", () => {
  it("renders label and value", () => {
    render(<KPIWidget data={mockKPI} />);
    expect(screen.getByText("Total Members")).toBeDefined();
    expect(screen.getByText("1247")).toBeDefined();
  });

  it("renders description", () => {
    render(<KPIWidget data={mockKPI} />);
    expect(screen.getByText("All registered members")).toBeDefined();
  });

  it("renders trend", () => {
    render(<KPIWidget data={mockKPI} />);
    expect(screen.getByText("12%")).toBeDefined();
  });

  it("renders comparison", () => {
    const dataWithComparison: KPIData = {
      ...mockKPI,
      comparison: { value: "1,112", label: "last month" },
    };
    render(<KPIWidget data={dataWithComparison} />);
    expect(screen.getByText("1,112")).toBeDefined();
    expect(screen.getByText("last month")).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<KPIWidget data={mockKPI} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders empty state", () => {
    render(<KPIWidget data={mockKPI} state="empty" />);
    expect(screen.getByText("No data")).toBeDefined();
  });

  it("renders error state", () => {
    render(<KPIWidget data={mockKPI} state="error" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });
});

describe("KPIRow", () => {
  it("renders multiple KPI cards", () => {
    const items: KPIData[] = [
      { label: "Members", value: 100 },
      { label: "Children", value: 50 },
      { label: "Groups", value: 10 },
    ];
    render(<KPIRow items={items} />);
    expect(screen.getByText("Members")).toBeDefined();
    expect(screen.getByText("Children")).toBeDefined();
    expect(screen.getByText("Groups")).toBeDefined();
  });

  it("renders loading skeletons", () => {
    const items: KPIData[] = [{ label: "Members", value: 100 }];
    const { container } = render(<KPIRow items={items} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
