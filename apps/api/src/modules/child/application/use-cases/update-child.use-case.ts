import type { Child, CollectionLocation, Gender, KutrGroup } from "@repo/domain";
import { ChildNotFoundError } from "../../domain/errors/child.error.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

// TODO Israel: Add Zod validation using updateChildDto from @repo/validation
// Validate partial input before passing to repository. Return 400 on validation failure.

export class UpdateChildUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(
    childId: string,
    data: {
      fullName?: string;
      christianName?: string;
      gender?: string;
      dateOfBirth?: string;
      address?: string;
      kutrGroup?: string;
      collectionLocation?: string;
      photoUrl?: string;
      isActive?: boolean;
    }
  ): Promise<Child> {
    const existing = await this.childRepository.findById(childId);
    if (!existing) {
      throw new ChildNotFoundError(childId);
    }

    const updateData: Record<string, unknown> = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.christianName !== undefined) updateData.christianName = data.christianName;
    if (data.gender !== undefined) updateData.gender = data.gender as Gender;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.address !== undefined) updateData.address = data.address;
    if (data.kutrGroup !== undefined) updateData.kutrGroup = data.kutrGroup as KutrGroup;
    if (data.collectionLocation !== undefined)
      updateData.collectionLocation = data.collectionLocation as CollectionLocation;
    if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.childRepository.update(childId, updateData);
  }
}
