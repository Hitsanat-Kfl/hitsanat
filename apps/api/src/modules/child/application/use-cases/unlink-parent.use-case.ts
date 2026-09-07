import type { ChildRepository } from "../../domain/repositories/child.repository.js";
import { ChildNotFoundError } from "../../domain/errors/child.error.js";

export class UnlinkParentUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(childId: string, parentId: string): Promise<void> {
    const child = await this.childRepository.findById(childId);
    if (!child) {
      throw new ChildNotFoundError(childId);
    }

    const link = await this.childRepository.findLinkByChildAndParent(childId, parentId);
    if (!link) {
      throw new Error(`No link found between child ${childId} and parent ${parentId}`);
    }

    await this.childRepository.deleteLink(link.id);
  }
}
