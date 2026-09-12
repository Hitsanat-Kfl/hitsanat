import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickActionsWidget } from "../../src/components/ui/dashboard";
import type { QuickAction } from "../../src/types/dashboard";

const mockActions: QuickAction[] = [
  { id: "1", label: "Add Member", onClick: vi.fn() },
  { id: "2", label: "View Reports", onClick: vi.fn(), variant: "outline" },
  { id: "3", label: "Delete", onClick: vi.fn(), variant: "destructive", disabled: true },
];

describe("QuickActionsWidget", () => {
  it("renders title", () => {
    render(<QuickActionsWidget actions={mockActions} />);
    expect(screen.getByText("Quick Actions")).toBeDefined();
  });

  it("renders custom title", () => {
    render(<QuickActionsWidget actions={mockActions} title="Actions" />);
    expect(screen.getByText("Actions")).toBeDefined();
  });

  it("renders action buttons", () => {
    render(<QuickActionsWidget actions={mockActions} />);
    expect(screen.getByRole("button", { name: /add member/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /view reports/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /delete/i })).toBeDefined();
  });

  it("calls onClick when button is clicked", () => {
    const onClick = vi.fn();
    const actions: QuickAction[] = [{ id: "1", label: "Click me", onClick }];
    render(<QuickActionsWidget actions={actions} />);
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables disabled actions", () => {
    render(<QuickActionsWidget actions={mockActions} />);
    expect(screen.getByRole("button", { name: /delete/i }).hasAttribute("disabled")).toBe(true);
  });

  it("renders loading state", () => {
    const { container } = render(<QuickActionsWidget actions={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
