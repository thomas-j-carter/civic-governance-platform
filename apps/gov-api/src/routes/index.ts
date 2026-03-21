// apps/gov-api/src/routes/index.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { createIdentityRoutes } from "./identity";
import { createProposalRoutes } from "./proposals";

export function createApiRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.route("/identity", createIdentityRoutes());
  app.route("/proposals", createProposalRoutes());

  return app;
}