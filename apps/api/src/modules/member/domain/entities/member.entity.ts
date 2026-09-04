import type { Member } from "@repo/schemas";

/**
 * Member entity interface
 * Extends the base Member type with domain-specific methods
 */
export interface MemberEntity extends Member {
  /**
   * Get display name for the member
   */
  getDisplayName(): string;

  /**
   * Check if member is eligible for leadership positions
   */
  isEligibleForLeadership(): boolean;

  /**
   * Get years of service in the ministry
   */
  getYearsOfService(): number;
}

/**
 * Create a MemberEntity from a raw Member object
 */
export function createMemberEntity(member: Member): MemberEntity {
  return {
    ...member,
    getDisplayName() {
      return `${this.christianName} (${this.fullName})`;
    },
    isEligibleForLeadership() {
      return this.isActive && this.yearOfStudy !== "GC";
    },
    getYearsOfService() {
      const now = new Date();
      const joined = new Date(this.dateJoined);
      return now.getFullYear() - joined.getFullYear();
    },
  };
}