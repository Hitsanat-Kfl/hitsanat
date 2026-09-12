import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UpcomingEventsWidget } from "../../src/components/ui/dashboard";
import type { EventItem } from "../../src/types/dashboard";

const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Sunday Service",
    date: "2026-09-14",
    time: "9:00 AM",
    location: "Main Hall",
    responsiblePerson: "Pastor John",
    status: "info",
  },
  {
    id: "2",
    title: "Bible Study",
    date: "2026-09-10",
    time: "6:00 PM",
    location: "Room 201",
    status: "success",
  },
];

describe("UpcomingEventsWidget", () => {
  it("renders title", () => {
    render(<UpcomingEventsWidget items={mockEvents} />);
    expect(screen.getByText("Upcoming Events")).toBeDefined();
  });

  it("renders event titles", () => {
    render(<UpcomingEventsWidget items={mockEvents} />);
    expect(screen.getByText("Sunday Service")).toBeDefined();
    expect(screen.getByText("Bible Study")).toBeDefined();
  });

  it("renders event times", () => {
    render(<UpcomingEventsWidget items={mockEvents} />);
    expect(screen.getByText("9:00 AM")).toBeDefined();
    expect(screen.getByText("6:00 PM")).toBeDefined();
  });

  it("renders event locations", () => {
    render(<UpcomingEventsWidget items={mockEvents} />);
    expect(screen.getByText("Main Hall")).toBeDefined();
    expect(screen.getByText("Room 201")).toBeDefined();
  });

  it("renders responsible person", () => {
    render(<UpcomingEventsWidget items={mockEvents} />);
    expect(screen.getByText("Pastor John")).toBeDefined();
  });

  it("renders empty state", () => {
    render(<UpcomingEventsWidget items={[]} />);
    expect(screen.getByText("No upcoming events")).toBeDefined();
  });

  it("limits items to maxItems", () => {
    render(<UpcomingEventsWidget items={mockEvents} maxItems={1} />);
    expect(screen.getByText("Sunday Service")).toBeDefined();
    expect(screen.queryByText("Bible Study")).toBeNull();
  });
});
