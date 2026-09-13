import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetPublicAnnouncementsUseCase } from "../../src/modules/public/application/use-cases/get-public-announcements.use-case.js";
import { GetPublicEventsUseCase } from "../../src/modules/public/application/use-cases/get-public-events.use-case.js";
import { GetPublicStatsUseCase } from "../../src/modules/public/application/use-cases/get-public-stats.use-case.js";
import type { PublicRepository } from "../../src/modules/public/domain/repositories/public.repository.js";

function createMockPublicRepo(): PublicRepository {
  return {
    getPublicStats: vi.fn(),
    getPublishedEvents: vi.fn(),
    getPublishedAnnouncements: vi.fn(),
  };
}

describe("Public Portfolio Performance Tests", () => {
  let repo: PublicRepository;

  beforeEach(() => {
    repo = createMockPublicRepo();
    vi.mocked(repo.getPublicStats).mockResolvedValue({
      activeMembers: 42,
      enrolledChildren: 156,
      completedEvents: 8,
    });
    vi.mocked(repo.getPublishedEvents).mockResolvedValue([]);
    vi.mocked(repo.getPublishedAnnouncements).mockResolvedValue([]);
  });

  it("public stats should respond within 100ms", async () => {
    const useCase = new GetPublicStatsUseCase(repo);
    const start = performance.now();
    await useCase.execute();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it("public events should respond within 150ms", async () => {
    const useCase = new GetPublicEventsUseCase(repo);
    const start = performance.now();
    await useCase.execute();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(150);
  });

  it("public announcements should respond within 150ms", async () => {
    const useCase = new GetPublicAnnouncementsUseCase(repo);
    const start = performance.now();
    await useCase.execute();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(150);
  });

  it("public stats should handle concurrent requests within 500ms", async () => {
    const useCase = new GetPublicStatsUseCase(repo);
    const start = performance.now();
    const promises = Array.from({ length: 10 }, () => useCase.execute());
    await Promise.all(promises);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  it("public events should handle large datasets within 300ms", async () => {
    const largeEvents = Array.from({ length: 50 }, (_, i) => ({
      id: `evt-${i}`,
      title: `Event ${i}`,
      eventDate: new Date(`2026-${String(i + 1).padStart(2, "0")}-01`),
      venue: `Venue ${i}`,
      description: `Description for event ${i}`,
    }));
    vi.mocked(repo.getPublishedEvents).mockResolvedValue(largeEvents);

    const useCase = new GetPublicEventsUseCase(repo);
    const start = performance.now();
    const result = await useCase.execute();
    const elapsed = performance.now() - start;

    expect(result).toHaveLength(50);
    expect(elapsed).toBeLessThan(300);
  });
});
