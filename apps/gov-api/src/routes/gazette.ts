import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData } from "../http/json";
import { requireAuth } from "../middleware/require-auth";
import { requireAuthority } from "../middleware/require-authority";
import { NotFoundError, ValidationError } from "../http/errors";
import { runIdempotentCommand } from "../http/idempotency";

export function createGazetteRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.get("/issues", requireAuth, requireAuthority("gazette.issue.read"), async (c) => {
    const appContext = c.get("appContext");
    const result = await appContext.handlers.gazette.listIssues.execute();
    return c.json(jsonData(result), 200);
  });

  app.get(
    "/issues/:issueId",
    requireAuth,
    requireAuthority("gazette.issue.read"),
    async (c) => {
      const appContext = c.get("appContext");
      const issueId = c.req.param("issueId");

      const result = await appContext.handlers.gazette.getIssue.execute({
        issueId,
      });

      if (!result) {
        throw new NotFoundError(`Gazette issue ${issueId} was not found.`);
      }

      return c.json(jsonData(result), 200);
    },
  );

  app.post("/issues", requireAuth, requireAuthority("gazette.issue.create"), async (c) => {
    const appContext = c.get("appContext");
    const actor = c.get("requestContext").actor!;
    const body = await c.req.json<{
      issueNumber?: string;
      title?: string;
      scheduledFor?: string;
    }>();

    const errors: Record<string, string[]> = {};
    if (!body.title?.trim()) {
      errors.title = ["title is required."];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Create gazette issue request was invalid.", errors);
    }

    const requestPayload = {
      issueNumber: body.issueNumber,
      title: body.title!,
      scheduledFor: body.scheduledFor,
    };

    const result = await runIdempotentCommand({
      c,
      operationName: "gazette.issue.create",
      requestBody: requestPayload,
      execute: async () =>
        appContext.handlers.gazette.createIssue.execute({
          actor: { personId: actor.personId },
          input: requestPayload,
        }),
    });

    return c.json(jsonData(result), 201);
  });

  app.get(
    "/issues/:gazetteIssueId/entries",
    requireAuth,
    requireAuthority("gazette.entry.read"),
    async (c) => {
      const appContext = c.get("appContext");
      const gazetteIssueId = c.req.param("gazetteIssueId");

      const result = await appContext.handlers.gazettePromotion.listEntries.execute({
        gazetteIssueId,
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/issues/:gazetteIssueId/entries",
    requireAuth,
    requireAuthority("gazette.entry.create"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const gazetteIssueId = c.req.param("gazetteIssueId");
      const body = await c.req.json<{
        officialRecordId?: string;
        publicationOrder?: number;
      }>();

      const errors: Record<string, string[]> = {};
      if (!body.officialRecordId?.trim()) {
        errors.officialRecordId = ["officialRecordId is required."];
      }

      if (Object.keys(errors).length > 0) {
        throw new ValidationError("Add record to gazette issue request was invalid.", errors);
      }

      const requestPayload = {
        gazetteIssueId,
        officialRecordId: body.officialRecordId!,
        publicationOrder: body.publicationOrder,
      };

      const result = await runIdempotentCommand({
        c,
        operationName: "gazette.entry.create",
        requestBody: requestPayload,
        execute: async () =>
          appContext.handlers.gazettePromotion.addRecordToIssue.execute({
            actor: { personId: actor.personId },
            input: requestPayload,
          }),
      });

      return c.json(jsonData(result), 201);
    },
  );

  app.post(
    "/issues/:issueId/actions/publish",
    requireAuth,
    requireAuthority("gazette.issue.publish"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const issueId = c.req.param("issueId");
      const body = await c.req.json<{ note?: string; publishedAt?: string }>().catch(() => ({}));

      const result = await appContext.handlers.gazette.publishIssue.execute({
        actor: { personId: actor.personId },
        issueId,
        input: {
          note: body.note,
          publishedAt: body.publishedAt,
        },
      });

      return c.json(jsonData(result), 200);
    },
  );

  return app;
}
