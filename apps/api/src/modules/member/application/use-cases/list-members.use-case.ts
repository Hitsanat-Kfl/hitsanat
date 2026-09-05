import type { Member } from "@repo/domain";
import type { PaginatedResponse, PaginationParams } from "@repo/schemas";
import type { MemberRepository } from "../../domain/repositories/member.repository.js";

/**
 * List Members Use Case
 * Returns paginated list of members with search
 */
export class ListMembersUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<Member>> {
    return this.memberRepository.findMany(params);
  }
}
