import type { ChildParent } from "@repo/domain";
import { ChildNotFoundError } from "../../domain/errors/child.error.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

// TODO Israel: Add Zod validation using childParentLinkSchema from @repo/validation
// Validate { parentId, relation } before executing. Return 400 on validation failure.

export class LinkParentUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(
    childId: string,
    data: { parentId: string; relation: "Father" | "Mother" }
  ): Promise<ChildParent> {
    const child = await this.childRepository.findById(childId);
    if (!child) {
      throw new ChildNotFoundError(childId);
    }

    const parent = await this.childRepository.findParentById(data.parentId);
    if (!parent) {
      throw new Error(`Parent not found: ${data.parentId}`);
    }

    // BR-010: Max 1 Father, 1 Mother per child
    const existingRelation = await this.childRepository.findLinkByChildAndRelation(
      childId,
      data.relation
    );
    if (existingRelation) {
      throw new Error(`Child ${childId} already has a ${data.relation} linked`);
    }

    // Check duplicate parent link
    const existingParentLink = await this.childRepository.findLinkByChildAndParent(
      childId,
      data.parentId
    );
    if (existingParentLink) {
      throw new Error(`Parent ${data.parentId} is already linked to child ${childId}`);
    }

    return this.childRepository.createLink({
      childId,
      parentId: data.parentId,
      relation: data.relation,
    });
  }
}
