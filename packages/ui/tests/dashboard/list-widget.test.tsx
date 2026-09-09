import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListWidget } from "../../src/components/ui/dashboard";
import type { ListItemData } from "../../src/types/dashboard";

const mockItems: ListItemData[] = [
  { id: "1", primary: "John Doe", secondary: "Member since 2024" },
  { id: "2", primary: "Jane Smith", secondary: "Active" },
  { id: "3", primary: "Bob Johnson" },
];

describe("ListWidget", () => {
  it("renders title", () => {
    render(<ListWidget title="Members" items={mockItems} />);
    expect(screen.getByText("Members")).toBeDefined();
  });

  it("renders list items", () => {
    render(<ListWidget title="Members" items={mockItems} />);
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();
    expect(screen.getByText("Bob Johnson")).toBeDefined();
  });

  it("renders secondary text", () => {
    render(<ListWidget title="Members" items={mockItems} />);
    expect(screen.getByText("Member since 2024")).toBeDefined();
  });

  it("renders empty state when no items", () => {
    render(<ListWidget title="Members" items={[]} />);
    expect(screen.getByText("No items")).toBeDefined();
  });

  it("renders custom empty state", () => {
    render(
      <ListWidget
        title="Members"
        items={[]}
        emptyTitle="No members"
        emptyDescription="Add your first member."
      />
    );
    expect(screen.getByText("No members")).toBeDefined();
    expect(screen.getByText("Add your first member.")).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<ListWidget title="Members" items={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state", () => {
    render(<ListWidget title="Members" items={[]} state="error" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("renders header action", () => {
    render(
      <ListWidget
        title="Members"
        items={mockItems}
        headerAction={<button type="button">Add</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeDefined();
  });
});
