import type { ParentWithRelation } from "../../domain/repositories/child.repository.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";
import { ChildNotFoundError } from "../../domain/errors/child.error.js";

export class ListParentsUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(childId: string): Promise<ParentWithRelation[]> {
    const child = await this.childRepository.findById(childId);
    if (!child) {
      throw new ChildNotFoundError(childId);
    }

    return this.childRepository.findParentsByChild(childId);
  }
}
