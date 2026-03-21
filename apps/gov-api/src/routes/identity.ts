// apps/gov-api/src/routes/identity.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData } from "../http/json";
import { requireAuth } from "../middleware/require-auth";

export function createIdentityRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.use("*", requireAuth);

  app.get("/me", async (c) => {
    const appContext = c.get("appContext");
    const requestContext = c.get("requestContext");
    const actor = requestContext.actor!;

    const result = await appContext.handlers.identity.getCurrentIdentity.execute({
      actor: {
        personId: actor.personId,
        userAccountId: actor.userAccountId,
        memberId: actor.memberId,
        email: actor.email,
      },
    });

    return c.json(jsonData(result), 200);
  });

  app.get("/roles", async (c) => {
    const appContext = c.get("appContext");
    const requestContext = c.get("requestContext");
    const actor = requestContext.actor!;

    const result = await appContext.handlers.identity.getAuthorityContext.execute({
      actor: {
        personId: actor.personId,
        roles: actor.roles,
        authorityGrants: actor.authorityGrants,
      },
    });

    return c.json(jsonData(result), 200);
  });

  return app;
}