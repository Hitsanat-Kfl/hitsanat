import type { Child } from "@repo/domain";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

export class GetBirthdayMonthUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(month: number): Promise<Child[]> {
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12");
    }
    return this.childRepository.findActiveByBirthdayMonth(month);
  }
}
