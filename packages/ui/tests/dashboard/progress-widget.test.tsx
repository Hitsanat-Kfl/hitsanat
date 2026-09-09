import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressWidget } from "../../src/components/ui/dashboard";
import type { ProgressData } from "../../src/types/dashboard";

const mockProgress: ProgressData = {
  label: "Annual Plan Completion",
  percentage: 65,
  completed: 13,
  target: 20,
  status: "default",
  deadline: "Dec 2026",
};

describe("ProgressWidget", () => {
  it("renders label", () => {
    render(<ProgressWidget data={mockProgress} />);
    expect(screen.getByText("Annual Plan Completion")).toBeDefined();
  });

  it("renders percentage", () => {
    render(<ProgressWidget data={mockProgress} />);
    expect(screen.getByText("65%")).toBeDefined();
  });

  it("renders completed and target", () => {
    render(<ProgressWidget data={mockProgress} />);
    expect(screen.getByText("13")).toBeDefined();
    expect(screen.getByText("20")).toBeDefined();
  });

  it("renders deadline", () => {
    render(<ProgressWidget data={mockProgress} />);
    expect(screen.getByText("Due Dec 2026")).toBeDefined();
  });

  it("renders progress bar", () => {
    const { container } = render(<ProgressWidget data={mockProgress} />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<ProgressWidget data={mockProgress} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
