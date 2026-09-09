import type { Family } from "../../domain/entities/family.entity.js";
import type { FamilyRepository } from "../../domain/repositories/family.repository.js";

export class CreateFamilyUseCase {
  constructor(private readonly familyRepository: FamilyRepository) {}

  async execute(data: {
    familyName: string;
    fatherMemberId?: string;
    motherMemberId?: string;
    academicYear: string;
  }): Promise<Family> {
    return this.familyRepository.create({
      familyName: data.familyName,
      fatherMemberId: data.fatherMemberId ?? null,
      motherMemberId: data.motherMemberId ?? null,
      academicYear: data.academicYear,
    });
  }
}
