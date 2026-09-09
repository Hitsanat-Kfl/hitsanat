import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusSummaryWidget } from "../../src/components/ui/dashboard";
import type { StatusSummaryItem } from "../../src/types/dashboard";

const mockItems: StatusSummaryItem[] = [
  { status: "pending", label: "Pending Label", count: 5 },
  { status: "completed", label: "Completed Label", count: 12 },
  { status: "delayed", label: "Delayed Label", count: 3 },
  { status: "cancelled", label: "Cancelled Label", count: 1 },
];

describe("StatusSummaryWidget", () => {
  it("renders title", () => {
    render(<StatusSummaryWidget items={mockItems} />);
    expect(screen.getByText("Status Summary")).toBeDefined();
  });

  it("renders custom title", () => {
    render(<StatusSummaryWidget items={mockItems} title="Overview" />);
    expect(screen.getByText("Overview")).toBeDefined();
  });

  it("renders status labels and counts", () => {
    render(<StatusSummaryWidget items={mockItems} />);
    expect(screen.getByText("Pending Label")).toBeDefined();
    expect(screen.getByText("Completed Label")).toBeDefined();
    expect(screen.getByText("Delayed Label")).toBeDefined();
    expect(screen.getByText("Cancelled Label")).toBeDefined();
  });

  it("renders percentage bars", () => {
    const { container } = render(<StatusSummaryWidget items={mockItems} />);
    const bars = container.querySelectorAll(".bg-primary\\/60");
    expect(bars.length).toBe(mockItems.length);
  });

  it("renders loading state", () => {
    const { container } = render(<StatusSummaryWidget items={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
