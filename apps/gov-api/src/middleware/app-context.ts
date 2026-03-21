// apps/gov-api/src/middleware/app-context.ts

import type { MiddlewareHandler } from "hono";
import type { AppContext } from "../context/app-context";
import type { HonoEnv } from "../types/hono";

export function createAppContextMiddleware(
  appContext: AppContext,
): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    c.set("appContext", appContext);
    await next();
  };
}