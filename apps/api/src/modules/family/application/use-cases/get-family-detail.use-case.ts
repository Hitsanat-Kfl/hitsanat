import type { Family } from "../../domain/entities/family.entity.js";
import { FamilyNotFoundError } from "../../domain/errors/family.error.js";
import type { FamilyRepository } from "../../domain/repositories/family.repository.js";

export class GetFamilyDetailUseCase {
  constructor(private readonly familyRepository: FamilyRepository) {}

  async execute(familyId: string): Promise<Family> {
    const family = await this.familyRepository.findById(familyId);
    if (!family) {
      throw new FamilyNotFoundError(familyId);
    }
    return family;
  }
}
