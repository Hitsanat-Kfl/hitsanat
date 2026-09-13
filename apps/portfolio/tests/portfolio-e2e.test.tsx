import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockStats = {
  activeMembers: 42,
  enrolledChildren: 156,
  completedEvents: 8,
};

const mockEvents = [
  {
    id: "evt-001",
    title: "Youth Conference 2026",
    eventDate: "2026-10-15T09:00:00Z",
    venue: "Meskel Square",
    description: "Annual youth conference for all ministry members",
  },
  {
    id: "evt-002",
    title: "Community Outreach",
    eventDate: "2026-11-01T14:00:00Z",
    venue: "Bole Area",
    description: "Community service event",
  },
];

const mockAnnouncements = [
  {
    id: "ann-001",
    title: "Ministry Update",
    content: "Important ministry update for the community. Please read carefully.",
    targetAudience: "Public",
    isPublished: true,
    publishedAt: "2026-09-10T10:00:00Z",
    createdBy: "admin",
    createdAt: "2026-09-10T10:00:00Z",
  },
  {
    id: "ann-002",
    title: "New Program Launch",
    content: "We are excited to announce a new program for children.",
    targetAudience: "Parents",
    isPublished: true,
    publishedAt: "2026-09-12T08:00:00Z",
    createdBy: "admin",
    createdAt: "2026-09-12T08:00:00Z",
  },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

describe("Portfolio E2E Tests", () => {
  describe("Public Stats", () => {
    it("displays ministry statistics from API", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockStats }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/stats");
      const data = await res.json();
      const stats = data.data;

      expect(stats.activeMembers).toBe(42);
      expect(stats.enrolledChildren).toBe(156);
      expect(stats.completedEvents).toBe(8);
    });

    it("handles API failure gracefully", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/stats");
      expect(res.ok).toBe(false);
    });
  });

  describe("Public Events", () => {
    it("fetches published events", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockEvents }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/events");
      const data = await res.json();
      const events = data.data;

      expect(events).toHaveLength(2);
      expect(events[0].title).toBe("Youth Conference 2026");
      expect(events[1].venue).toBe("Bole Area");
    });

    it("calculates countdown correctly", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: "evt-1",
              title: "Future Event",
              eventDate: futureDate.toISOString(),
              venue: "Test",
              description: "",
            },
          ],
        }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/events");
      const data = await res.json();
      const event = data.data[0];

      const eventDate = new Date(event.eventDate);
      const now = new Date();
      const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      expect(diffDays).toBeGreaterThan(0);
      expect(diffDays).toBeLessThanOrEqual(11);
    });
  });

  describe("Public Announcements", () => {
    it("fetches published announcements", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAnnouncements }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/announcements");
      const data = await res.json();
      const announcements = data.data;

      expect(announcements).toHaveLength(2);
      expect(announcements[0].title).toBe("Ministry Update");
      expect(announcements[0].targetAudience).toBe("Public");
    });

    it("returns only published announcements", async () => {
      const publishedOnly = mockAnnouncements.filter((a) => a.isPublished);
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: publishedOnly }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/announcements");
      const data = await res.json();

      expect(data.data.every((a: { isPublished: boolean }) => a.isPublished)).toBe(true);
    });
  });

  describe("No PII in Public Responses", () => {
    it("stats response contains no personal data", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockStats }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/stats");
      const data = await res.json();
      const keys = Object.keys(data.data);

      const piiKeys = ["email", "phone", "firstName", "lastName", "fullName", "address"];
      for (const key of piiKeys) {
        expect(keys).not.toContain(key);
      }
    });

    it("events response contains no internal fields", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockEvents }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/events");
      const data = await res.json();
      const event = data.data[0];

      expect(event).not.toHaveProperty("createdBy");
      expect(event).not.toHaveProperty("internalNotes");
      expect(event).not.toHaveProperty("budget");
    });
  });

  describe("Empty States", () => {
    it("handles empty events list", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/events");
      const data = await res.json();

      expect(data.data).toHaveLength(0);
    });

    it("handles empty announcements list", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

      const res = await fetch("http://localhost:3001/api/v1/public/announcements");
      const data = await res.json();

      expect(data.data).toHaveLength(0);
    });
  });
});
