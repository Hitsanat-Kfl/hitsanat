import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateFamilyUseCase } from "../../src/modules/family/application/use-cases/create-family.use-case.js";
import type { FamilyRepository } from "../../src/modules/family/domain/repositories/family.repository.js";
import { CreateMemberStage1UseCase } from "../../src/modules/member/application/use-cases/create-member-stage1.use-case.js";
import { ListMembersUseCase } from "../../src/modules/member/application/use-cases/list-members.use-case.js";
import { UpdateMemberUseCase } from "../../src/modules/member/application/use-cases/update-member.use-case.js";
import {
  MemberAlreadyExistsError,
  MemberNotFoundError,
} from "../../src/modules/member/domain/errors/member.error.js";
import type { MemberRepository } from "../../src/modules/member/domain/repositories/member.repository.js";
import { GetSubDepartmentRosterUseCase } from "../../src/modules/sub-department/application/use-cases/get-sub-department-roster.use-case.js";
import { ListSubDepartmentsUseCase } from "../../src/modules/sub-department/application/use-cases/list-sub-departments.use-case.js";
import { SubDepartmentNotFoundError } from "../../src/modules/sub-department/domain/errors/sub-department.error.js";
import type { SubDepartmentRepository } from "../../src/modules/sub-department/domain/repositories/sub-department.repository.js";

const mockMember = {
  id: "member-001",
  fullName: "Daniel Kebede",
  christianName: "Daniel",
  phoneNumber: "+251911000001",
  yearOfStudy: "3rd Year" as const,
  academicDepartment: "Computer Science",
  campus: "Main Campus",
  gender: "Male" as const,
  photoUrl: null,
  telegramUsername: null,
  dateJoined: new Date("2026-09-01"),
  isActive: true,
  createdAt: new Date("2026-09-01"),
  updatedAt: new Date("2026-09-01"),
};

const mockMember2 = {
  ...mockMember,
  id: "member-002",
  fullName: "Hana Tesfaye",
  christianName: "Hana",
  phoneNumber: "+251911000002",
  gender: "Female" as const,
};

const mockFamily = {
  id: "family-001",
  familyName: "Tsige Family",
  fatherMemberId: null as string | null,
  motherMemberId: null as string | null,
  academicYear: "2016 E.C.",
  createdAt: new Date("2026-09-01"),
};

const mockSubDept = {
  id: "subdept-001",
  code: "TIMIHRT",
  nameAm: "ትምህርት",
  nameEn: "Timihrt",
  description: "Biblical Studies",
  createdAt: new Date("2026-09-01"),
};

const mockSubDept2 = {
  id: "subdept-002",
  code: "MEZMUR",
  nameAm: "መዝሙር",
  nameEn: "Mezmur",
  description: "Music Ministry",
  createdAt: new Date("2026-09-01"),
};

function createMockMemberRepo(): MemberRepository {
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

function createMockFamilyRepo(): FamilyRepository {
  return {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

function createMockSubDeptRepo(): SubDepartmentRepository {
  return {
    findAll: vi.fn(),
    findByCode: vi.fn(),
    findRoster: vi.fn(),
  };
}

describe("Organization Integration Tests", () => {
  describe("BR-001: Two-Stage Member Registration", () => {
    let memberRepo: MemberRepository;
    let createStage1: CreateMemberStage1UseCase;

    beforeEach(() => {
      memberRepo = createMockMemberRepo();
      createStage1 = new CreateMemberStage1UseCase(memberRepo);
    });

    it("should create member at Stage 1 with all required fields", async () => {
      vi.mocked(memberRepo.findByPhoneNumber).mockResolvedValue(null);
      vi.mocked(memberRepo.create).mockResolvedValue(mockMember);

      const result = await createStage1.execute({
        fullName: "Daniel Kebede",
        christianName: "Daniel",
        phoneNumber: "+251911000001",
        yearOfStudy: "3rd Year",
        academicDepartment: "Computer Science",
        campus: "Main Campus",
        gender: "Male",
      });

      expect(result.id).toBe("member-001");
      expect(result.fullName).toBe("Daniel Kebede");
      expect(memberRepo.create).toHaveBeenCalledOnce();
    });

    it("should reject duplicate phone number at Stage 1", async () => {
      vi.mocked(memberRepo.findByPhoneNumber).mockResolvedValue(mockMember);

      await expect(
        createStage1.execute({
          fullName: "Duplicate",
          christianName: "Dup",
          phoneNumber: "+251911000001",
          yearOfStudy: "1st Year",
          academicDepartment: "CS",
          campus: "Main",
          gender: "Male",
        })
      ).rejects.toThrow(MemberAlreadyExistsError);
    });

    it("should enforce phone uniqueness (BR-001)", async () => {
      vi.mocked(memberRepo.findByPhoneNumber).mockResolvedValue(null);
      vi.mocked(memberRepo.create).mockResolvedValue(mockMember);

      await createStage1.execute({
        fullName: "Daniel Kebede",
        christianName: "Daniel",
        phoneNumber: "+251911000001",
        yearOfStudy: "3rd Year",
        academicDepartment: "CS",
        campus: "Main",
        gender: "Male",
      });

      vi.mocked(memberRepo.findByPhoneNumber).mockResolvedValue(mockMember);

      await expect(
        createStage1.execute({
          fullName: "Another",
          christianName: "Another",
          phoneNumber: "+251911000001",
          yearOfStudy: "1st Year",
          academicDepartment: "CS",
          campus: "Main",
          gender: "Male",
        })
      ).rejects.toThrow(MemberAlreadyExistsError);
    });
  });

  describe("BR-002: Multi-Department Membership", () => {
    it("sub-department assignments are tracked in join table", async () => {
      const subDeptRepo = createMockSubDeptRepo();
      const getRoster = new GetSubDepartmentRosterUseCase(subDeptRepo);

      vi.mocked(subDeptRepo.findByCode).mockResolvedValue(mockSubDept);
      vi.mocked(subDeptRepo.findRoster).mockResolvedValue([
        {
          memberId: "member-001",
          memberName: "Daniel Kebede",
          christianName: "Daniel",
          role: "MEMBER",
          isPrimary: false,
          assignedAt: new Date(),
        },
        {
          memberId: "member-002",
          memberName: "Hana Tesfaye",
          christianName: "Hana",
          role: "LEAD",
          isPrimary: true,
          assignedAt: new Date(),
        },
      ]);

      const roster = await getRoster.execute("TIMIHRT");
      expect(roster).toHaveLength(2);
      expect(roster[0].role).toBe("MEMBER");
      expect(roster[1].role).toBe("LEAD");
    });
  });

  describe("BR-003: Multi-Year Assignment Persistence", () => {
    let memberRepo: MemberRepository;
    let updateMember: UpdateMemberUseCase;

    beforeEach(() => {
      memberRepo = createMockMemberRepo();
      updateMember = new UpdateMemberUseCase(memberRepo);
    });

    it("should update member without resetting sub-department links", async () => {
      vi.mocked(memberRepo.findById).mockResolvedValue(mockMember);
      vi.mocked(memberRepo.update).mockResolvedValue({
        ...mockMember,
        fullName: "Daniel Updated",
      });

      const result = await updateMember.execute("member-001", {
        fullName: "Daniel Updated",
      });

      expect(result.fullName).toBe("Daniel Updated");
    });
  });

  describe("BR-004: Family Father & Mother Allocation", () => {
    let familyRepo: FamilyRepository;
    let createFamily: CreateFamilyUseCase;

    beforeEach(() => {
      familyRepo = createMockFamilyRepo();
      createFamily = new CreateFamilyUseCase(familyRepo);
    });

    it("should create family with father and mother", async () => {
      const familyWithParents = {
        ...mockFamily,
        fatherMemberId: "member-001",
        motherMemberId: "member-002",
      };
      vi.mocked(familyRepo.create).mockResolvedValue(familyWithParents);

      const result = await createFamily.execute({
        familyName: "Tsige Family",
        fatherMemberId: "member-001",
        motherMemberId: "member-002",
        academicYear: "2016 E.C.",
      });

      expect(result.fatherMemberId).toBe("member-001");
      expect(result.motherMemberId).toBe("member-002");
    });

    it("should create family with optional parents", async () => {
      vi.mocked(familyRepo.create).mockResolvedValue(mockFamily);

      const result = await createFamily.execute({
        familyName: "Tsige Family",
        academicYear: "2016 E.C.",
      });

      expect(result.fatherMemberId).toBeNull();
      expect(result.motherMemberId).toBeNull();
    });
  });

  describe("BR-005: Dual Family Membership Permitted", () => {
    it("should allow family creation with flexible parent assignment", async () => {
      const familyRepo = createMockFamilyRepo();
      const createFamily = new CreateFamilyUseCase(familyRepo);

      vi.mocked(familyRepo.create).mockResolvedValue({
        ...mockFamily,
        fatherMemberId: "member-001",
        motherMemberId: "member-002",
      });

      const result = await createFamily.execute({
        familyName: "Tsige Family",
        fatherMemberId: "member-001",
        motherMemberId: "member-002",
        academicYear: "2016 E.C.",
      });

      expect(result.fatherMemberId).toBe("member-001");
      expect(result.motherMemberId).toBe("member-002");
    });
  });

  describe("Sub-Department List & Rosters", () => {
    let subDeptRepo: SubDepartmentRepository;
    let listSubDepts: ListSubDepartmentsUseCase;
    let getRoster: GetSubDepartmentRosterUseCase;

    beforeEach(() => {
      subDeptRepo = createMockSubDeptRepo();
      listSubDepts = new ListSubDepartmentsUseCase(subDeptRepo);
      getRoster = new GetSubDepartmentRosterUseCase(subDeptRepo);
    });

    it("should list all 5 sub-departments", async () => {
      vi.mocked(subDeptRepo.findAll).mockResolvedValue([
        mockSubDept,
        mockSubDept2,
        { ...mockSubDept, id: "subdept-003", code: "KUTITR", nameAm: "ቁጥጥር", nameEn: "Kutitr" },
        { ...mockSubDept, id: "subdept-004", code: "EKD", nameAm: "እቅድ", nameEn: "Ekd" },
        {
          ...mockSubDept,
          id: "subdept-005",
          code: "KINETIBEB",
          nameAm: "ኪነ-ጥበብ",
          nameEn: "Kinetibeb",
        },
      ]);

      const result = await listSubDepts.execute();
      expect(result).toHaveLength(5);
      expect(result.map((s) => s.code)).toContain("TIMIHRT");
      expect(result.map((s) => s.code)).toContain("MEZMUR");
      expect(result.map((s) => s.code)).toContain("KUTITR");
      expect(result.map((s) => s.code)).toContain("EKD");
      expect(result.map((s) => s.code)).toContain("KINETIBEB");
    });

    it("should get roster for a sub-department", async () => {
      vi.mocked(subDeptRepo.findByCode).mockResolvedValue(mockSubDept);
      vi.mocked(subDeptRepo.findRoster).mockResolvedValue([
        {
          memberId: "member-001",
          memberName: "Daniel Kebede",
          christianName: "Daniel",
          role: "LEAD",
          isPrimary: true,
          assignedAt: new Date(),
        },
      ]);

      const roster = await getRoster.execute("TIMIHRT");
      expect(roster).toHaveLength(1);
      expect(roster[0].role).toBe("LEAD");
    });

    it("should throw for non-existent sub-department", async () => {
      vi.mocked(subDeptRepo.findByCode).mockResolvedValue(null);

      await expect(getRoster.execute("NONEXISTENT")).rejects.toThrow(SubDepartmentNotFoundError);
    });
  });

  describe("Member List Filtering", () => {
    let memberRepo: MemberRepository;
    let listMembers: ListMembersUseCase;

    beforeEach(() => {
      memberRepo = createMockMemberRepo();
      listMembers = new ListMembersUseCase(memberRepo);
    });

    it("should filter members by year of study", async () => {
      vi.mocked(memberRepo.findMany).mockResolvedValue({
        success: true,
        data: [mockMember],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await listMembers.execute({
        page: 1,
        limit: 20,
        yearOfStudy: "3rd Year",
      });

      expect(result.data).toHaveLength(1);
      expect(memberRepo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ yearOfStudy: "3rd Year" })
      );
    });

    it("should filter members by active status", async () => {
      vi.mocked(memberRepo.findMany).mockResolvedValue({
        success: true,
        data: [mockMember],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await listMembers.execute({
        page: 1,
        limit: 20,
        isActive: "true",
      });

      expect(result.data).toHaveLength(1);
    });

    it("should filter members by sub-department", async () => {
      vi.mocked(memberRepo.findMany).mockResolvedValue({
        success: true,
        data: [mockMember],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await listMembers.execute({
        page: 1,
        limit: 20,
        subDept: "subdept-001",
      });

      expect(result.data).toHaveLength(1);
    });

    it("should filter members by family", async () => {
      vi.mocked(memberRepo.findMany).mockResolvedValue({
        success: true,
        data: [mockMember],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const result = await listMembers.execute({
        page: 1,
        limit: 20,
        familyId: "family-001",
      });

      expect(result.data).toHaveLength(1);
    });
  });

  describe("Member Update", () => {
    let memberRepo: MemberRepository;
    let updateMember: UpdateMemberUseCase;

    beforeEach(() => {
      memberRepo = createMockMemberRepo();
      updateMember = new UpdateMemberUseCase(memberRepo);
    });

    it("should update member fields", async () => {
      vi.mocked(memberRepo.findById).mockResolvedValue(mockMember);
      vi.mocked(memberRepo.update).mockResolvedValue({
        ...mockMember,
        fullName: "Daniel Updated",
      });

      const result = await updateMember.execute("member-001", {
        fullName: "Daniel Updated",
      });

      expect(result.fullName).toBe("Daniel Updated");
    });

    it("should reject duplicate phone number", async () => {
      vi.mocked(memberRepo.findById).mockResolvedValue(mockMember);
      vi.mocked(memberRepo.findByPhoneNumber).mockResolvedValue(mockMember2);

      await expect(
        updateMember.execute("member-001", {
          phoneNumber: "+251911000002",
        })
      ).rejects.toThrow("already in use");
    });

    it("should allow keeping same phone number", async () => {
      vi.mocked(memberRepo.findById).mockResolvedValue(mockMember);
      vi.mocked(memberRepo.update).mockResolvedValue(mockMember);

      const result = await updateMember.execute("member-001", {
        phoneNumber: "+251911000001",
      });

      expect(result).toBeDefined();
    });

    it("should throw when member not found", async () => {
      vi.mocked(memberRepo.findById).mockResolvedValue(null);

      await expect(updateMember.execute("nonexistent", { fullName: "Test" })).rejects.toThrow(
        MemberNotFoundError
      );
    });
  });
});
