/**
 * RFC 7807 Problem Details for HTTP APIs
 * Standardized error response format
 */

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly type: string;
  public readonly errors?: Record<string, string[]>;

  constructor(
    status: number,
    title: string,
    detail?: string,
    type?: string,
    errors?: Record<string, string[]>
  ) {
    super(detail || title);
    this.name = "ApiError";
    this.status = status;
    this.type = type || `https://hitsanat.kfl/errors/${status}`;
    this.errors = errors;
  }

  toProblemDetail(): ProblemDetail {
    return {
      type: this.type,
      title: this.message,
      status: this.status,
      detail: this.stack,
      errors: this.errors,
    };
  }

  static badRequest(detail?: string, errors?: Record<string, string[]>): ApiError {
    return new ApiError(400, "Bad Request", detail, undefined, errors);
  }

  static unauthorized(detail?: string): ApiError {
    return new ApiError(401, "Unauthorized", detail);
  }

  static forbidden(detail?: string): ApiError {
    return new ApiError(403, "Forbidden", detail);
  }

  static notFound(resource?: string): ApiError {
    return new ApiError(404, "Not Found", resource ? `${resource} not found` : undefined);
  }

  static conflict(detail?: string): ApiError {
    return new ApiError(409, "Conflict", detail);
  }

  static validationError(errors: Record<string, string[]>): ApiError {
    return new ApiError(422, "Validation Error", "Request validation failed", undefined, errors);
  }

  static tooManyRequests(detail?: string): ApiError {
    return new ApiError(429, "Too Many Requests", detail);
  }

  static internalServerError(detail?: string): ApiError {
    return new ApiError(500, "Internal Server Error", detail);
  }
}
