import type { SubDepartment, SubDepartmentMember } from "../entities/sub-department.entity.js";

export interface SubDepartmentRepository {
  findAll(): Promise<SubDepartment[]>;
  findByCode(code: string): Promise<SubDepartment | null>;
  findRoster(subDepartmentId: string): Promise<SubDepartmentMember[]>;
}
