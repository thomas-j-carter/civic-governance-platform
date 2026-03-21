// apps/gov-api/src/middleware/request-context.ts

import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types/hono";
import { createRequestId } from "../http/request-id";

export const requestContextMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const requestId = c.req.header("x-request-id") ?? createRequestId();

  c.set("requestContext", {
    requestId,
    actor: null,
  });

  c.header("x-request-id", requestId);

  await next();
};