export class ChildNotFoundError extends Error {
  constructor(childId: string) {
    super(`Child not found: ${childId}`);
    this.name = "ChildNotFoundError";
  }
}

export class ChildAlreadyExistsError extends Error {
  constructor(fullName: string) {
    super(`Child already exists: ${fullName}`);
    this.name = "ChildAlreadyExistsError";
  }
}
