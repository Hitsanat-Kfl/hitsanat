export class SubDepartmentNotFoundError extends Error {
  constructor(code: string) {
    super(`Sub-department not found: ${code}`);
    this.name = "SubDepartmentNotFoundError";
  }
}
