import type { SubDepartment } from "../../domain/entities/sub-department.entity.js";
import type { SubDepartmentRepository } from "../../domain/repositories/sub-department.repository.js";

export class ListSubDepartmentsUseCase {
  constructor(private readonly repo: SubDepartmentRepository) {}

  async execute(): Promise<SubDepartment[]> {
    return this.repo.findAll();
  }
}
