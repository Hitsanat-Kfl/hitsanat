import type { Parent } from "@repo/domain";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

export class ListAllParentsUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(): Promise<Parent[]> {
    return this.childRepository.findAllParents();
  }
}
