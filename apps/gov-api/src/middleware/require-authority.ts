// apps/gov-api/src/middleware/require-authority.ts

import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types/hono";
import { ForbiddenError } from "../http/errors";

export function requireAuthority(authority: string): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const requestContext = c.get("requestContext");
    const actor = requestContext.actor;

    if (!actor?.isAuthenticated) {
      throw new ForbiddenError("Authenticated actor context is required.");
    }

    if (!actor.authorityGrants.includes(authority)) {
      throw new ForbiddenError(`Missing required authority: ${authority}`, {
        code: "insufficient_authority",
      });
    }

    await next();
  };
}