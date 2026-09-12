import type { Child } from "@repo/domain";
import { ChildNotFoundError } from "../../domain/errors/child.error.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

export class GetChildDetailUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(childId: string): Promise<Child> {
    const child = await this.childRepository.findById(childId);
    if (!child) {
      throw new ChildNotFoundError(childId);
    }
    return child;
  }
}
