// apps/gov-api/src/middleware/error-handler.ts

import type { Context, MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types/hono";
import { HttpProblemError, InternalServerError } from "../http/errors";

export const errorHandler: MiddlewareHandler<HonoEnv> = async (c, next) => {
  try {
    await next();
  } catch (error) {
    return handleError(c, error);
  }
};

function handleError(c: Context<HonoEnv>, error: unknown): Response {
  const requestContext = c.get("requestContext");
  const traceId = requestContext?.requestId;

  if (error instanceof HttpProblemError) {
    return c.json(
      {
        ...error.problem,
        traceId: error.problem.traceId ?? traceId,
        instance: error.problem.instance ?? c.req.path,
      },
      error.problem.status as 400 | 401 | 403 | 404 | 409 | 422 | 500,
    );
  }

  const fallback = new InternalServerError(undefined, {
    instance: c.req.path,
    traceId,
  });

  return c.json(fallback.problem, 500);
}