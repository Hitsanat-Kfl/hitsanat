import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityWidget } from "../../src/components/ui/dashboard";
import type { ActivityItem } from "../../src/types/dashboard";

const mockItems: ActivityItem[] = [
  {
    id: "1",
    actor: "John Doe",
    action: "registered a new member",
    entity: "Jane Smith",
    timestamp: "2 hours ago",
    status: "success",
  },
  {
    id: "2",
    actor: "System",
    action: "generated weekly report",
    timestamp: "5 hours ago",
    status: "info",
  },
  {
    id: "3",
    actor: "Admin",
    action: "updated schedule for",
    entity: "Sunday Service",
    timestamp: "1 day ago",
  },
];

describe("ActivityWidget", () => {
  it("renders title", () => {
    render(<ActivityWidget items={mockItems} />);
    expect(screen.getByText("Recent Activity")).toBeDefined();
  });

  it("renders custom title", () => {
    render(<ActivityWidget items={mockItems} title="Activity Log" />);
    expect(screen.getByText("Activity Log")).toBeDefined();
  });

  it("renders activity items", () => {
    render(<ActivityWidget items={mockItems} />);
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("registered a new member")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();
  });

  it("renders timestamps", () => {
    render(<ActivityWidget items={mockItems} />);
    expect(screen.getByText("2 hours ago")).toBeDefined();
    expect(screen.getByText("5 hours ago")).toBeDefined();
  });

  it("limits items to maxItems", () => {
    render(<ActivityWidget items={mockItems} maxItems={2} />);
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("System")).toBeDefined();
    expect(screen.queryByText("Admin")).toBeNull();
  });

  it("renders empty state", () => {
    render(<ActivityWidget items={[]} />);
    expect(screen.getByText("No activity")).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<ActivityWidget items={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
