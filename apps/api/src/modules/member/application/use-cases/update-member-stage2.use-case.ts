import { and, eq, getDb } from "@repo/database";
import { subDepartmentMembers, familyMembers } from "@repo/database/schema";
import type { Member } from "@repo/domain";
import type { MemberRepository } from "../../domain/repositories/member.repository.js";
import {
  MemberNotFoundError,
  MemberAlreadyInSubDepartmentError,
} from "../../domain/errors/member.error.js";

/**
 * Update Member Stage 2 Use Case
 * Enriches member profile with sub-department assignments, family link, photo, telegram
 */
export class UpdateMemberStage2UseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(
    memberId: string,
    data: {
      subDepartmentIds: string[];
      familyId?: string;
      photoUrl?: string;
      telegramUsername?: string;
    }
  ): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }

    const db = getDb();

    // Update member profile fields
    await this.memberRepository.update(memberId, {
      photoUrl: data.photoUrl ?? member.photoUrl,
      telegramUsername: data.telegramUsername ?? member.telegramUsername,
    });

    // Assign sub-departments (create join records)
    for (const subDeptId of data.subDepartmentIds) {
      const existing = await db.query.subDepartmentMembers.findFirst({
        where: and(
          eq(subDepartmentMembers.memberId, memberId),
          eq(subDepartmentMembers.subDepartmentId, subDeptId)
        ),
      });

      if (existing) {
        throw new MemberAlreadyInSubDepartmentError(memberId, subDeptId);
      }

      await db.insert(subDepartmentMembers).values({
        memberId,
        subDepartmentId: subDeptId,
        role: "MEMBER",
      });
    }

    // Assign family if provided
    if (data.familyId) {
      // Remove from old family if exists
      const oldFamilyLink = await db.query.familyMembers.findFirst({
        where: eq(familyMembers.memberId, memberId),
      });
      if (oldFamilyLink) {
        await db.delete(familyMembers).where(eq(familyMembers.id, oldFamilyLink.id));
      }

      await db.insert(familyMembers).values({
        familyId: data.familyId,
        memberId,
      });
    }

    // Return updated member
    const updated = await this.memberRepository.findById(memberId);
    if (!updated) {
      throw new MemberNotFoundError(memberId);
    }
    return updated;
  }
}
