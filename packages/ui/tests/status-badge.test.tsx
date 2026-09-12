import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge, statusConfig } from "../src/components/ui/status-badge";

describe("StatusBadge", () => {
  it("renders with draft status", () => {
    render(<StatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeDefined();
  });

  it("renders with pending status", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeDefined();
  });

  it("renders with active status", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeDefined();
  });

  it("renders with completed status", () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeDefined();
  });

  it("renders with cancelled status", () => {
    render(<StatusBadge status="cancelled" />);
    expect(screen.getByText("Cancelled")).toBeDefined();
  });

  it("renders with inactive status", () => {
    render(<StatusBadge status="inactive" />);
    expect(screen.getByText("Inactive")).toBeDefined();
  });

  it("renders with present status", () => {
    render(<StatusBadge status="present" />);
    expect(screen.getByText("Present")).toBeDefined();
  });

  it("renders with absent status", () => {
    render(<StatusBadge status="absent" />);
    expect(screen.getByText("Absent")).toBeDefined();
  });

  it("hides icon when showIcon is false", () => {
    const { container } = render(<StatusBadge status="active" showIcon={false} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
  });

  it("shows icon by default", () => {
    const { container } = render(<StatusBadge status="active" />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(1);
  });

  it("renders with dot when showDot is true", () => {
    const { container } = render(<StatusBadge status="active" showDot />);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it("renders different sizes", () => {
    const { rerender } = render(<StatusBadge status="active" size="sm" />);
    expect(screen.getByText("Active").parentElement?.className).toContain("text-[10px]");

    rerender(<StatusBadge status="active" size="lg" />);
    expect(screen.getByText("Active").parentElement?.className).toContain("text-sm");
  });

  it("applies custom className", () => {
    render(<StatusBadge status="active" className="custom-status" />);
    expect(screen.getByText("Active").parentElement?.className).toContain("custom-status");
  });

  it("has correct semantic role", () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByRole("status");
    expect(badge).toBeDefined();
    expect(badge.textContent).toContain("Active");
  });
});

describe("statusConfig", () => {
  it("contains all expected status types", () => {
    const expectedStatuses = [
      "draft",
      "pending",
      "active",
      "inactive",
      "expected",
      "present",
      "absent",
      "excused",
      "assigned",
      "in-progress",
      "completed",
      "delayed",
      "cancelled",
      "published",
      "archived",
    ];
    for (const status of expectedStatuses) {
      expect(statusConfig).toHaveProperty(status);
      expect(statusConfig[status as keyof typeof statusConfig].label).toBeDefined();
      expect(statusConfig[status as keyof typeof statusConfig].color).toBeDefined();
      expect(statusConfig[status as keyof typeof statusConfig].icon).toBeDefined();
    }
  });
});
