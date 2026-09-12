import type { Child, CollectionLocation, KutrGroup } from "@repo/domain";
import { ChildNotFoundError } from "../../domain/errors/child.error.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

// BR-012: Kutr group constrained to 'Kutr 1' or 'Kutr 2'
// BR-013: Collection location constrained to 5 routes

export class ReclassifyChildUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(
    childId: string,
    data: { kutrGroup?: string; collectionLocation?: string }
  ): Promise<Child> {
    const existing = await this.childRepository.findById(childId);
    if (!existing) {
      throw new ChildNotFoundError(childId);
    }

    const updateData: Record<string, unknown> = {};
    if (data.kutrGroup !== undefined) {
      updateData.kutrGroup = data.kutrGroup as KutrGroup;
    }
    if (data.collectionLocation !== undefined) {
      updateData.collectionLocation = data.collectionLocation as CollectionLocation;
    }

    return this.childRepository.update(childId, updateData);
  }
}
