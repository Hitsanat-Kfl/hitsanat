import { Gender, YearOfStudy, type Member } from "@repo/domain";
import type { MemberRepository } from "../../domain/repositories/member.repository.js";
import { MemberAlreadyExistsError } from "../../domain/errors/member.error.js";

/**
 * Create Member Stage 1 Use Case
 * Fast initial member creation by Secretary
 */
export class CreateMemberStage1UseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(data: {
    fullName: string;
    christianName: string;
    phoneNumber: string;
    yearOfStudy: string;
    academicDepartment: string;
    campus: string;
    gender: string;
  }): Promise<Member> {
    const existingMember = await this.memberRepository.findByPhoneNumber(
      data.phoneNumber
    );
    if (existingMember) {
      throw new MemberAlreadyExistsError(data.phoneNumber);
    }

    const member = await this.memberRepository.create({
      fullName: data.fullName,
      christianName: data.christianName,
      phoneNumber: data.phoneNumber,
      yearOfStudy: data.yearOfStudy as YearOfStudy,
      academicDepartment: data.academicDepartment,
      campus: data.campus,
      gender: data.gender as Gender,
      isActive: true,
      dateJoined: new Date(),
    });

    return member;
  }
}
