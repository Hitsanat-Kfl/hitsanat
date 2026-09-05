export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(`Validation error: ${message}`);
    this.name = "ValidationError";
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(rule: string) {
    super(`Business rule violation: ${rule}`);
    this.name = "BusinessRuleViolationError";
  }
}
