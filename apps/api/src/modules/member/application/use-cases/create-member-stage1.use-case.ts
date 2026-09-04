import type { MemberRepository } from "../../domain/repositories/member.repository.js";
import type { CreateEntity, Member } from "@repo/schemas";
import { MemberAlreadyExistsError } from "../../domain/errors/member.error.js";

/**
 * Create Member Stage 1 Use Case
 * Fast initial member creation by Secretary
 */
export class CreateMemberStage1UseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(data: CreateEntity<Member>): Promise<Member> {
    // Check if member already exists with this phone number
    const existingMember = await this.memberRepository.findByPhoneNumber(data.phoneNumber);
    if (existingMember) {
      throw new MemberAlreadyExistsError(data.phoneNumber);
    }

    // Create member with default values
    const memberData: CreateEntity<Member> = {
      ...data,
      isActive: true,
      dateJoined: new Date(),
    };

    const member = await this.memberRepository.create(memberData);
    return member;
  }
}
