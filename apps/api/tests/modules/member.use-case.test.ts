import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateMemberStage1UseCase } from "../../src/modules/member/application/use-cases/create-member-stage1.use-case.js";
import { UpdateMemberStage2UseCase } from "../../src/modules/member/application/use-cases/update-member-stage2.use-case.js";
import { ListMembersUseCase } from "../../src/modules/member/application/use-cases/list-members.use-case.js";
import { GetMemberDetailUseCase } from "../../src/modules/member/application/use-cases/get-member-detail.use-case.js";
import type { MemberRepository } from "../../src/modules/member/domain/repositories/member.repository.js";
import {
  MemberAlreadyExistsError,
  MemberNotFoundError,
} from "../../src/modules/member/domain/errors/member.error.js";

const mockMember = {
  id: "test-id-123",
  fullName: "Test Member",
  christianName: "Test Christian",
  phoneNumber: "+251911000001",
  yearOfStudy: "1st Year" as const,
  academicDepartment: "Computer Science",
  campus: "Main Campus",
  gender: "Male" as const,
  photoUrl: null,
  telegramUsername: null,
  dateJoined: new Date(),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createMockRepo(): MemberRepository {
  return {
    findById: vi.fn(),
    findByPhoneNumber: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findBySubDepartment: vi.fn(),
    findByFamily: vi.fn(),
    findActive: vi.fn(),
    countActive: vi.fn(),
  };
}

describe("CreateMemberStage1UseCase", () => {
  let repo: MemberRepository;
  let useCase: CreateMemberStage1UseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new CreateMemberStage1UseCase(repo);
  });

  it("should create a member when phone is unique", async () => {
    vi.mocked(repo.findByPhoneNumber).mockResolvedValue(null);
    vi.mocked(repo.create).mockResolvedValue(mockMember);

    const result = await useCase.execute({
      fullName: "Test",
      christianName: "Test",
      phoneNumber: "+251911000001",
      yearOfStudy: "1st Year",
      academicDepartment: "CS",
      campus: "Main",
      gender: "Male",
    });

    expect(result).toEqual(mockMember);
    expect(repo.create).toHaveBeenCalledOnce();
  });

  it("should throw when phone already exists", async () => {
    vi.mocked(repo.findByPhoneNumber).mockResolvedValue(mockMember);

    await expect(
      useCase.execute({
        fullName: "Test",
        christianName: "Test",
        phoneNumber: "+251911000001",
        yearOfStudy: "1st Year",
        academicDepartment: "CS",
        campus: "Main",
        gender: "Male",
      })
    ).rejects.toThrow(MemberAlreadyExistsError);
  });
});

describe("GetMemberDetailUseCase", () => {
  let repo: MemberRepository;
  let useCase: GetMemberDetailUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new GetMemberDetailUseCase(repo);
  });

  it("should return member by ID", async () => {
    vi.mocked(repo.findById).mockResolvedValue(mockMember);

    const result = await useCase.execute("test-id-123");
    expect(result).toEqual(mockMember);
  });

  it("should throw when member not found", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute("nonexistent")).rejects.toThrow(MemberNotFoundError);
  });
});

describe("ListMembersUseCase", () => {
  let repo: MemberRepository;
  let useCase: ListMembersUseCase;

  beforeEach(() => {
    repo = createMockRepo();
    useCase = new ListMembersUseCase(repo);
  });

  it("should return paginated members", async () => {
    vi.mocked(repo.findMany).mockResolvedValue({
      success: true,
      data: [mockMember],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });
});
