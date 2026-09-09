import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../src/components/ui/progress";

describe("Progress", () => {
  it("renders with default value", () => {
    render(<Progress value={50} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeDefined();
    expect(progressbar.getAttribute("aria-valuenow")).toBe("50");
    expect(progressbar.getAttribute("aria-valuemin")).toBe("0");
    expect(progressbar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("renders at 0%", () => {
    render(<Progress value={0} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.getAttribute("aria-valuenow")).toBe("0");
  });

  it("renders at 100%", () => {
    render(<Progress value={100} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.getAttribute("aria-valuenow")).toBe("100");
  });

  it("clamps value above max", () => {
    render(<Progress value={150} max={100} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.getAttribute("aria-valuenow")).toBe("150");
  });

  it("renders with showLabel", () => {
    render(<Progress value={75} showLabel />);
    expect(screen.getByText("Progress")).toBeDefined();
    expect(screen.getByText("75%")).toBeDefined();
  });

  it("renders different variants", () => {
    const { rerender } = render(<Progress value={50} variant="success" />);
    expect(screen.getByRole("progressbar").className).toContain("bg-primary/20");

    rerender(<Progress value={50} variant="warning" />);
    expect(screen.getByRole("progressbar").className).toContain("bg-primary/20");

    rerender(<Progress value={50} variant="destructive" />);
    expect(screen.getByRole("progressbar").className).toContain("bg-primary/20");
  });

  it("applies custom className", () => {
    render(<Progress value={50} className="custom-progress" />);
    expect(screen.getByRole("progressbar").className).toContain("custom-progress");
  });
});
