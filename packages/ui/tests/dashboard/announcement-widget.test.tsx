import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnnouncementWidget } from "../../src/components/ui/dashboard";
import type { AnnouncementItem } from "../../src/types/dashboard";

const mockItems: AnnouncementItem[] = [
  {
    id: "1",
    title: "Annual Conference",
    summary: "The annual conference will be held next month.",
    date: "Sep 5, 2026",
    priority: "high",
    author: "Chairperson",
    isRead: false,
  },
  {
    id: "2",
    title: "Schedule Update",
    summary: "Sunday service time changed to 9 AM.",
    date: "Sep 3, 2026",
    priority: "medium",
    author: "Secretary",
    isRead: true,
  },
];

describe("AnnouncementWidget", () => {
  it("renders title", () => {
    render(<AnnouncementWidget items={mockItems} />);
    expect(screen.getByText("Announcements")).toBeDefined();
  });

  it("renders announcement titles", () => {
    render(<AnnouncementWidget items={mockItems} />);
    expect(screen.getByText("Annual Conference")).toBeDefined();
    expect(screen.getByText("Schedule Update")).toBeDefined();
  });

  it("renders summaries", () => {
    render(<AnnouncementWidget items={mockItems} />);
    expect(screen.getByText("The annual conference will be held next month.")).toBeDefined();
  });

  it("renders authors", () => {
    render(<AnnouncementWidget items={mockItems} />);
    expect(screen.getByText("Chairperson")).toBeDefined();
    expect(screen.getByText("Secretary")).toBeDefined();
  });

  it("renders empty state", () => {
    render(<AnnouncementWidget items={[]} />);
    expect(screen.getByText("No announcements")).toBeDefined();
  });

  it("renders loading state", () => {
    const { container } = render(<AnnouncementWidget items={[]} state="loading" />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
