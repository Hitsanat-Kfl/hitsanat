import { beforeEach, describe, expect, it, vi } from "vitest";
import { ListFamiliesUseCase } from "../../src/modules/family/application/use-cases/list-families.use-case.js";
import type { FamilyRepository } from "../../src/modules/family/domain/repositories/family.repository.js";

function createMockFamilyRepo(): FamilyRepository {
  return {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

describe("Family List Performance Tests", () => {
  let repo: FamilyRepository;

  beforeEach(() => {
    repo = createMockFamilyRepo();
    vi.mocked(repo.findMany).mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  });

  it("family list should respond within 200ms", async () => {
    const useCase = new ListFamiliesUseCase(repo);
    const start = performance.now();
    await useCase.execute({ page: 1, limit: 20 });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("family list with search should respond within 200ms", async () => {
    const useCase = new ListFamiliesUseCase(repo);
    const start = performance.now();
    await useCase.execute({ page: 1, limit: 20, search: "test" });
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
  });

  it("family list with 100 records should respond within 500ms", async () => {
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      id: `family-${i}`,
      familyName: `Family ${i}`,
      fatherName: `Father ${i}`,
      motherName: `Mother ${i}`,
      phone: `+251911000${String(i).padStart(4, "0")}`,
      address: `Address ${i}`,
      subDepartmentId: `dept-${i}`,
      createdAt: new Date(),
    }));

    vi.mocked(repo.findMany).mockResolvedValue({
      success: true,
      data: largeDataset,
      pagination: { page: 1, limit: 100, total: 100, totalPages: 1 },
    });

    const useCase = new ListFamiliesUseCase(repo);
    const start = performance.now();
    const result = await useCase.execute({ page: 1, limit: 100 });
    const elapsed = performance.now() - start;

    expect(result.data).toHaveLength(100);
    expect(elapsed).toBeLessThan(500);
  });
});
