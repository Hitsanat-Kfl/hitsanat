import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateChildUseCase } from "../../src/modules/child/application/use-cases/create-child.use-case.js";
import { CreateParentUseCase } from "../../src/modules/child/application/use-cases/create-parent.use-case.js";
import { LinkParentUseCase } from "../../src/modules/child/application/use-cases/link-parent.use-case.js";
import { ListChildrenUseCase } from "../../src/modules/child/application/use-cases/list-children.use-case.js";
import { ListParentsUseCase } from "../../src/modules/child/application/use-cases/list-parents.use-case.js";
import { ReclassifyChildUseCase } from "../../src/modules/child/application/use-cases/reclassify-child.use-case.js";
import { UnlinkParentUseCase } from "../../src/modules/child/application/use-cases/unlink-parent.use-case.js";
import { ChildNotFoundError } from "../../src/modules/child/domain/errors/child.error.js";
import type { ChildRepository } from "../../src/modules/child/domain/repositories/child.repository.js";

const mockChild = {
  id: "child-001",
  fullName: "Kidist Mulugeta",
  christianName: "Kidist",
  gender: "Female" as const,
  dateOfBirth: new Date("2018-06-15"),
  address: "Bole, Addis Ababa",
  kutrGroup: "Kutr 1" as const,
  collectionLocation: "Apartama" as const,
  photoUrl: null,
  isActive: true,
  createdAt: new Date("2026-09-01"),
};

const mockChild2 = {
  ...mockChild,
  id: "child-002",
  fullName: "Selam Mulugeta",
  christianName: "Selam",
  kutrGroup: "Kutr 2" as const,
  collectionLocation: "Gende Boy" as const,
};

const mockParent = {
  id: "parent-001",
  fullName: "Mulugeta Tesfaye",
  phoneNumber: "+251911000010",
  secondaryPhone: "+251911000011",
  address: "Bole, Addis Ababa",
  occupation: "Engineer",
  notes: null,
  createdAt: new Date("2026-09-01"),
};

const mockParent2 = {
  ...mockParent,
  id: "parent-002",
  fullName: "Almaz Demissie",
  phoneNumber: "+251911000012",
  occupation: "Teacher",
};

function createMockChildRepo(): ChildRepository {
  return {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByParent: vi.fn(),
    findActive: vi.fn(),
    findActiveByBirthdayMonth: vi.fn(),
    createParent: vi.fn(),
    findAllParents: vi.fn(),
    findParentById: vi.fn(),
    findLinkByChildAndRelation: vi.fn(),
    findLinkByChildAndParent: vi.fn(),
    createLink: vi.fn(),
    deleteLink: vi.fn(),
    findLinkById: vi.fn(),
    findParentsByChild: vi.fn(),
  };
}

describe("Children & Parents Integration Tests", () => {
  describe("Child Registration (FR-04.1)", () => {
    let childRepo: ChildRepository;
    let createChild: CreateChildUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      createChild = new CreateChildUseCase(childRepo);
    });

    it("should create child with all required fields", async () => {
      vi.mocked(childRepo.create).mockResolvedValue(mockChild);

      const result = await createChild.execute({
        fullName: "Kidist Mulugeta",
        christianName: "Kidist",
        gender: "Female",
        dateOfBirth: "2018-06-15",
        address: "Bole, Addis Ababa",
        kutrGroup: "Kutr 1",
        collectionLocation: "Apartama",
      });

      expect(result.id).toBe("child-001");
      expect(result.fullName).toBe("Kidist Mulugeta");
      expect(result.kutrGroup).toBe("Kutr 1");
      expect(result.collectionLocation).toBe("Apartama");
      expect(childRepo.create).toHaveBeenCalledOnce();
    });

    it("should create child with optional photo URL", async () => {
      const childWithPhoto = { ...mockChild, photoUrl: "https://example.com/photo.jpg" };
      vi.mocked(childRepo.create).mockResolvedValue(childWithPhoto);

      const result = await createChild.execute({
        fullName: "Kidist Mulugeta",
        christianName: "Kidist",
        gender: "Female",
        dateOfBirth: "2018-06-15",
        address: "Bole, Addis Ababa",
        kutrGroup: "Kutr 1",
        collectionLocation: "Apartama",
        photoUrl: "https://example.com/photo.jpg",
      });

      expect(result.photoUrl).toBe("https://example.com/photo.jpg");
    });
  });

  describe("BR-012: Kutr Group Classification", () => {
    let childRepo: ChildRepository;
    let createChild: CreateChildUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      createChild = new CreateChildUseCase(childRepo);
    });

    it("should accept Kutr 1 as valid kutr group", async () => {
      vi.mocked(childRepo.create).mockResolvedValue(mockChild);

      const result = await createChild.execute({
        fullName: "Kidist Mulugeta",
        christianName: "Kidist",
        gender: "Female",
        dateOfBirth: "2018-06-15",
        address: "Bole, Addis Ababa",
        kutrGroup: "Kutr 1",
        collectionLocation: "Apartama",
      });

      expect(result.kutrGroup).toBe("Kutr 1");
    });

    it("should accept Kutr 2 as valid kutr group", async () => {
      vi.mocked(childRepo.create).mockResolvedValue(mockChild2);

      const result = await createChild.execute({
        fullName: "Selam Mulugeta",
        christianName: "Selam",
        gender: "Female",
        dateOfBirth: "2015-03-20",
        address: "Bole, Addis Ababa",
        kutrGroup: "Kutr 2",
        collectionLocation: "Gende Boy",
      });

      expect(result.kutrGroup).toBe("Kutr 2");
    });
  });

  describe("BR-013: Collection Location Routes", () => {
    let childRepo: ChildRepository;
    let createChild: CreateChildUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      createChild = new CreateChildUseCase(childRepo);
    });

    const validRoutes = ["Apartama", "Gende Boy", "Gende Je", "Cobalt", "Bate"];

    for (const route of validRoutes) {
      it(`should accept ${route} as valid collection location`, async () => {
        const child = { ...mockChild, collectionLocation: route as any };
        vi.mocked(childRepo.create).mockResolvedValue(child);

        const result = await createChild.execute({
          fullName: "Test Child",
          christianName: "Test",
          gender: "Male",
          dateOfBirth: "2018-01-01",
          address: "Test Address",
          kutrGroup: "Kutr 1",
          collectionLocation: route,
        });

        expect(result.collectionLocation).toBe(route);
      });
    }
  });

  describe("Child Reclassification", () => {
    let childRepo: ChildRepository;
    let reclassify: ReclassifyChildUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      reclassify = new ReclassifyChildUseCase(childRepo);
    });

    it("should reclassify child from Kutr 1 to Kutr 2", async () => {
      const reclassifiedChild = { ...mockChild, kutrGroup: "Kutr 2" as const };
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.update).mockResolvedValue(reclassifiedChild);

      const result = await reclassify.execute("child-001", { kutrGroup: "Kutr 2" });

      expect(result.kutrGroup).toBe("Kutr 2");
      expect(childRepo.update).toHaveBeenCalledWith("child-001", { kutrGroup: "Kutr 2" });
    });

    it("should throw ChildNotFoundError for non-existent child", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(null);

      await expect(reclassify.execute("non-existent", { kutrGroup: "Kutr 2" })).rejects.toThrow(
        ChildNotFoundError
      );
    });
  });

  describe("Birthday Month Query", () => {
    let childRepo: ChildRepository;

    beforeEach(() => {
      childRepo = createMockChildRepo();
    });

    it("should find children by birthday month", async () => {
      vi.mocked(childRepo.findActiveByBirthdayMonth).mockResolvedValue([mockChild]);

      const result = await childRepo.findActiveByBirthdayMonth(6);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("child-001");
      expect(childRepo.findActiveByBirthdayMonth).toHaveBeenCalledWith(6);
    });
  });

  describe("Parent CRUD (BES-009)", () => {
    let childRepo: ChildRepository;
    let createParent: CreateParentUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      createParent = new CreateParentUseCase(childRepo);
    });

    it("should create parent with all required fields", async () => {
      vi.mocked(childRepo.createParent).mockResolvedValue(mockParent);

      const result = await createParent.execute({
        fullName: "Mulugeta Tesfaye",
        phoneNumber: "+251911000010",
        secondaryPhone: "+251911000011",
        address: "Bole, Addis Ababa",
        occupation: "Engineer",
      });

      expect(result.id).toBe("parent-001");
      expect(result.fullName).toBe("Mulugeta Tesfaye");
      expect(result.phoneNumber).toBe("+251911000010");
      expect(childRepo.createParent).toHaveBeenCalledOnce();
    });

    it("should list all parents", async () => {
      vi.mocked(childRepo.findAllParents).mockResolvedValue([mockParent, mockParent2]);

      const result = await childRepo.findAllParents();

      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe("Mulugeta Tesfaye");
      expect(result[1].fullName).toBe("Almaz Demissie");
    });
  });

  describe("BR-010: Parent-Child Cardinality Constraint", () => {
    let childRepo: ChildRepository;
    let linkParent: LinkParentUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      linkParent = new LinkParentUseCase(childRepo);
    });

    it("should link Father to child successfully", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findParentById).mockResolvedValue(mockParent);
      vi.mocked(childRepo.findLinkByChildAndRelation).mockResolvedValue(null);
      vi.mocked(childRepo.findLinkByChildAndParent).mockResolvedValue(null);
      vi.mocked(childRepo.createLink).mockResolvedValue({
        id: "link-001",
        childId: "child-001",
        parentId: "parent-001",
        relation: "Father",
        createdAt: new Date(),
      });

      const result = await linkParent.execute("child-001", {
        parentId: "parent-001",
        relation: "Father",
      });

      expect(result.relation).toBe("Father");
      expect(childRepo.createLink).toHaveBeenCalledOnce();
    });

    it("should link Mother to child successfully", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findParentById).mockResolvedValue(mockParent2);
      vi.mocked(childRepo.findLinkByChildAndRelation).mockResolvedValue(null);
      vi.mocked(childRepo.findLinkByChildAndParent).mockResolvedValue(null);
      vi.mocked(childRepo.createLink).mockResolvedValue({
        id: "link-002",
        childId: "child-001",
        parentId: "parent-002",
        relation: "Mother",
        createdAt: new Date(),
      });

      const result = await linkParent.execute("child-001", {
        parentId: "parent-002",
        relation: "Mother",
      });

      expect(result.relation).toBe("Mother");
    });

    it("should reject duplicate Father link (BR-010)", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findParentById).mockResolvedValue(mockParent);
      vi.mocked(childRepo.findLinkByChildAndRelation).mockResolvedValue({
        id: "existing-link",
        childId: "child-001",
        parentId: "parent-001",
        relation: "Father",
        createdAt: new Date(),
      });

      await expect(
        linkParent.execute("child-001", {
          parentId: "parent-001",
          relation: "Father",
        })
      ).rejects.toThrow("already has a Father linked");
    });

    it("should reject duplicate Mother link (BR-010)", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findParentById).mockResolvedValue(mockParent2);
      vi.mocked(childRepo.findLinkByChildAndRelation).mockResolvedValue({
        id: "existing-link",
        childId: "child-001",
        parentId: "parent-002",
        relation: "Mother",
        createdAt: new Date(),
      });

      await expect(
        linkParent.execute("child-001", {
          parentId: "parent-002",
          relation: "Mother",
        })
      ).rejects.toThrow("already has a Mother linked");
    });

    it("should reject duplicate parent link to same child", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findParentById).mockResolvedValue(mockParent);
      vi.mocked(childRepo.findLinkByChildAndRelation).mockResolvedValue(null);
      vi.mocked(childRepo.findLinkByChildAndParent).mockResolvedValue({
        id: "existing-link",
        childId: "child-001",
        parentId: "parent-001",
        relation: "Father",
        createdAt: new Date(),
      });

      await expect(
        linkParent.execute("child-001", {
          parentId: "parent-001",
          relation: "Father",
        })
      ).rejects.toThrow("already linked to child");
    });

    it("should throw ChildNotFoundError for non-existent child", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(null);

      await expect(
        linkParent.execute("non-existent", {
          parentId: "parent-001",
          relation: "Father",
        })
      ).rejects.toThrow(ChildNotFoundError);
    });
  });

  describe("Child-Parent Unlinking", () => {
    let childRepo: ChildRepository;
    let unlinkParent: UnlinkParentUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      unlinkParent = new UnlinkParentUseCase(childRepo);
    });

    it("should unlink parent from child", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findLinkByChildAndParent).mockResolvedValue({
        id: "link-001",
        childId: "child-001",
        parentId: "parent-001",
        relation: "Father",
        createdAt: new Date(),
      });
      vi.mocked(childRepo.deleteLink).mockResolvedValue();

      await unlinkParent.execute("child-001", "parent-001");

      expect(childRepo.deleteLink).toHaveBeenCalledWith("link-001");
    });

    it("should throw ChildNotFoundError for non-existent child", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(null);

      await expect(unlinkParent.execute("non-existent", "parent-001")).rejects.toThrow(
        ChildNotFoundError
      );
    });

    it("should throw error for non-existent link", async () => {
      vi.mocked(childRepo.findById).mockResolvedValue(mockChild);
      vi.mocked(childRepo.findLinkByChildAndParent).mockResolvedValue(null);

      await expect(unlinkParent.execute("child-001", "non-existent-parent")).rejects.toThrow(
        "No link found between child"
      );
    });
  });

  describe("Parent Listing by Child", () => {
    let childRepo: ChildRepository;

    beforeEach(() => {
      childRepo = createMockChildRepo();
    });

    it("should list parents for a child", async () => {
      vi.mocked(childRepo.findParentsByChild).mockResolvedValue([
        { ...mockParent, relation: "Father", childParentId: "link-001" },
        { ...mockParent2, relation: "Mother", childParentId: "link-002" },
      ]);

      const result = await childRepo.findParentsByChild("child-001");

      expect(result).toHaveLength(2);
      expect(result[0].relation).toBe("Father");
      expect(result[1].relation).toBe("Mother");
    });

    it("should return empty array for child with no parents", async () => {
      vi.mocked(childRepo.findParentsByChild).mockResolvedValue([]);

      const result = await childRepo.findParentsByChild("child-no-parents");

      expect(result).toHaveLength(0);
    });
  });

  describe("Sibling Association", () => {
    let childRepo: ChildRepository;

    beforeEach(() => {
      childRepo = createMockChildRepo();
    });

    it("should find siblings via shared parent", async () => {
      vi.mocked(childRepo.findByParent).mockResolvedValue([mockChild, mockChild2]);

      const result = await childRepo.findByParent("parent-001");

      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe("Kidist Mulugeta");
      expect(result[1].fullName).toBe("Selam Mulugeta");
    });
  });

  describe("Child Listing & Pagination", () => {
    let childRepo: ChildRepository;
    let listChildren: ListChildrenUseCase;

    beforeEach(() => {
      childRepo = createMockChildRepo();
      listChildren = new ListChildrenUseCase(childRepo);
    });

    it("should list children with pagination", async () => {
      vi.mocked(childRepo.findMany).mockResolvedValue({
        success: true,
        data: [mockChild, mockChild2],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
      });

      const result = await listChildren.execute({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });
  });
});
