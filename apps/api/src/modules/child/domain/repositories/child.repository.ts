import type { Child, ChildParent, Parent } from "@repo/domain";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ParentWithRelation extends Parent {
  relation: "Father" | "Mother";
  childParentId: string;
}

export interface ChildRepository {
  findById(id: string): Promise<Child | null>;
  findMany(params: PaginationParams): Promise<PaginatedResponse<Child>>;
  create(data: Omit<Child, "id" | "createdAt">): Promise<Child>;
  update(id: string, data: Partial<Omit<Child, "id" | "createdAt">>): Promise<Child>;
  delete(id: string): Promise<void>;
  findByParent(parentId: string): Promise<Child[]>;
  findActive(): Promise<Child[]>;
  findActiveByBirthdayMonth(month: number): Promise<Child[]>;

  // Parent CRUD
  createParent(data: Omit<Parent, "id" | "createdAt">): Promise<Parent>;
  findAllParents(): Promise<Parent[]>;
  findParentById(id: string): Promise<Parent | null>;

  // Child-Parent linking
  findLinkByChildAndRelation(childId: string, relation: string): Promise<ChildParent | null>;
  findLinkByChildAndParent(childId: string, parentId: string): Promise<ChildParent | null>;
  createLink(data: { childId: string; parentId: string; relation: string }): Promise<ChildParent>;
  deleteLink(id: string): Promise<void>;
  findLinkById(id: string): Promise<ChildParent | null>;
  findParentsByChild(childId: string): Promise<ParentWithRelation[]>;
}
