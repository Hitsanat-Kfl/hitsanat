import type { Family } from "../entities/family.entity.js";

export interface FamilyRepository {
  findById(id: string): Promise<Family | null>;
  findMany(params: { page?: number; limit?: number; search?: string }): Promise<{
    success: boolean;
    data: Family[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>;
  create(data: Omit<Family, "id" | "createdAt">): Promise<Family>;
  update(id: string, data: Partial<Omit<Family, "id" | "createdAt">>): Promise<Family>;
  delete(id: string): Promise<void>;
}
