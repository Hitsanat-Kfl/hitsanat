import type {
  CreateEntity,
  Member,
  PaginatedResponse,
  PaginationParams,
  UpdateEntity,
} from "@repo/schemas";

/**
 * Member repository interface
 * Defines the contract for member data access
 */
export interface MemberRepository {
  /**
   * Find a member by ID
   */
  findById(id: string): Promise<Member | null>;

  /**
   * Find a member by phone number
   */
  findByPhoneNumber(phoneNumber: string): Promise<Member | null>;

  /**
   * Find many members with pagination, search, and filters
   */
  findMany(
    params: PaginationParams & {
      subDept?: string;
      familyId?: string;
      yearOfStudy?: string;
      isActive?: string;
    }
  ): Promise<PaginatedResponse<Member>>;

  /**
   * Create a new member
   */
  create(data: CreateEntity<Member>): Promise<Member>;

  /**
   * Update an existing member
   */
  update(id: string, data: UpdateEntity<Member>): Promise<Member>;

  /**
   * Delete a member
   */
  delete(id: string): Promise<void>;

  /**
   * Find members by sub-department
   */
  findBySubDepartment(subDepartmentId: string): Promise<Member[]>;

  /**
   * Find members by family
   */
  findByFamily(familyId: string): Promise<Member[]>;

  /**
   * Find active members
   */
  findActive(): Promise<Member[]>;

  /**
   * Count active members
   */
  countActive(): Promise<number>;
}
