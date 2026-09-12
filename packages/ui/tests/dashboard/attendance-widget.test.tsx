import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AttendanceWidget } from "../../src/components/ui/dashboard";
import type { AttendanceData } from "../../src/types/dashboard";

const mockData: AttendanceData = {
  expected: 120,
  present: 96,
  absent: 15,
  excused: 9,
  attendanceRate: 80,
  location: "Main Hall",
  period: "September 2026",
};

describe("AttendanceWidget", () => {
  it("renders attendance rate", () => {
    render(<AttendanceWidget data={mockData} />);
    expect(screen.getByText("80%")).toBeDefined();
  });

  it("renders category counts", () => {
    render(<AttendanceWidget data={mockData} />);
    expect(screen.getByText("120")).toBeDefined();
    expect(screen.getByText("96")).toBeDefined();
    expect(screen.getByText("15")).toBeDefined();
    expect(screen.getByText("9")).toBeDefined();
  });

  it("renders period", () => {
    render(<AttendanceWidget data={mockData} />);
    expect(screen.getByText("September 2026")).toBeDefined();
  });

  it("renders location", () => {
    render(<AttendanceWidget data={mockData} />);
    expect(screen.getByText("Main Hall")).toBeDefined();
  });

  it("renders progress bar", () => {
    const { container } = render(<AttendanceWidget data={mockData} />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<AttendanceWidget data={mockData} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
