# Module Structure Template

## Directory Structure

Each domain module follows this structure:

```
modules/<module>/
├── domain/
│   ├── entities/
│   │   └── <entity>.ts          # Domain entity interfaces
│   ├── value-objects/
│   │   └── <value-object>.ts    # Value objects (optional)
│   ├── repositories/
│   │   └── <repository>.ts      # Repository interface
│   └── errors/
│       └── <domain-error>.ts    # Domain-specific errors
├── application/
│   ├── use-cases/
│   │   ├── <use-case>.ts        # Business logic use cases
│   │   └── <use-case>.test.ts   # Unit tests for use cases
│   └── dto/
│       ├── <request-dto>.ts     # Request DTOs
│       └── <response-dto>.ts    # Response DTOs
├── infrastructure/
│   ├── repositories/
│   │   └── <repository-impl>.ts # Repository implementation
│   └── database/
│       └── <table>.ts           # Drizzle table definitions
└── presentation/
    ├── routes/
    │   └── <module>.routes.ts   # Express routes
    ├── controllers/
    │   └── <module>.controller.ts # Request handlers
    └── validators/
        └── <module>.validator.ts # Zod validation schemas
```

## Example: Members Module

### Domain Layer

#### Entity (domain/entities/member.ts)
```typescript
import type { Member } from "@repo/schemas";

export interface MemberEntity extends Member {
  // Additional domain methods can be added here
  getDisplayName(): string;
  isEligibleForLeadership(): boolean;
}
```

#### Repository Interface (domain/repositories/member.repository.ts)
```typescript
import type { Member, CreateEntity, UpdateEntity, PaginationParams, PaginatedResponse } from "@repo/schemas";

export interface MemberRepository {
  findById(id: string): Promise<Member | null>;
  findByPhoneNumber(phoneNumber: string): Promise<Member | null>;
  findMany(params: PaginationParams): Promise<PaginatedResponse<Member>>;
  create(data: CreateEntity<Member>): Promise<Member>;
  update(id: string, data: UpdateEntity<Member>): Promise<Member>;
  delete(id: string): Promise<void>;
  findBySubDepartment(subDepartmentId: string): Promise<Member[]>;
  findByFamily(familyId: string): Promise<Member[]>;
}
```

#### Domain Errors (domain/errors/member.error.ts)
```typescript
export class MemberNotFoundError extends Error {
  constructor(memberId: string) {
    super(`Member not found: ${memberId}`);
    this.name = "MemberNotFoundError";
  }
}

export class MemberAlreadyExistsError extends Error {
  constructor(phoneNumber: string) {
    super(`Member already exists with phone: ${phoneNumber}`);
    this.name = "MemberAlreadyExistsError";
  }
}

export class InvalidMemberDataError extends Error {
  constructor(message: string) {
    super(`Invalid member data: ${message}`);
    this.name = "InvalidMemberDataError";
  }
}
```

### Application Layer

#### Use Case (application/use-cases/create-member.use-case.ts)
```typescript
import type { MemberRepository } from "../domain/repositories/member.repository";
import type { CreateEntity, Member } from "@repo/schemas";
import { MemberAlreadyExistsError } from "../domain/errors/member.error";

export class CreateMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(data: CreateEntity<Member>): Promise<Member> {
    // Check if member already exists
    const existingMember = await this.memberRepository.findByPhoneNumber(data.phoneNumber);
    if (existingMember) {
      throw new MemberAlreadyExistsError(data.phoneNumber);
    }

    // Create member
    const member = await this.memberRepository.create(data);
    return member;
  }
}
```

#### DTOs (application/dto/create-member.dto.ts)
```typescript
import { z } from "zod";
import { memberStage1Schema } from "@repo/schemas";

export type CreateMemberDto = z.infer<typeof memberStage1Schema>;
export const createMemberDto = memberStage1Schema;
```

### Infrastructure Layer

#### Repository Implementation (infrastructure/repositories/member.repository.ts)
```typescript
import { eq, like, desc, asc } from "drizzle-orm";
import { db } from "@repo/database";
import { members } from "@repo/database/schema";
import type { MemberRepository } from "../../domain/repositories/member.repository";
import type { Member, CreateEntity, UpdateEntity, PaginationParams, PaginatedResponse } from "@repo/schemas";

export class MemberRepositoryImpl implements MemberRepository {
  async findById(id: string): Promise<Member | null> {
    const result = await db.query.members.findFirst({
      where: eq(members.id, id),
    });
    return result || null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Member | null> {
    const result = await db.query.members.findFirst({
      where: eq(members.phoneNumber, phoneNumber),
    });
    return result || null;
  }

  async findMany(params: PaginationParams): Promise<PaginatedResponse<Member>> {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    let query = db.select().from(members);
    let countQuery = db.select({ count: count() }).from(members);

    if (search) {
      const searchCondition = like(members.fullName, `%${search}%`);
      query = query.where(searchCondition);
      countQuery = countQuery.where(searchCondition);
    }

    const [data, countResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(asc(members.fullName)),
      countQuery,
    ]);

    const total = countResult[0]?.count || 0;

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateEntity<Member>): Promise<Member> {
    const result = await db.insert(members).values(data).returning();
    return result[0];
  }

  async update(id: string, data: UpdateEntity<Member>): Promise<Member> {
    const result = await db
      .update(members)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  async findBySubDepartment(subDepartmentId: string): Promise<Member[]> {
    // Implementation for finding members by sub-department
    // This would involve a join with sub_department_members table
    return [];
  }

  async findByFamily(familyId: string): Promise<Member[]> {
    // Implementation for finding members by family
    // This would involve a join with family_members table
    return [];
  }
}
```

### Presentation Layer

#### Routes (presentation/routes/member.routes.ts)
```typescript
import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { requireAuth } from "../../../shared/middleware/auth.middleware";
import { requirePermission } from "../../../shared/middleware/permission.middleware";
import { ResourceType, ActionType } from "@repo/schemas";

const router = Router();
const memberController = new MemberController();

// Public routes
router.get("/", memberController.getMembers);
router.get("/:id", memberController.getMemberById);

// Protected routes
router.post(
  "/stage-1",
  requireAuth,
  requirePermission(ResourceType.MEMBERS, ActionType.CREATE),
  memberController.createMemberStage1
);

router.put(
  "/:id/stage-2",
  requireAuth,
  requirePermission(ResourceType.MEMBERS, ActionType.UPDATE),
  memberController.updateMemberStage2
);

router.post(
  "/:id/roles",
  requireAuth,
  requirePermission(ResourceType.MEMBERS, ActionType.UPDATE),
  memberController.assignMemberRoles
);

export default router;
```

#### Controller (presentation/controllers/member.controller.ts)
```typescript
import { Request, Response } from "express";
import { CreateMemberUseCase } from "../../application/use-cases/create-member.use-case";
import { MemberRepositoryImpl } from "../../infrastructure/repositories/member.repository";
import { createMemberDto } from "../../application/dto/create-member.dto";

const memberRepository = new MemberRepositoryImpl();
const createMemberUseCase = new CreateMemberUseCase(memberRepository);

export class MemberController {
  async getMembers(req: Request, res: Response) {
    // Implementation
  }

  async getMemberById(req: Request, res: Response) {
    // Implementation
  }

  async createMemberStage1(req: Request, res: Response) {
    try {
      const dto = createMemberDto.parse(req.body);
      const member = await createMemberUseCase.execute(dto);
      res.status(201).json({ success: true, data: member });
    } catch (error) {
      // Handle validation errors and domain errors
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateMemberStage2(req: Request, res: Response) {
    // Implementation
  }

  async assignMemberRoles(req: Request, res: Response) {
    // Implementation
  }
}
```

#### Validator (presentation/validators/member.validator.ts)
```typescript
import { z } from "zod";
import { memberStage1Schema, memberStage2Schema } from "@repo/schemas";

export const memberValidator = {
  createStage1: memberStage1Schema,
  updateStage2: memberStage2Schema,
};
```

## Module Registration

### In apps/api/src/app.ts
```typescript
import memberRoutes from "./modules/member/presentation/routes/member.routes";
import familyRoutes from "./modules/family/presentation/routes/family.routes";
import childRoutes from "./modules/child/presentation/routes/child.routes";
// ... other module imports

const app = express();

// Mount routes
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/families", familyRoutes);
app.use("/api/v1/children", childRoutes);
// ... other routes
```

## Key Principles

1. **Dependency Rule**: Dependencies point inward (presentation → application → domain).
2. **Repository Pattern**: Domain defines interfaces, infrastructure implements them.
3. **Use Cases**: Business logic lives in application layer.
4. **DTOs**: Request/response validation at presentation layer.
5. **Error Handling**: Domain errors are thrown by use cases, caught by controllers.