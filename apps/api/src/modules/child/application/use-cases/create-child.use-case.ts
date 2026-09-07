import type { Child, CollectionLocation, Gender, KutrGroup } from "@repo/domain";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";
import { ChildAlreadyExistsError } from "../../domain/errors/child.error.js";

// TODO Israel: Add Zod validation using childRegistrationSchema from @repo/validation
// Validate req.body before passing to repository. Return 400 on validation failure.

export class CreateChildUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(data: {
    fullName: string;
    christianName: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    kutrGroup: string;
    collectionLocation: string;
    photoUrl?: string;
  }): Promise<Child> {
    return this.childRepository.create({
      fullName: data.fullName,
      christianName: data.christianName,
      gender: data.gender as Gender,
      dateOfBirth: new Date(data.dateOfBirth),
      address: data.address,
      kutrGroup: data.kutrGroup as KutrGroup,
      collectionLocation: data.collectionLocation as CollectionLocation,
      photoUrl: data.photoUrl ?? undefined,
      isActive: true,
    });
  }
}
