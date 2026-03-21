// apps/gov-api/src/middleware/auth.ts

import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types/hono";
import { UnauthorizedError } from "../http/errors";

/**
 * This is intentionally a skeleton.
 *
 * In production this should:
 * - validate bearer JWT
 * - extract person/user/member identity
 * - resolve roles and authority grants
 * - attach actor to request context
 */
export const authMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const authorization = c.req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    throw new UnauthorizedError("Bearer token was empty.");
  }

  const requestContext = c.get("requestContext");

  c.set("requestContext", {
    ...requestContext,
    actor: {
      personId: "dev-person-id",
      userAccountId: "dev-user-account-id",
      memberId: "dev-member-id",
      email: "dev@example.com",
      roles: ["developer"],
      authorityGrants: [
        "proposal.create_draft",
        "proposal.version.create",
        "proposal.version.set_current",
        "proposal.submit",
        "proposal.assign_committee",
      ],
      isAuthenticated: true,
    },
  });

  await next();
};