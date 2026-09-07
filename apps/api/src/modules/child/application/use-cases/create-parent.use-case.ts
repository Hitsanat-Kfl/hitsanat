import type { Parent } from "@repo/domain";
import type { ChildRepository } from "../../domain/repositories/child.repository.js";

// TODO Israel: Add Zod validation using parentSchema from @repo/validation
// Validate req.body before passing to repository. Return 400 on validation failure.

export class CreateParentUseCase {
  constructor(private readonly childRepository: ChildRepository) {}

  async execute(data: {
    fullName: string;
    phoneNumber: string;
    secondaryPhone?: string;
    address: string;
    occupation?: string;
    notes?: string;
  }): Promise<Parent> {
    return this.childRepository.createParent({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      secondaryPhone: data.secondaryPhone,
      address: data.address,
      occupation: data.occupation,
      notes: data.notes,
    });
  }
}
