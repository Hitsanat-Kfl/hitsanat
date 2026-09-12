import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  DashboardWidget,
  WidgetEmpty,
  WidgetError,
  WidgetLoading,
} from "../../src/components/ui/dashboard";

describe("DashboardWidget", () => {
  it("renders children in default state", () => {
    render(
      <DashboardWidget title="Test Widget">
        <p>Widget content</p>
      </DashboardWidget>
    );
    expect(screen.getByText("Test Widget")).toBeDefined();
    expect(screen.getByText("Widget content")).toBeDefined();
  });

  it("renders title and description", () => {
    render(
      <DashboardWidget title="KPI" description="Key performance indicator">
        <p>Value</p>
      </DashboardWidget>
    );
    expect(screen.getByText("KPI")).toBeDefined();
    expect(screen.getByText("Key performance indicator")).toBeDefined();
  });

  it("renders loading state with skeletons", () => {
    const { container } = render(<DashboardWidget title="Widget" state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders empty state", () => {
    render(<DashboardWidget title="Widget" state="empty" />);
    expect(screen.getByText("No data")).toBeDefined();
  });

  it("renders error state", () => {
    render(<DashboardWidget title="Widget" state="error" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("renders disabled state with opacity", () => {
    const { container } = render(
      <DashboardWidget title="Widget" state="disabled">
        <p>Content</p>
      </DashboardWidget>
    );
    expect(container.firstElementChild?.className).toContain("opacity-50");
  });

  it("renders footer", () => {
    render(
      <DashboardWidget title="Widget" footer={<button type="button">Action</button>}>
        <p>Content</p>
      </DashboardWidget>
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeDefined();
  });
});

describe("WidgetLoading", () => {
  it("renders skeleton rows", () => {
    const { container } = render(<WidgetLoading rows={5} />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(5);
  });

  it("defaults to 3 rows", () => {
    const { container } = render(<WidgetLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });
});

describe("WidgetEmpty", () => {
  it("renders default title and description", () => {
    render(<WidgetEmpty />);
    expect(screen.getByText("No data")).toBeDefined();
    expect(screen.getByText("There is nothing to display yet.")).toBeDefined();
  });

  it("renders custom title", () => {
    render(<WidgetEmpty title="No items found" />);
    expect(screen.getByText("No items found")).toBeDefined();
  });

  it("renders action", () => {
    render(<WidgetEmpty action={<button type="button">Add item</button>} />);
    expect(screen.getByRole("button", { name: "Add item" })).toBeDefined();
  });
});

describe("WidgetError", () => {
  it("renders default error message", () => {
    render(<WidgetError />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
    expect(screen.getByText("Failed to load data.")).toBeDefined();
  });

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<WidgetError onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: /try again/i });
    expect(button).toBeDefined();
  });

  it("renders custom message", () => {
    render(<WidgetError message="Network error" />);
    expect(screen.getByText("Network error")).toBeDefined();
  });
});
