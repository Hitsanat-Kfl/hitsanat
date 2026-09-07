import type { Child } from "@repo/domain";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../../domain/repositories/child.repository.js";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

export class ListChildrenUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<Child>> {
    return this.childRepository.findMany(params);
  }
}
