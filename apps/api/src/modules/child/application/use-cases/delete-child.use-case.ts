import { ChildNotFoundError } from "../../domain/errors/child.error.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

export class DeleteChildUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(childId: string): Promise<void> {
    const existing = await this.childRepository.findById(childId);
    if (!existing) {
      throw new ChildNotFoundError(childId);
    }
    return this.childRepository.delete(childId);
  }
}
