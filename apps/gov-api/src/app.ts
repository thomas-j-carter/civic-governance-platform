// apps/gov-api/src/app.ts

import { Hono } from "hono";
import type { AppContext } from "./context/app-context";
import type { HonoEnv } from "./types/hono";
import { requestContextMiddleware } from "./middleware/request-context";
import { createAppContextMiddleware } from "./middleware/app-context";
import { errorHandler } from "./middleware/error-handler";
import { createApiRoutes } from "./routes";

export function createApp(appContext: AppContext): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.use("*", requestContextMiddleware);
  app.use("*", createAppContextMiddleware(appContext));
  app.use("*", errorHandler);

  app.get("/health", (c) => {
    return c.json(
      {
        ok: true,
        service: "gov-api",
      },
      200,
    );
  });

  app.route("/api/v1", createApiRoutes());

  return app;
}
