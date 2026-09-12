import type { SubDepartmentMember } from "../../domain/entities/sub-department.entity.js";
import { SubDepartmentNotFoundError } from "../../domain/errors/sub-department.error.js";
import type { SubDepartmentRepository } from "../../domain/repositories/sub-department.repository.js";

export class GetSubDepartmentRosterUseCase {
  constructor(private readonly repo: SubDepartmentRepository) {}

  async execute(subDepartmentId: string): Promise<SubDepartmentMember[]> {
    const subDept = await this.repo.findByCode(subDepartmentId);
    if (!subDept) {
      throw new SubDepartmentNotFoundError(subDepartmentId);
    }
    return this.repo.findRoster(subDept.id);
  }
}
