// apps/gov-api/src/http/errors.ts

import type { ProblemDetails } from "./problem-details";
import {
  badRequestProblem,
  conflictProblem,
  forbiddenProblem,
  internalServerProblem,
  notFoundProblem,
  unauthorizedProblem,
  validationProblem,
} from "./problem-details";

export class HttpProblemError extends Error {
  public readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
    this.name = "HttpProblemError";
    this.problem = problem;
  }
}

export class BadRequestError extends HttpProblemError {
  constructor(detail: string, extra?: Partial<ProblemDetails>) {
    super(badRequestProblem(detail, extra));
  }
}

export class UnauthorizedError extends HttpProblemError {
  constructor(detail = "Authentication required.", extra?: Partial<ProblemDetails>) {
    super(unauthorizedProblem(detail, extra));
  }
}

export class ForbiddenError extends HttpProblemError {
  constructor(
    detail = "You do not have authority to perform this action.",
    extra?: Partial<ProblemDetails>,
  ) {
    super(forbiddenProblem(detail, extra));
  }
}

export class NotFoundError extends HttpProblemError {
  constructor(detail = "The requested resource was not found.", extra?: Partial<ProblemDetails>) {
    super(notFoundProblem(detail, extra));
  }
}

export class ConflictError extends HttpProblemError {
  constructor(detail: string, extra?: Partial<ProblemDetails>) {
    super(conflictProblem(detail, extra));
  }
}

export class ValidationError extends HttpProblemError {
  constructor(
    detail: string,
    errors: Record<string, string[]>,
    extra?: Partial<ProblemDetails>,
  ) {
    super(validationProblem(detail, errors, extra));
  }
}

export class InternalServerError extends HttpProblemError {
  constructor(detail = "An unexpected server error occurred.", extra?: Partial<ProblemDetails>) {
    super(internalServerProblem(detail, extra));
  }
}