import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateFamilyUseCase } from "../../src/modules/family/application/use-cases/create-family.use-case.js";
import { GetFamilyDetailUseCase } from "../../src/modules/family/application/use-cases/get-family-detail.use-case.js";
import { ListFamiliesUseCase } from "../../src/modules/family/application/use-cases/list-families.use-case.js";
import { FamilyNotFoundError } from "../../src/modules/family/domain/errors/family.error.js";
import type { FamilyRepository } from "../../src/modules/family/domain/repositories/family.repository.js";

const mockFamily = {
  id: "family-id-123",
  familyName: "Test Family",
  fatherMemberId: null,
  motherMemberId: null,
  academicYear: "2026",
  createdAt: new Date(),
};

function createMockRepo(): FamilyRepository {
  return {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

describe("CreateFamilyUseCase", () => {
  let repo: FamilyRepository;
  let useCase: CreateFamilyUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new CreateFamilyUseCase(repo);
  });

  it("should create a family", async () => {
    vi.mocked(repo.create).mockResolvedValue(mockFamily);

    const result = await useCase.execute({
      familyName: "Test Family",
      academicYear: "2026",
    });

    expect(result).toEqual(mockFamily);
    expect(repo.create).toHaveBeenCalledOnce();
  });
});

describe("GetFamilyDetailUseCase", () => {
  let repo: FamilyRepository;
  let useCase: GetFamilyDetailUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new GetFamilyDetailUseCase(repo);
  });

  it("should return family by ID", async () => {
    vi.mocked(repo.findById).mockResolvedValue(mockFamily);

    const result = await useCase.execute("family-id-123");
    expect(result).toEqual(mockFamily);
  });

  it("should throw when family not found", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute("nonexistent")).rejects.toThrow(FamilyNotFoundError);
  });
});

describe("ListFamiliesUseCase", () => {
  let repo: FamilyRepository;
  let useCase: ListFamiliesUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new ListFamiliesUseCase(repo);
  });

  it("should return paginated families", async () => {
    vi.mocked(repo.findMany).mockResolvedValue({
      success: true,
      data: [mockFamily],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });
});
