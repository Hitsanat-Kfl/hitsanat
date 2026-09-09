import type { Member } from "@repo/domain";
import type { MemberRepository } from "../../domain/repositories/member.repository.js";
import { MemberNotFoundError } from "../../domain/errors/member.error.js";

/**
 * Get Member Detail Use Case
 * Returns single member by ID
 */
export class GetMemberDetailUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(memberId: string): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    return member;
  }
}
