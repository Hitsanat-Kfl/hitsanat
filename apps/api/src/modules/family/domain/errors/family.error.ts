export class FamilyNotFoundError extends Error {
  constructor(familyId: string) {
    super(`Family not found: ${familyId}`);
    this.name = "FamilyNotFoundError";
  }
}

export class FamilyAlreadyExistsError extends Error {
  constructor(familyName: string) {
    super(`Family already exists with name: ${familyName}`);
    this.name = "FamilyAlreadyExistsError";
  }
}
