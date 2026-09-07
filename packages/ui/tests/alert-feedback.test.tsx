import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "../src/components/ui/alert";
import { EmptyState } from "../src/components/ui/empty-state";
import { ErrorState } from "../src/components/ui/error-state";

describe("Alert", () => {
  it("renders with default variant", () => {
    render(<Alert>Alert content</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain("Alert content");
  });

  it("renders with success variant", () => {
    render(<Alert variant="success">Success message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-emerald-50");
  });

  it("renders with warning variant", () => {
    render(<Alert variant="warning">Warning message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-amber-50");
  });

  it("renders with error variant", () => {
    render(<Alert variant="error">Error message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-red-50");
  });

  it("renders with info variant", () => {
    render(<Alert variant="info">Info message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-blue-50");
  });

  it("renders title", () => {
    render(<Alert title="Alert Title">Content</Alert>);
    expect(screen.getByText("Alert Title")).toBeDefined();
  });

  it("renders dismissible button", () => {
    render(
      <Alert dismissible onDismiss={() => {}}>
        Content
      </Alert>
    );
    expect(screen.getByLabelText("Dismiss")).toBeDefined();
  });

  it("calls onDismiss when dismiss button clicked", () => {
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Content
      </Alert>
    );
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No data found" />);
    expect(screen.getByText("No data found")).toBeDefined();
  });

  it("renders description", () => {
    render(<EmptyState title="No data" description="There is no data to display" />);
    expect(screen.getByText("There is no data to display")).toBeDefined();
  });

  it("renders action", () => {
    render(<EmptyState title="No data" action={<button type="button">Add item</button>} />);
    expect(screen.getByRole("button", { name: /add item/i })).toBeDefined();
  });

  it("renders icon", () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">Icon</span>} />);
    expect(screen.getByTestId("icon")).toBeDefined();
  });
});

describe("ErrorState", () => {
  it("renders default title", () => {
    render(<ErrorState message="Something failed" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("renders custom title", () => {
    render(<ErrorState title="Custom Error" message="Failed" />);
    expect(screen.getByText("Custom Error")).toBeDefined();
  });

  it("renders message", () => {
    render(<ErrorState message="Network error occurred" />);
    expect(screen.getByText("Network error occurred")).toBeDefined();
  });

  it("renders retry button when onRetry is provided", () => {
    render(<ErrorState message="Failed" onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeDefined();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState message="Failed" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("calls onRetry when retry button clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Failed" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("has correct alert role", () => {
    render(<ErrorState message="Error" />);
    expect(screen.getByRole("alert")).toBeDefined();
  });
});
