import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetPublicStatsUseCase } from "../../src/modules/public/application/use-cases/get-public-stats.use-case.js";
import { GetPublicAnnouncementsUseCase } from "../../src/modules/public/application/use-cases/get-public-announcements.use-case.js";
import { GetPublicEventsUseCase } from "../../src/modules/public/application/use-cases/get-public-events.use-case.js";
import type { PublicRepository } from "../../src/modules/public/domain/repositories/public.repository.js";

const mockPublicRepo: PublicRepository = {
  getPublicStats: vi.fn(),
  getPublishedEvents: vi.fn(),
  getPublishedAnnouncements: vi.fn(),
};

function createMockPublicRepo(): PublicRepository {
  return {
    getPublicStats: vi.fn(),
    getPublishedEvents: vi.fn(),
    getPublishedAnnouncements: vi.fn(),
  };
}

describe("Public Portfolio Integration Tests", () => {
  let repo: PublicRepository;

  beforeEach(() => {
    repo = createMockPublicRepo();
  });

  describe("GET /api/v1/public/stats", () => {
    it("should return sanitized aggregate statistics without PII", async () => {
      const mockStats = {
        totalMembers: 42,
        totalChildren: 156,
        activeSubDepartments: 5,
        totalAnnouncements: 12,
        totalEvents: 8,
      };
      vi.mocked(repo.getPublicStats).mockResolvedValue(mockStats);

      const useCase = new GetPublicStatsUseCase(repo);
      const result = await useCase.execute();

      expect(result).toBeDefined();
      expect(result.totalMembers).toBe(42);
      expect(result.totalChildren).toBe(156);
      expect(result.activeSubDepartments).toBe(5);
      expect(repo.getPublicStats).toHaveBeenCalledOnce();
    });

    it("should not include any PII fields", async () => {
      vi.mocked(repo.getPublicStats).mockResolvedValue({
        totalMembers: 42,
        totalChildren: 156,
        activeSubDepartments: 5,
        totalAnnouncements: 12,
        totalEvents: 8,
      });

      const useCase = new GetPublicStatsUseCase(repo);
      const result = await useCase.execute();

      const resultKeys = Object.keys(result);
      const piiKeys = [
        "email",
        "phone",
        "firstName",
        "lastName",
        "fullName",
        "address",
        "dateOfBirth",
        "gender",
      ];
      for (const key of piiKeys) {
        expect(resultKeys).not.toContain(key);
      }
    });
  });

  describe("GET /api/v1/public/events", () => {
    it("should return only published events", async () => {
      const mockEvents = [
        {
          id: "evt-001",
          title: "Youth Conference 2026",
          eventDate: new Date("2026-10-15"),
          venue: "Meskel Square",
          description: "Annual youth conference",
        },
        {
          id: "evt-002",
          title: "Community Outreach",
          eventDate: new Date("2026-11-01"),
          venue: "Bole area",
          description: "Community service event",
        },
      ];
      vi.mocked(repo.getPublishedEvents).mockResolvedValue(mockEvents);

      const useCase = new GetPublicEventsUseCase(repo);
      const result = await useCase.execute();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Youth Conference 2026");
      expect(result[1].title).toBe("Community Outreach");
    });

    it("should not include internal fields", async () => {
      vi.mocked(repo.getPublishedEvents).mockResolvedValue([
        {
          id: "evt-001",
          title: "Test Event",
          eventDate: new Date("2026-10-15"),
          venue: "Test Venue",
          description: "Test",
        },
      ]);

      const useCase = new GetPublicEventsUseCase(repo);
      const result = await useCase.execute();

      const event = result[0];
      expect(event).not.toHaveProperty("createdBy");
      expect(event).not.toHaveProperty("internalNotes");
      expect(event).not.toHaveProperty("budget");
    });
  });

  describe("GET /api/v1/public/announcements", () => {
    it("should return only published announcements", async () => {
      const mockAnnouncements = [
        {
          id: "ann-001",
          title: "Ministry Update",
          content: "Important ministry update for the community",
          targetAudience: "Public",
          isPublished: true,
          publishedAt: new Date("2026-09-10"),
          createdBy: "admin",
          createdAt: new Date("2026-09-10"),
        },
      ];
      vi.mocked(repo.getPublishedAnnouncements).mockResolvedValue(mockAnnouncements);

      const useCase = new GetPublicAnnouncementsUseCase(repo);
      const result = await useCase.execute();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Ministry Update");
      expect(result[0].isPublished).toBe(true);
    });

    it("should not include draft announcements", async () => {
      vi.mocked(repo.getPublishedAnnouncements).mockResolvedValue([]);

      const useCase = new GetPublicAnnouncementsUseCase(repo);
      const result = await useCase.execute();

      expect(result).toHaveLength(0);
    });

    it("should not include internal fields in announcements", async () => {
      vi.mocked(repo.getPublishedAnnouncements).mockResolvedValue([
        {
          id: "ann-001",
          title: "Test",
          content: "Test content",
          targetAudience: "Public",
          isPublished: true,
          publishedAt: new Date("2026-09-10"),
          createdBy: "admin",
          createdAt: new Date("2026-09-10"),
        },
      ]);

      const useCase = new GetPublicAnnouncementsUseCase(repo);
      const result = await useCase.execute();

      const announcement = result[0];
      expect(announcement).not.toHaveProperty("publishToTelegram");
    });
  });
});
