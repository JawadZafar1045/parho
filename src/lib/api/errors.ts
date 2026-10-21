export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code = "INTERNAL_ERROR",
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", options?: ErrorOptions) {
    super(message, 400, "VALIDATION_ERROR", options);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", options?: ErrorOptions) {
    super(message, 401, "UNAUTHORIZED", options);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You are not allowed to perform this action", options?: ErrorOptions) {
    super(message, 403, "FORBIDDEN", options);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", options?: ErrorOptions) {
    super(message, 404, "NOT_FOUND", options);
    this.name = "NotFoundError";
  }
}
