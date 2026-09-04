/**
 * Member domain errors
 */

export class MemberNotFoundError extends Error {
  constructor(memberId: string) {
    super(`Member not found: ${memberId}`);
    this.name = "MemberNotFoundError";
  }
}

export class MemberAlreadyExistsError extends Error {
  constructor(phoneNumber: string) {
    super(`Member already exists with phone: ${phoneNumber}`);
    this.name = "MemberAlreadyExistsError";
  }
}

export class InvalidMemberDataError extends Error {
  constructor(message: string) {
    super(`Invalid member data: ${message}`);
    this.name = "InvalidMemberDataError";
  }
}

export class MemberNotActiveError extends Error {
  constructor(memberId: string) {
    super(`Member is not active: ${memberId}`);
    this.name = "MemberNotActiveError";
  }
}

export class MemberAlreadyInSubDepartmentError extends Error {
  constructor(memberId: string, subDepartmentId: string) {
    super(`Member ${memberId} is already in sub-department ${subDepartmentId}`);
    this.name = "MemberAlreadyInSubDepartmentError";
  }
}