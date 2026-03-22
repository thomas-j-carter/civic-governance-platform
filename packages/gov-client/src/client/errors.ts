// FILE: packages/gov-client/src/client/errors.ts

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

export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}

export class GovApiError extends Error {
  public readonly status: number;
  public readonly problem: ProblemDetails;
  public readonly traceId?: string;

  constructor(problem: ProblemDetails) {
    super(problem.detail || problem.title);
    this.name = "GovApiError";
    this.status = problem.status;
    this.problem = problem;
    this.traceId = problem.traceId;
  }
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProblemDetails>;
  return (
    typeof candidate.type === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.status === "number"
  );
}

export function isGovApiError(value: unknown): value is GovApiError {
  return value instanceof GovApiError;
}

export function toGovApiError(
  input: unknown,
  fallbackStatus = 500,
  fallbackTitle = "Unexpected API error",
): GovApiError {
  if (input instanceof GovApiError) {
    return input;
  }

  if (isProblemDetails(input)) {
    return new GovApiError(input);
  }

  return new GovApiError({
    type: "about:blank",
    title: fallbackTitle,
    status: fallbackStatus,
    detail: input instanceof Error ? input.message : String(input),
  });
}