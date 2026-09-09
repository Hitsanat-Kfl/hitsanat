import type { FamilyRepository } from "../../domain/repositories/family.repository.js";

export class ListFamiliesUseCase {
  constructor(private readonly familyRepository: FamilyRepository) {}

  async execute(params: { page?: number; limit?: number; search?: string }) {
    return this.familyRepository.findMany(params);
  }
}
