import type { Gender, Member, YearOfStudy } from "@repo/domain";
import { MemberNotFoundError } from "../../domain/errors/member.error.js";
import type { MemberRepository } from "../../domain/repositories/member.repository.js";

/**
 * Update Member Use Case
 * Updates member fields (Stage 2 enrichment or general update)
 */
export class UpdateMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(
    memberId: string,
    data: {
      fullName?: string;
      christianName?: string;
      phoneNumber?: string;
      yearOfStudy?: string;
      academicDepartment?: string;
      campus?: string;
      gender?: string;
      photoUrl?: string | null;
      telegramUsername?: string | null;
      isActive?: boolean;
    }
  ): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }

    if (data.phoneNumber && data.phoneNumber !== member.phoneNumber) {
      const existing = await this.memberRepository.findByPhoneNumber(data.phoneNumber);
      if (existing) {
        throw new Error(`Phone number ${data.phoneNumber} is already in use`);
      }
    }

    return this.memberRepository.update(memberId, {
      ...data,
      yearOfStudy: data.yearOfStudy ? (data.yearOfStudy as YearOfStudy) : undefined,
      gender: data.gender ? (data.gender as Gender) : undefined,
    });
  }
}
