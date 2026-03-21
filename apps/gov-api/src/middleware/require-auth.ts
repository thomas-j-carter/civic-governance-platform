// apps/gov-api/src/middleware/require-auth.ts

import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types/hono";
import { UnauthorizedError } from "../http/errors";

export const requireAuth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const requestContext = c.get("requestContext");

  if (!requestContext.actor?.isAuthenticated) {
    throw new UnauthorizedError();
  }

  await next();
};
