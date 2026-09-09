import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssignmentWidget } from "../../src/components/ui/dashboard";
import type { AssignmentItem } from "../../src/types/dashboard";

const mockItems: AssignmentItem[] = [
  {
    id: "1",
    title: "Teach Sunday School",
    assignee: "Mary Johnson",
    deadline: "Sep 14, 2026",
    status: "assigned",
    priority: "high",
  },
  {
    id: "2",
    title: "Prepare Mezmur Lyrics",
    assignee: "David Wilson",
    status: "in-progress",
    priority: "medium",
  },
];

describe("AssignmentWidget", () => {
  it("renders title", () => {
    render(<AssignmentWidget items={mockItems} />);
    expect(screen.getByText("Assignments")).toBeDefined();
  });

  it("renders assignment items", () => {
    render(<AssignmentWidget items={mockItems} />);
    expect(screen.getByText("Teach Sunday School")).toBeDefined();
    expect(screen.getByText("Mary Johnson")).toBeDefined();
    expect(screen.getByText("David Wilson")).toBeDefined();
  });

  it("renders deadlines", () => {
    render(<AssignmentWidget items={mockItems} />);
    expect(screen.getByText("Due Sep 14, 2026")).toBeDefined();
  });

  it("renders empty state", () => {
    render(<AssignmentWidget items={[]} />);
    expect(screen.getByText("No assignments")).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<AssignmentWidget items={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
