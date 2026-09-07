import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner, spinnerVariants } from "../src/components/ui/spinner";

describe("Spinner", () => {
  it("renders with default size", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner).toBeDefined();
    expect(spinner.className).toContain("h-6");
    expect(spinner.className).toContain("w-6");
  });

  it("renders with sm size", () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner.className).toContain("h-4");
    expect(spinner.className).toContain("w-4");
  });

  it("renders with lg size", () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner.className).toContain("h-8");
    expect(spinner.className).toContain("w-8");
  });

  it("has screen reader text", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it("has spin animation", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner.className).toContain("animate-spin");
  });

  it("applies custom className", () => {
    render(<Spinner className="custom-spinner" />);
    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner.className).toContain("custom-spinner");
  });
});

describe("spinnerVariants", () => {
  it("generates correct class strings for all sizes", () => {
    expect(spinnerVariants({ size: "sm" })).toContain("h-4");
    expect(spinnerVariants({ size: "default" })).toContain("h-6");
    expect(spinnerVariants({ size: "lg" })).toContain("h-8");
  });
});
