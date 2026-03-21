// apps/gov-api/src/http/problem-details.ts

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export function createProblemDetails(input: ProblemDetails): ProblemDetails {
  return input;
}

export function badRequestProblem(
  detail: string,
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/bad-request",
    title: "Bad request",
    status: 400,
    detail,
    code: "bad_request",
    ...options,
  };
}

export function unauthorizedProblem(
  detail = "Authentication required.",
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/unauthorized",
    title: "Unauthorized",
    status: 401,
    detail,
    code: "unauthorized",
    ...options,
  };
}

export function forbiddenProblem(
  detail = "You do not have authority to perform this action.",
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/forbidden",
    title: "Forbidden",
    status: 403,
    detail,
    code: "forbidden",
    ...options,
  };
}

export function notFoundProblem(
  detail = "The requested resource was not found.",
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/not-found",
    title: "Not found",
    status: 404,
    detail,
    code: "not_found",
    ...options,
  };
}

export function conflictProblem(
  detail: string,
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/conflict",
    title: "Conflict",
    status: 409,
    detail,
    code: "conflict",
    ...options,
  };
}

export function validationProblem(
  detail: string,
  errors: Record<string, string[]>,
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/validation-error",
    title: "Validation error",
    status: 422,
    detail,
    code: "validation_error",
    errors,
    ...options,
  };
}

export function internalServerProblem(
  detail = "An unexpected server error occurred.",
  options?: Partial<ProblemDetails>,
): ProblemDetails {
  return {
    type: "https://gov-api.ardtiresociety.org/problems/internal-server-error",
    title: "Internal server error",
    status: 500,
    detail,
    code: "internal_server_error",
    ...options,
  };
}